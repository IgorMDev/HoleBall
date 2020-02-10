import Ball from "./Ball";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hole extends cc.Component {
    @property
    radius = 0;
    @property
    border = 0;
    @property(cc.Node)
    mask: cc.Node = null;

    isBallCaptured = false;
    spawnTween: cc.Tween = null;
    removeTween: cc.Tween = null;
    lscale = 0;
    onLoad(){
        this.spawnTween = cc.tween(this.node).set({scale: 0}).to(0.8, {scale:{value: this.node.scale, easing: 'elasticOut'}}, null);
        this.removeTween = cc.tween(this.node).to(0.5, {scale:{value: 0, easing: 'quadIn'}}, null);
        this.node.on('spawn', this.onSpawn, this);
        this.node.on('remove', this.onRemove, this);
        if(!this.radius){
            this.radius = Math.max(this.node.width, this.node.height)/2;
        }
        if(this.lscale === 0){
            this.lscale = this.node.scale;
        }
        
    }
    onEnable(){
        this.isBallCaptured = false;
    }
    onDestroy(){
        this.node.off('spawn', this.onSpawn, this);
        this.node.off('remove', this.onRemove, this);
        //this.node.off('reset', this.onReset, this);
    }
    onSpawn(callback?: Function){
        if(callback) callback();
        //this.spawnTween.start();
        cc.tween(this.node).set({scale: 0}).to(0.8, {scale:{value: this.lscale, easing: 'elasticOut'}}, null).start();
        this.isBallCaptured = false;
    }
    onRemove(callback?: Function){
        this.removeTween.call(callback).start();
    }
    captureBall(b: Ball){
        this.isBallCaptured = true;
        b.node.setParent(this.node);
        if(this.node.scale != 0){
            b.node.scale = 1 / this.node.scale;
        }
        let p = b.node.position.normalize().mul(this.radius - b.radius);
        b.rb.active = false;
        cc.tween(b.node).to(0.3,{
            position: p
        },{easing:'quadIn'}).call(()=>{
            b.node.setParent(this.mask);
            b.remove();
        })
        .by(0.5,{
            position: cc.v2(0, -this.radius*2)
        },null).start();
    }
    /* onCollisionEnter(other: cc.Collider, self: cc.Collider){
        
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider){
        
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider){
        //console.log("hole collision exit");
        
    } */
    getRadius(){
        return (this.radius + this.border)*this.lscale;
    }
    setHoleSize(r: number){
        this.node.setScale(this.lscale = r/this.radius);
    }
}