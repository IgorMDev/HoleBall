import Mathu from "./MathModule";
const {ccclass, property} = cc._decorator;

@ccclass
export default class PlatformBlock extends cc.Component {
    @property
    rotationSpeed: number = 0;
    @property({min: 0,max: 45})
    rotaionConstraint: number = 0;

    rb: cc.RigidBody = null;
    spawnTween: cc.Tween = null;
    removeTween: cc.Tween = null;
    startY = 0;
    onLoad() {
        this.rb = this.getComponent(cc.RigidBody);
        this.spawnTween = cc.tween(this.node).set({scaleX: 0}).to(0.5,{scaleX: 1},null);
        this.removeTween = cc.tween(this.node).to(0.5, {scaleX: 0}, null);
        this.startY = this.node.y;
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
    tiltBy(a){
        this.node.angle = Mathu.clamp(this.node.angle + a*this.rotationSpeed, -this.rotaionConstraint, this.rotaionConstraint);
    }
}
