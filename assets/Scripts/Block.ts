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

    rb: cc.RigidBody = null;
    startPos: cc.Vec2 = null;
    onLoad() {
        this.rb = this.getComponent(cc.RigidBody);
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
        
    }

    onDestroy(){

    }
    moveBy(dy){
        this.node.position = cc.v2(this.node.position.x, this.node.position.y + dy*this.moveSpeed);
    }
    tiltBy(a){
        this.node.angle = Mathu.clamp(this.node.angle + a*this.rotationSpeed, -this.rotaionConstraint, this.rotaionConstraint);
    }
}
