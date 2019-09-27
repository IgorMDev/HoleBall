
const {ccclass, property} = cc._decorator;

@ccclass
export default class Level extends cc.Component {
    @property
    speed = 0;
    onLoad () {
        
    }
    start () {

    }

    // update (dt) {}

    move(dy: number){}
    reset(){}
}