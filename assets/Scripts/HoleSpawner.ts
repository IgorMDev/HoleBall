import Hole from "./Hole";

const {ccclass, property} = cc._decorator;

type point = [number, number];
@ccclass
export default class HoleSpawner extends cc.Component {
    @property(cc.Prefab)
    holePrefabs: cc.Prefab[] = null;
    @property
    cellSize = 100;
    @property
    cellMargin = 0;

    pool: Hole[][];
    poolInd: number[];
    holeSample: Hole = null;
    rect: cc.Rect = null;
    
    holes: Hole[] = [];
    actives: Hole[] = [];
    n: number = 0;
    k = 15;
    done = false;
    onLoad() {

        this.rect = new cc.Rect(this.node.position.x-this.node.width*this.node.anchorX, 
                                this.node.position.y-this.node.height*this.node.anchorY,
                                this.node.width, this.node.height);
        console.log("rect "+this.rect);
        this.node.on('touchstart', this.touchStart, this);
        this.pool = [[]];
    }
    start() {
        //this.reset(cc.v2(this.rect.center.x, this.rect.center.y));
        
    }
    reset(p: cc.Vec2){
        for(let cn of this.node.children){
            cn.parent = null;
        }
        
        this.poolInd = [0];
        this.actives = [], this.holes = [];
        this.n = 0;
        this.done = false;
        this.spawnSample(this.getHoleSample(p));
    }
    update(dt){
        this.emitter();
    }
    emitter(){
        if(!this.done && this.n > 0){
        let startTime = Date.now();
        do{
            let i = Math.floor(Math.random() * this.n) || 0,
                ah = this.actives[i];
            console.log("-----i = "+i+" hole = "+ ah+" length "+this.actives.length);
            
            for(var j = 0; j < this.k; j++){
                let h = this.generateAround(ah);
                /* if(this.checkExtent(h) && !this.checkNear(h)){
                    this.spawnSample(h);
                    break;
                } */
            }
            if(j === this.k){
                this.actives[i] = this.actives[--this.n];
                this.actives.pop();
            }
        }while(this.n && Date.now() - startTime < 166);
        this.done = true;
        }
    }
    spawnSample(h: Hole){
        h.node.parent = this.node;
        this.actives.push(h);
        this.holes.push(h);
        this.n++;
        this.holeSample = null;
        console.log("sample spawned at pos "+h.node.position+" parent "+h.node.parent.name);
    }
    checkNear(h: Hole){
        let hrect = new cc.Rect(h.node.position.x-h.node.width*h.node.anchorX, 
            h.node.position.y-h.node.height*h.node.anchorY,
            h.node.width, h.node.height);
        let bb = h.getComponent(cc.PhysicsCircleCollider).getAABB();
        console.log("aabb is "+bb);
        
        let ab = (cc.director.getPhysicsManager().testAABB(bb));
        console.log("collided with "+ab.length);
        
        return ab.length > 0;
    }
    checkExtent(h: Hole){
        let hrect = new cc.Rect(h.node.position.x-h.node.width*h.node.anchorX, 
            h.node.position.y-h.node.height*h.node.anchorY,
            h.node.width, h.node.height);
        return this.rect.containsRect(hrect);
    }
    generateAround(h: Hole){
        /* let a = Math.random() * 2 * Math.PI,
            r = h.R*2 + h.margin + Math.random()*h.r;
        let p = cc.v2(h.node.position.x + r*Math.cos(a),h.node.position.y + r*Math.sin(a));
        console.log("*******gen at point "+p);
        
        return this.getHoleSample(p); */
    }
    getHoleSample(p?: cc.Vec2){
        if(!this.holeSample){
            
        }
        if(p) this.holeSample.node.position = p;
        return this.holeSample;
    }
    touchStart(event: cc.Event.EventTouch){
        this.reset(event.getLocation());
    }
}
