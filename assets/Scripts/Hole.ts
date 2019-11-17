import Ball from "./Ball";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hole extends cc.Component {
    @property(cc.Node)
    mask: cc.Node = null;

    ccol: cc.CircleCollider = null;
    onLoad () {
        this.ccol = this.getComponent(cc.CircleCollider);
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