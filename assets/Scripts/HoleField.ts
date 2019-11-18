import Hole from "./Hole";
import HoleSpawner from "./HoleSpawner";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HoleField extends cc.Component {
    @property(cc.Node)
    rectNode: cc.Node = null;
    
    holesPool: cc.Node[] = [];
    activeHoles: cc.Node[] = [];
    done = true;
    clearDone = true;
    onLoad() {
        this.activeHoles = [...this.rectNode.children];
        cc.log('copy children, count '+this.holesPool.length);
    }
    start(){
        this.clear();
    }
    clear(){
        if(this.activeHoles.length){
            for(let n of this.activeHoles){
                n.active = false;
            }
            this.holesPool = this.activeHoles.splice(0);
            this.clearDone = true;
            console.log("_____field cleared " +this.node.name);
        }
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
    update(){
        this.holeEmitter();
        this.holeCleaner();
    }
    holeCleaner(){
        if(!this.clearDone && this.done){
            if(this.activeHoles.length){
                let r = Math.floor(Math.random()*this.activeHoles.length);
                let hn = this.activeHoles.splice(r,1)[0];
                hn.emit('remove');
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
                let hn = this.holesPool.splice(r,1)[0];
                hn.emit('spawn', ()=>{hn.active = true;});
                this.activeHoles.push(hn);
            }else{
                this.done = true;
            }
        }
    }
}
