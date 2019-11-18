import Ball from "./Ball";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hole extends cc.Component {
    @property(cc.Node)
    mask: cc.Node = null;

    spawnTween: cc.Tween = null;
    removeTween: cc.Tween = null;
    ccol: cc.CircleCollider = null;
    onLoad(){
        this.ccol = this.getComponent(cc.CircleCollider);
        this.spawnTween = cc.tween(this.node).set({scale: 0}).to(1, {scale:{value: this.node.scale, easing: 'elasticOut'}}, null);
        this.removeTween = cc.tween(this.node).to(1, {scale:{value: 0, easing: 'backOut'}}, null);
        this.node.on('spawn', this.onSpawn, this);
        this.node.on('remove', this.onRemove, this);
        //this.node.on('reset', this.onReset, this);
    }
    onDestroy(){
        this.node.off('spawn', this.onSpawn, this);
        this.node.off('remove', this.onRemove, this);
        //this.node.off('reset', this.onReset, this);
    }
    onReset(){
        
    }
    onSpawn(callback?: Function){
        if(callback) callback();
        this.spawnTween.start();
    }
    onRemove(callback?: Function){
        this.removeTween.call(callback).start();
    }
    captureBall(b: Ball){
        b.node.setParent(this.node);
        if(this.node.scale > 1){
            b.node.scale = 1 / this.node.scale;
        }
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