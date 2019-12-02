
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
    @property
    cellSize = 100;
    @property({min: 0, max: 1})
    maxFillPercentage = 0.5;
    @property([cc.Float])
    holeRadiuses: number[] = [];

    timeout = 2500;
    holesPool: cc.Node[] = [];
    activeHoles: cc.Node[] = [];
    holeSampleIndex = null;
    freeCellIndex = null;
    holeVariant = 0;
    holesLimit = 20;
    numOfHoles = 0;
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
    onLoad() {
        this.rect = this.rectNode.getBoundingBox();
        this.rows = Math.ceil(this.rect.height / this.cellSize);
        this.columns = Math.ceil(this.rect.width / this.cellSize);
        console.log("---------grid initialized rows "+this.rows+" cols "+this.columns);
        let xspacing = (this.rect.width - this.columns*this.cellSize) / this.columns,
            yspacing = (this.rect.height - this.rows*this.cellSize) / this.rows;
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                this.gridPoints.set([i, j],{
                    x: this.rect.x + xspacing + this.cellSize/2 + this.cellSize*j, 
                    y: this.rect.y + yspacing + this.cellSize/2 + this.cellSize*i});
            }
        }
        this.holesLimit = this.rows*this.columns*this.maxFillPercentage;
        this.fillHolesPool(this.holeVariant);
    }
    start(){}
    reset(){
        this.numOfHoles = 0;
        this.freeCells = [...this.gridPoints.keys()];
        if(this.activeHoles.length){
            this.holesPool = this.activeHoles.splice(0);
        }
    }
    clear(){
        if(this.cellsMap.size){
            for(let [,cn] of this.cellsMap){
                cn.removeFromParent(false);
            }
            this.cellsMap.clear();
            this.clearDone = true;
        }
        this.reset();
        
    }
    setClear(){
        if(this.isInParentRect()){
            this.clearDone = false;
            this.startTime = Date.now();
            console.log("_____field cleared by anim " +this.node.name);
            
        }else{
            this.clear();
            console.log("_____field cleared by func "+this.node.name);
        }
    }
    spawn(){
        let i = 0;
        while(i < this.freeCells.length*2 && this.numOfHoles <= this.holesLimit && this.freeCells.length > 0){
            let hole = this.getHoleSample();
            if(hole){
                if(this.checkExtent(hole) && !this.intersectNear(hole)){
                    this.spawnSample(hole);
                }
            }
            ++i;
        }
        this.done = true;
    }
    setSpawn(){
        if(this.isInParentRect()){
            this.done = false;
            this.startTime = Date.now();
            console.log("_____field spawned by anim " +this.node.name);
        }else{
            this.spawn();
            console.log("_____field spawned by func "+this.node.name);
        }
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
            if(this.cellsMap.size){
                let r = Math.floor(Math.random()*this.cellsMap.size);
                let key = [...this.cellsMap.keys()][r];
                let cellNode = this.cellsMap.get(key);
                if(cellNode){
                    cellNode.emit('remove', ()=>{cellNode.removeFromParent(false);})
                    this.cellsMap.delete(key);
                }
                let estTime = Date.now() - this.startTime;
                if(this.clearDone = estTime > this.timeout){
                    this.clear();
                }
            }else{
                this.reset();
                this.clearDone = true;
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
                        hole.emit('spawn');
                    }
                }
                let estTime = Date.now() - this.startTime;
                if(this.done = estTime > this.timeout){
                    this.spawn();
                }
            }else{
                this.done = true;
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
    intersectNear(h: cc.Node){
        let l = 2,
            [r, c] = this.freeCells[this.freeCellIndex],
            r0 = Math.max(r - l, 0), r1 = Math.min(r + l, this.rows),
            c0 = Math.max(c - l, 0), c1 = Math.min(c + l, this.columns);
        for(let i = r0; i <= r1; i++){
            for(let j = c0; j <= c1; j++){
                let p = this.cellsMap.get(i+''+j);
                if(p){
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
        if(this.holesPool.length > 0 && this.freeCells.length > 0){
            this.holeSampleIndex = Math.floor(Math.random()*this.holesPool.length);
            let hole = this.holesPool[this.holeSampleIndex];
            this.freeCellIndex = Math.floor(Math.random()*this.freeCells.length);
            let r = Math.random();
            this.setHoleRandSize(hole.getComponent(Hole));
            let cpos = cc.v2(this.gridPoints.get(this.freeCells[this.freeCellIndex]));
            let offsetp = cc.Vec2.RIGHT.mul(r*(this.cellSize/2)).rotate(r*2*Math.PI);
            hole.position = cpos.add(offsetp);

            //console.log("------returned hole sample");
            return hole;
        }
        return null;
    }
    fillHolesPool(variant){
        if(variant < this.holePrefabs.length && this.holesPool.length < this.rows*this.columns*2){
            let h = this.holePrefabs[variant];
            let fillNum = this.rows*this.columns*(this.holesDensity[variant] || 0);
            for(let i = 0; i < fillNum; i++){
                this.holesPool.push(cc.instantiate(h));
                
            }
            //console.log("-------pool filled with "+fillNum+" holes of variant "+variant);
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
        cc.log(this.node.name+ 'fill rate up');
    }
    revealNextHole(){
        if(this.holeVariant < this.holePrefabs.length){
            this.fillHolesPool(this.holeVariant++);
            cc.log(this.node.name+ 'revealed new node');
        }
    }
}
