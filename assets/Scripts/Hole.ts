
const {ccclass, property} = cc._decorator;

@ccclass
export default class Hole extends cc.Component {
    @property
    spawnProbability = 1;
    @property
    maxPercentage = 1;
    margin = 64;
    r = 0;
    R = 0;
    onLoad () {
        this.r = this.node.width/2;
        this.R = this.r + this.margin;
    }
    start () {

    }

    // update (dt) {}

}