import Mathu from "./MathModule";
import Accelerator from "./Accelerator";
const {ccclass, property,requireComponent} = cc._decorator;

@ccclass
export default class PlatformBlock extends cc.Component {
    @property
    rotationSpeed: number = 0;
    @property({min: 0,max: 45})
    rotaionConstraint: number = 0;
    @property
    moveSpeed: number = 0;
    @property
    moveDelta: number = 0;
    @property(cc.String)
    moveEasing: string = '';
    @property(cc.String)
    rotEasing: string = '';

    moveAcc: Accelerator = null;
    rotAcc: Accelerator = null;
    rb: cc.RigidBody = null;
    spawnTween: cc.Tween = null;
    removeTween: cc.Tween = null;
    startY = 0;
    onLoad() {
        this.rb = this.getComponent(cc.RigidBody);
        this.spawnTween = cc.tween(this.node).set({scaleX: 0}).to(0.5,{scaleX: 1},null);
        this.removeTween = cc.tween(this.node).to(0.5, {scaleX: 0}, null);
        this.startY = this.node.y;
        this.moveAcc = this.node.addComponent(Accelerator);
        this.rotAcc = this.node.addComponent(Accelerator);
        this.moveAcc.isFlipping = true;
        this.rotAcc.isFlipping = true;
        this.moveAcc.setEasing(this.moveEasing);
        this.rotAcc.setEasing(this.rotEasing);
    }
    onEnable(){
        
    }
    start(){
        this.node.scaleX = 0;
    }
    spawn(){
        this.reset();
        this.spawnTween.start();
    }
    remove(){
        this.removeTween.start();
    }
    onDestroy(){

    }
    reset(){
        this.node.angle = 0;
        this.node.y = this.startY;
    }
    moveBy(dy){
        this.node.y = Mathu.clamp(this.node.y + this.moveAcc.by(dy)*this.moveSpeed*cc.director.getDeltaTime(), this.startY-this.moveDelta, this.startY+this.moveDelta);
    }
    tiltBy(da){
        this.node.angle = Mathu.clamp(this.node.angle + this.rotAcc.by(da)*this.rotationSpeed*cc.director.getDeltaTime(), -this.rotaionConstraint, this.rotaionConstraint);
    }
}
