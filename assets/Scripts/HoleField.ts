import Hole from "./Hole";
import HoleSpawner from "./HoleSpawner";

const {ccclass, property} = cc._decorator;

type point = {x:number, y:number};
type cell = [number, number];
@ccclass
export default class HoleField extends cc.Component {
    @property(cc.Prefab)
    holePrefabs: cc.Prefab[] = [];
    @property
    cellSize = 100;
    @property({min: 0, max: 1})
    maxFillPercentage = 0.5;
    @property(cc.Node)
    rectNode: cc.Node = null;
    holesPool: cc.Node[] = [];
    activeHoles: cc.Node[] = [];
    holeSampleIndex = null;
    freeCellIndex = null;
    level = 1;
    numOfVariants = 0;
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
    done = false;
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
        this.fillHolesPool(this.numOfVariants);
    }
    start() {
        //this.reset(cc.v2(this.rect.center.x, this.rect.center.y));
        
    }
    resetR(){
        this.reset(cc.v2(this.rect.center.x, this.rect.center.y));
    }
    reset(p: cc.Vec2){
        this.numOfHoles = 0;
        for(let [,cn] of this.cellsMap){
            cn.parent = null;
        }
        this.cellsMap.clear();
        this.freeCells = [...this.gridPoints.keys()];
        if(this.activeHoles.length){
            this.holesPool.push(...this.activeHoles);
            this.activeHoles = [];
        }
        
        console.log("rect "+this.rect);
        this.startTime = Date.now();
        this.done = false;
        console.log("---------reset");
        
        //this.spawnSample();
    }
    update(dt){
        this.holeEmitter();
    }
    holeEmitter(){
        if(!this.done){
            if(this.numOfHoles <= this.holesLimit && this.freeCells.length > 0){
                let hole = this.getHoleSample();
                if(hole){
                    if(this.checkExtent(hole) && !this.intersectNear(hole)){
                        this.spawnSample(hole);
                    }
                }
            }
            let estTime = Date.now() - this.startTime;
            this.done = estTime > 2000;
            /* for(let entry of this.cellsMap.entries()){
                console.log("entry "+entry);
                
            } */
            
        }
    }
    spawnSample(h: cc.Node){
        h.parent = this.rectNode;
        let cell = this.freeCells.splice(this.freeCellIndex, 1)[0];
        this.cellsMap.set(cell[0]+''+cell[1], h);
        this.holesPool.splice(this.holeSampleIndex, 1);
        this.activeHoles.push(h);
        this.numOfHoles++;
        console.log("----------sample spawned at cell "+cell+" map size "+this.cellsMap.size);
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
                    let bb1 = {position: h.position, radius: Math.max(h.width, h.height)/2},
                    bb2 = {position: p.position, radius: Math.max(p.width, p.height)/2};
                    if(cc.Intersection.circleCircle(bb1, bb2)) {
                        //console.log("*******intersects");
                        
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
            let size = hole.getComponent(Hole).sizes[Math.floor(r*hole.getComponent(Hole).sizes.length)];
            hole.width = size.x; hole.height = size.y;
            let cpos = cc.v2(this.gridPoints.get(this.freeCells[this.freeCellIndex]));
            let offsetp = cc.Vec2.RIGHT.mulSelf(r*(this.cellSize/2)).rotateSelf(r*2*Math.PI);
            hole.position = cpos.addSelf(offsetp);

            //console.log("------returned hole sample");
            return hole;
        }
        return null;
    }
    fillHolesPool(variant){
        if(variant < this.holePrefabs.length && this.holesPool.length < this.holesLimit*2){
            let h = this.holePrefabs[variant];
            let fillNum = this.rows*this.columns*h.data.getComponent(Hole).maxPercentage;
            for(let i = 0; i < fillNum; i++){
                this.holesPool.push(cc.instantiate(h));
            }
            console.log("-------pool filled with "+fillNum+" holes of variant "+variant);
        }
    }
    
}
