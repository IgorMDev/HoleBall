
import HoleField from "./HoleField";
import Hole from "./Hole";

const {ccclass, property} = cc._decorator;

type point = {x:number, y:number};
type cell = [number, number];
@ccclass
export default class RandomHoleField extends HoleField {
    @property(cc.Prefab)
    holePrefabs: cc.Prefab[] = [];
    @property({type: cc.Float, min: 0, max: 1})
    holesDensity: number[] = [];
    @property(cc.Prefab)
    gemPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    powerupPrefabs: cc.Prefab[] = [];
    @property(cc.Node)
    bonuseRect: cc.Node = null;
    @property
    maxGemsNum = 1;
    @property
    maxPowerupNum = 1;
    @property
    cellSize = 100;
    @property({min: 0, max: 1})
    maxFillPercentage = 0.5;
    @property([cc.Float])
    holeRadiuses: number[] = [];

    holeVariantsPool: Array<Array<cc.Node>> = [];
    timeout = 2500;
    holesPool: cc.Node[] = [];
    activeHoles: cc.Node[] = [];
    holeSampleIndex = null;
    freeCellIndex = null;
    holeVariant = 0;
    powerupVariant = -1;
    holesLimit = 20;
    numOfHoles = 0;
    gemsCount = 0;
    powerupsCount = 0;
    cellsMap: Map<string,cc.Node> = new Map();
    gridPoints: Map<cell,point> = new Map();
    freeCells: cell[] = [];
    rows = 0; 
    columns = 0;
    nodeSample: cc.Node = null;
    rect: cc.Rect = null;
    startTime = 0;
    done = true;
    clearDone = true;
    anim = false;
    startFillRate = 0;
    onLoad() {
        this.rect = this.rectNode.getBoundingBox();
        this.startFillRate = this.maxFillPercentage;
        this.rows = Math.ceil(this.rect.height / this.cellSize);
        this.columns = Math.ceil(this.rect.width / this.cellSize);
        console.log("---------grid initialized rows "+this.rows+" cols "+this.columns);
        let xspacing = (this.rect.width - this.columns*this.cellSize) / (this.columns+1),
            yspacing = (this.rect.height - this.rows*this.cellSize) / (this.rows+1);
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                this.gridPoints.set([i, j],{
                    x: this.rect.x + xspacing*(j+1) + this.cellSize*j + this.cellSize/2, 
                    y: this.rect.y + yspacing*(i+1) + this.cellSize*i + this.cellSize/2});
            }
        }
    }
    reset(){
        this.clear();
        this.maxFillPercentage = this.startFillRate;
        this.holesLimit = this.rows*this.columns*this.maxFillPercentage;
        this.activeHoles = [];
        this.holesPool = [];
        this.powerupVariant = -1;
        this.fillHolesPool(this.holeVariant = 0);
        //console.log("_____field resetted by func "+this.node.name);
    }
    clear(){
        for(let cn of this.activeHoles){
            cn.removeFromParent(false);
        }
        //console.log("_____field cleared by func "+this.node.name);
        
        this.onCleared();
    }
    onCleared(){
        this.clearBonuses();
        this.numOfHoles = 0;
        this.freeCells = [...this.gridPoints.keys()];
        if(this.activeHoles.length){
            this.holesPool.push(...this.activeHoles.splice(0));
        }
        this.cellsMap.clear();
        this.clearDone = true;
        
    }
    setClear(){
        if(this.isInParentRect()){
            this.clearDone = false;
            this.startTime = Date.now();
            //console.log("_____field cleared by anim " +this.node.name);
            
        }else{
            this.clear();
        }
    }
    spawn(){
        this.spawnGems();
        this.spawnPowerUp();
        let i = this.freeCells.length*2;
        while(i > 0 && this.numOfHoles <= this.holesLimit && this.freeCells.length > 0){
            let hole = this.getHoleSample();
            if(hole){
                if(this.checkExtent(hole) && !this.intersectNear(hole)){
                    this.spawnSample(hole);
                }
            }
            --i;
        }
        this.onSpawned();
        //console.log("_____field spawned by func "+this.node.name);
    }
    setSpawn(){
        this.done = false;
        this.spawnGems();
        this.spawnPowerUp();
        this.startTime = Date.now();
        
        if(this.isInParentRect()){
            this.anim = true;
            //console.log("_____field spawned by anim " +this.node.name);
        }else{
            this.anim = false;
            //this.spawn();
        }
    }
    onSpawned(){
        this.done = true;
    }
    isInParentRect(){
        if(this.node.y <= this.node.parent.height/2+this.node.height/2 &&
           this.node.y >= -this.node.parent.height/2-this.node.height/2){
            return true;
        }
        return false;
    }
    holeCleaner(){
        if(!this.clearDone && this.done){
            if(this.activeHoles.length > 0){
                let r = Math.floor(Math.random()*this.activeHoles.length);
                let h = this.activeHoles.splice(r, 1)[0];
                h.emit('remove', ()=>{h.removeFromParent(false);})
                this.holesPool.push(h);
                let estTime = Date.now() - this.startTime;
                if(this.clearDone = estTime > this.timeout){
                    this.clear();
                }
            }else{
                this.onCleared();
            }
        }
    }
    holeEmitter(){
        if(!this.done && this.clearDone){
            if(this.numOfHoles <= this.holesLimit && this.freeCells.length > 0){
                let hole = this.getHoleSample();
                if(hole){
                    if(this.checkExtent(hole) && !this.intersectNear(hole)){
                        this.spawnSample(hole);
                        if(this.anim) hole.emit('spawn');
                    }
                }
                let estTime = Date.now() - this.startTime;
                if(this.done = estTime > this.timeout){
                    this.spawn();
                }
            }else{
                this.onSpawned();
            }
        }
    }
    spawnSample(h: cc.Node){
        h.setParent(this.rectNode);
        let cell = this.freeCells.splice(this.freeCellIndex, 1)[0];
        this.cellsMap.set(cell[0]+''+cell[1], h);
        this.holesPool.splice(this.holeSampleIndex, 1);
        this.activeHoles.push(h);
        this.numOfHoles++;
        //console.log("----------sample spawned at cell "+cell+" map size "+this.cellsMap.size);
    }
    spawnPrefabIn(p: cc.Prefab, parent: cc.Node){
        let n = cc.instantiate(p);
        this.freeCellIndex = Math.floor(Math.random()*this.freeCells.length);
        let cpos = cc.v2(this.gridPoints.get(this.freeCells[this.freeCellIndex]));
        let cell = this.freeCells.splice(this.freeCellIndex, 1)[0];
        this.cellsMap.set(cell[0]+''+cell[1], n);
        n.setParent(parent);
        n.setPosition(cpos);
    }
    spawnGems(){
        if(this.gemsCount===0 && this.gemPrefab && this.freeCells){
        for(let i = 0; i < this.maxGemsNum && this.gemsCount <= this.maxGemsNum; ++i){
            if(Math.random() < 0.5){
                this.spawnPrefabIn(this.gemPrefab, this.bonuseRect);
                ++this.gemsCount;
                ++this.numOfHoles;
            }
        }
        //console.log("_____gems Spawned " +this.node.name);
        }
    }
    spawnPowerUp(){
        if(this.powerupsCount===0 && this.powerupVariant > -1 && this.powerupPrefabs && this.freeCells){
            for(let i = 0; i < this.maxPowerupNum && this.powerupsCount <= this.maxPowerupNum; ++i){
                if(Math.random() < 0.3){
                    let pup = this.powerupPrefabs[Math.floor(Math.random()*this.powerupVariant)];
                    this.spawnPrefabIn(pup, this.bonuseRect);
                    ++this.powerupsCount;
                    ++this.numOfHoles;
                    //console.log("_____powerup Spawned " +this.node.name);
                }
            }
        }
    }
    clearBonuses(){
        this.bonuseRect.destroyAllChildren()
        this.gemsCount = 0;
        this.powerupsCount = 0;
        //console.log("_____bonuses cleared " +this.node.name);
    }
    intersectNear(h: cc.Node){
        let l = 1,
            [r, c] = this.freeCells[this.freeCellIndex],
            r0 = Math.max(r - l, 0), r1 = Math.min(r + l, this.rows),
            c0 = Math.max(c - l, 0), c1 = Math.min(c + l, this.columns);
        for(let i = r0; i <= r1; i++){
            for(let j = c0; j <= c1; j++){
                let p = this.cellsMap.get(i+''+j);
                if(p && p.group==='hole'){
                    let bb1 = {position: h.position, radius: h.getComponent(Hole).getRadius()},
                    bb2 = {position: p.position, radius: p.getComponent(Hole).getRadius()};
                    if(cc.Intersection.circleCircle(bb1, bb2)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    checkExtent(h: cc.Node){
        let bb = h.getBoundingBox();
        return this.rect.containsRect(bb);
    }
    getHoleSample(){
        if(this.holesPool.length > 0){
            this.holeSampleIndex = Math.floor(Math.random()*this.holesPool.length);
            let hole = this.holesPool[this.holeSampleIndex];
            this.freeCellIndex = Math.floor(Math.random()*this.freeCells.length);
            let r = Math.random();
            this.setHoleRandSize(hole.getComponent(Hole));
            let cpos = cc.v2(this.gridPoints.get(this.freeCells[this.freeCellIndex]));
            let offsetp = cc.Vec2.RIGHT.mul(r*(this.cellSize/2)).rotate(r*2*Math.PI);
            hole.position = cpos.addSelf(offsetp);

            //console.log("------returned hole sample");
            return hole;
        }
        return null;
    }
    fillHolesPool(variant){
        if(variant < this.holePrefabs.length  && this.holesPool.length < this.rows*this.columns*2){
            if(!this.holeVariantsPool[variant]){
                let h = this.holePrefabs[variant];
                let fillNum = this.rows*this.columns*(this.holesDensity[variant] || 0);
                this.holeVariantsPool[variant] = [];
                for(let i = 0; i < fillNum; i++){
                    this.holeVariantsPool[variant].push(cc.instantiate(h));
                    
                }
                //console.log("-------variantsPool filled with "+fillNum+" holes of variant "+variant+', length '+this.holeVariantsPool[variant].length);
            }
            this.holesPool.push(...this.holeVariantsPool[variant]);
            //console.log("-------pool filled and length now "+this.holesPool.length);
        }
    }
    setHoleRandSize(h: Hole){
        let rad = this.holeRadiuses[Math.floor(Math.random()*this.holeRadiuses.length)]
        h.setHoleSize(rad);
    }

    levelUp(){
        let r = Math.random();
        if(r < 0.6){
            this.fillRateUp();
        }else{
            this.revealNextHole();
        }
    }
    fillRateUp(dr: number = 0.05){
        this.maxFillPercentage = cc.misc.clamp01(this.maxFillPercentage + dr);
        this.holesLimit = this.rows*this.columns*this.maxFillPercentage;
        cc.log(this.node.name+ ' fill rate up');
    }
    revealNextHole(){
        if(this.holeVariant < this.holePrefabs.length){
            cc.log(this.node.name+ ' revealed new node');
            this.fillHolesPool(++this.holeVariant);
        }
    }
    revealNextPowerUp(){
        if(this.powerupVariant < this.powerupPrefabs.length){
            cc.log(this.node.name+ ' revealed new poweup');
            ++this.powerupVariant;
        }
    }
}
