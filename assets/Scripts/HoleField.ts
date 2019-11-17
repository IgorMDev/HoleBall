import Hole from "./Hole";
import HoleSpawner from "./HoleSpawner";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HoleField extends cc.Component {
    @property(cc.Node)
    rectNode: cc.Node = null;
    
    holesPool: cc.Node[] = [];
    activeHoles: cc.Node[] = [];
    done = false;
    clearDone = true;
    onLoad() {
        this.holesPool = [...this.rectNode.children];
    }
    start(){
        this.clear();
    }
    clear(){
        for(let n of this.holesPool){
            n.active = false;
        }
        this.clearDone = true;
    }
    setClear(){
        if(cc.Camera.main.containsNode(this.node)){
            this.clearDone = false;
            console.log("_____field cleared by anim " +this.node.name);
            
        }else{
            this.clear();
            console.log("_____field cleared by func "+this.node.name);
        }
    }
    reset(){
        this.clear();
        this.done = false;
    }
    update(dt){
        this.holeEmitter();
        this.holeCleaner();
    }
    holeCleaner(){
        if(!this.clearDone && this.done){
            if(this.activeHoles.length){
                let r = Math.floor(Math.random()*this.activeHoles.length);
                let hn = this.activeHoles[r];
                hn.active = false;
                this.holesPool.push(hn);
            }else{
                this.clearDone = true;
            }
        }
    }
    holeEmitter(){
        if(!this.done && this.clearDone){
            if(this.holesPool.length){
                let r = Math.floor(Math.random()*this.holesPool.length);
                let hn = this.holesPool[r];
                hn.active = true;
                this.activeHoles.push(hn);
            }else{
                this.done = true;
            }
        }
    }
}
