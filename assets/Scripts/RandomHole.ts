
import Hole from "./Hole";

const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(Hole)
export default class RandomHole extends cc.Component {
    @property
    spawnProbability = 1;
    @property
    border = 0;
    @property({type: cc.Float})
    radiuses: number[] = [];

    setSize(r: number){
        let nr = (r+this.border)*2;
        this.node.setScale(this.node.width/nr, this.node.height/nr);
        //this.getComponent(cc.CircleCollider).radius = r;
    }
    setRandSize(){
        let r = this.radiuses[Math.floor(Math.random()*this.radiuses.length)];
        this.setSize(r);
    }
}