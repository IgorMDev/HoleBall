import Ball from "./Ball";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hole extends cc.Component {
    @property
    spawnProbability = 1;
    @property
    maxPercentage = 1;
    @property
    border = 0;
    @property({type: cc.Float})
    radiuses: number[] = [];
    @property(cc.Node)
    mask: cc.Node = null;

    ccol: cc.CircleCollider = null;
    onLoad () {
        this.ccol = this.getComponent(cc.CircleCollider);
    }
    start () {

    }

    // update (dt) {}
    setSize(r: number){
        this.node.width = this.node.height = (r+this.border)*2;
        this.getComponent(cc.CircleCollider).radius = r;
    }
    setRandSize(){
        let r = this.radiuses[Math.floor(Math.random()*this.radiuses.length)];
        this.setSize(r);
    }
    captureBall(b: Ball){
        b.node.setParent(this.node);
        let p = b.node.position.normalizeSelf().mulSelf(this.ccol.radius - b.radius);
        b.rb.active = false;
        cc.tween(b.node).to(0.3,{
            position: p
        },{easing:'quadIn'}).call(()=>{
            b.node.setParent(this.mask);
            b.remove();
        })
        .by(0.3,{
            position: cc.v2(0, -this.ccol.radius*2)
        },null).start();
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider){
        
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider){
        //console.log("hole collision exit");
        
    }
}