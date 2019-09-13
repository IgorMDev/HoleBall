
const {ccclass, property} = cc._decorator;
import Mathu from "./MathModule";
@ccclass
export default class Block extends cc.Component {

    @property
    rotationSpeed: number = 0;
    @property({
        min: 0,
        max: 45
    })
    rotaionConstraint: number = 0;
    rotationAxis: number = 0
    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    start () {
        
    }

    update (dt) {
        if(this.rotationAxis != 0){
            this.tilt(this.rotationSpeed*this.rotationAxis*dt);
        }
    }

    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    onKeyDown(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.left:
                this.rotationAxis = 1;
            break;
            case cc.macro.KEY.right:
                this.rotationAxis = -1;
            break;
        }
    }
    onKeyUp(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this.rotationAxis = 0;
            break;
        }
    }
    tilt(a){
        this.node.angle = Mathu.clamp(this.node.angle + a, -this.rotaionConstraint, this.rotaionConstraint);
    }
}
