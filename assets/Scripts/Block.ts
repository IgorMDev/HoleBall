import Mathu from "./MathModule";
const {ccclass, property} = cc._decorator;

@ccclass
export default class PlatformBlock extends cc.Component {
    @property
    moveSpeed = 0;
    @property
    rotationSpeed: number = 0;
    @property({min: 0,max: 45})
    rotaionConstraint: number = 0;
    @property(cc.Node)
    touchArea: cc.Node = null;

    rb: cc.RigidBody = null;
    rotationAxis = 0;
    moveAxis = 0;
    touchVec: cc.Vec2 = cc.Vec2.ZERO;
    startPos: cc.Vec2 = null;
    onLoad() {
        this.rb = this.getComponent(cc.RigidBody);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.touchArea.on('touchstart', this.touchStart, this.touchArea);
        this.touchArea.on('touchend', this.touchEnd, this.touchArea);
        this.startPos = this.node.position;
    }
    onEnable(){
        this.node.position = this.startPos;
        this.node.angle = 0;
        console.log("platform starts at pos "+ this.startPos);
    }
    start(){
        let streak = this.getComponent(cc.MotionStreak);
        
    }

    update(dt) {
        if(this.rotationAxis != 0){
            this.tilt(this.rotationSpeed*this.rotationAxis*dt);
        }
        if(this.moveAxis != 0){
            this.node.position = cc.v2(this.node.position.x, this.node.position.y + this.moveSpeed*this.moveAxis*dt);
            
        }
        if(this.touchVec.mag() > 0){
            //this.node.position.addSelf(this.touchVec.mul(dt));
            this.touchArea.position = this.touchArea.position.addSelf(this.touchVec.mul(dt));
            cc.Camera.main.node.position = cc.Camera.main.node.position.addSelf(this.touchVec.mul(dt));
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
    touchStart = (event: cc.Event.EventTouch) => {
        let loc = event.getLocation();
        let dx = loc.x - this.touchArea.width/2,
            dy = loc.y - this.touchArea.height/2;
        this.touchVec = cc.v2(dx, dy);
        console.log("*******t loc "+loc);
        
    }
    touchEnd = (event: cc.Event.EventTouch) => {
        this.touchVec = cc.Vec2.ZERO;
    }
    tilt(a){
        this.node.angle = Mathu.clamp(this.node.angle + a, -this.rotaionConstraint, this.rotaionConstraint);
    }
}
