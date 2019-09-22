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

    holesPool: cc.Node[] = [];
    activeHoles: cc.Node[] = [];
    holeSampleIndex = null;
    level = 1;
    numOfVariants = 0;
    holesLimit = 20;
    numOfHoles = 0;
    pointsMap: Map<point, cc.Node> = new Map();
    gridPoints: point[] = [];
    freePoints: point[] = [];
    rows = 0; 
    columns = 0;
    nodeSample: cc.Node = null;
    rect: cc.Rect = null;
    startTime = 0;
    done = false;
    onLoad() {
        this.rect = this.node.getBoundingBox();
        
        this.node.on('touchstart', this.touchStart, this);
        
        this.rows = Math.ceil(this.rect.height / this.cellSize);
        this.columns = Math.ceil(this.rect.width / this.cellSize);
        console.log("---------grid initialized rows "+this.rows+" cols "+this.columns);
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.columns; j++){
                this.gridPoints.push({
                    x: this.rect.x + this.cellSize/2 + this.cellSize*j, 
                    y: this.rect.y + this.cellSize/2 + this.cellSize*i});
            }
        }
        this.holesLimit = this.rows*this.columns*this.maxFillPercentage;
        this.fillHolesPool(this.numOfVariants);
    }
    start() {
        //this.reset(cc.v2(this.rect.center.x, this.rect.center.y));
        
    }
    reset(p: cc.Vec2){
        this.numOfHoles = 0;
        for(let [,cn] of this.pointsMap){
            cn.parent = null;
        }
        this.pointsMap.clear();
        this.freePoints = [...this.gridPoints];
        if(this.activeHoles.length){
            this.holesPool.push(...this.activeHoles);
            this.activeHoles = [];
        }
        this.startTime = Date.now();
        this.done = false;
        console.log("---------reset");
        
        //this.spawnSample();
    }
    update(dt){
        this.emitter();
    }
    emitter(){
        if(!this.done){
            if(this.numOfHoles <= this.holesLimit && this.freePoints.length > 0){
                let rCell = Math.floor(Math.random()*this.freePoints.length);
                let pos = this.freePoints[rCell];
                let hole = this.getHoleSample();
                if(pos && hole){
                    hole.position = cc.v2(pos);
                    if(this.checkExtent(hole) && !this.intersectNear(hole)){
                        this.spawnSample(hole);
                        this.freePoints.splice(rCell,1);
                    }
                }
            }
            let estTime = Date.now() - this.startTime;
            this.done = estTime > 1000;
        }
    }
    spawnSample(h: cc.Node){
        h.parent = this.node;
        this.pointsMap.set(h.position, h);
        this.holesPool.splice(this.holeSampleIndex, 1);
        this.activeHoles.push(h);
        this.numOfHoles++;
        console.log("----------sample spawned at pos "+h.position+" parent "+h.parent.name);
    }
    intersectNear(h: cc.Node){
        let l = 1,
            r = Math.ceil(h.position.y/this.cellSize),
            c = Math.ceil(h.position.x/this.cellSize),
            r0 = Math.max(r - l, 0), r1 = Math.min(r + l, this.rows),
            c0 = Math.max(c - l, 0), c1 = Math.min(c + l, this.columns);
        for(let i = r0; i <= r1; i++){
            for(let j = c0; j <= c1; j++){
                let p = this.pointsMap.get({x:i, y:j});
                if(p){
                    let bb1 = {position: h.position, radius: Math.max(h.width, h.height)/2},
                    bb2 = {position: p.position, radius: Math.max(p.width, p.height)/2};
                    if(cc.Intersection.circleCircle(bb1, bb2)) return true;
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
            console.log("------returned hole sample");
            return this.holesPool[this.holeSampleIndex];
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
    touchStart(event: cc.Event.EventTouch){
        this.reset(event.getLocation());
    }
}
