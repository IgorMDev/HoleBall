
const {ccclass, property} = cc._decorator;
import Mathu from "./MathModule";
@ccclass
export default class PlatformBlock extends cc.Component {
    @property
    moveSpeed = 0;
    @property
    rotationSpeed: number = 0;
    @property({
        min: 0,
        max: 45
    })
    rotaionConstraint: number = 0;
    rb: cc.RigidBody = null;
    rotationAxis = 0;
    moveAxis = 0;
    onLoad () {
        this.rb = this.getComponent(cc.RigidBody);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    start () {
        
    }

    update (dt) {
        if(this.rotationAxis != 0){
            this.tilt(this.rotationSpeed*this.rotationAxis*dt);
        }
        if(this.moveAxis != 0){
            this.node.position = cc.v2(this.node.position.x, this.node.position.y + this.moveSpeed*this.moveAxis*dt);
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
            case cc.macro.KEY.up:
                this.moveAxis = 1;
            break;
            case cc.macro.KEY.down:
                this.moveAxis = -1;
            break;
        }
    }
    onKeyUp(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this.rotationAxis = 0;
            break;
            case cc.macro.KEY.up:
            case cc.macro.KEY.down:
                this.moveAxis = 0;
            break;
        }
    }
    tilt(a){
        this.node.angle = Mathu.clamp(this.node.angle + a, -this.rotaionConstraint, this.rotaionConstraint);
    }
}
