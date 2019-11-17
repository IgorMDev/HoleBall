import Ball from "./Ball";
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

    ccol: cc.CircleCollider = null;
    onLoad () {
        this.ccol = this.getComponent(cc.CircleCollider);
    }
    setSize(r: number){
        this.node.width = this.node.height = (r+this.border)*2;
        this.getComponent(cc.CircleCollider).radius = r;
    }
    setRandSize(){
        let r = this.radiuses[Math.floor(Math.random()*this.radiuses.length)];
        this.setSize(r);
    }
}