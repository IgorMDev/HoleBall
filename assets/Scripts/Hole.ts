
const {ccclass, property} = cc._decorator;

@ccclass
export default class Hole extends cc.Component {
    @property
    spawnProbability = 1;
    @property
    maxPercentage = 1;
    @property(cc.Vec2)
    sizes: cc.Vec2[] = [];
    
    onLoad () {
        
    }
    start () {

    }

    // update (dt) {}

}