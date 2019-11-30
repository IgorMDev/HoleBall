import Ball from "./Ball";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hole extends cc.Component {
    @property(cc.Node)
    mask: cc.Node = null;
    @property({type: cc.AudioClip})
    spawnAudio: cc.AudioClip = null;
    @property({type: cc.AudioClip})
    removeAudio: cc.AudioClip = null;
    @property({type: cc.AudioClip, })
    ballCatchAudio: cc.AudioClip = null;

    spawnTween: cc.Tween = null;
    removeTween: cc.Tween = null;
    ccol: cc.CircleCollider = null;
    onLoad(){
        this.ccol = this.getComponent(cc.CircleCollider);
        this.spawnTween = cc.tween(this.node).set({scale: 0}).call(()=>{
            this.playAudio(this.spawnAudio);
        }).to(0.8, {scale:{value: this.node.scale, easing: 'elasticOut'}}, null);
        this.removeTween = cc.tween(this.node).call(()=>{
            this.playAudio(this.removeAudio);
        }).to(0.5, {scale:{value: 0, easing: 'quadIn'}}, null);
        this.node.on('spawn', this.onSpawn, this);
        this.node.on('remove', this.onRemove, this);
        
    }
    onDestroy(){
        this.node.off('spawn', this.onSpawn, this);
        this.node.off('remove', this.onRemove, this);
        //this.node.off('reset', this.onReset, this);
    }
    onSpawn(callback?: Function){
        if(callback) callback();
        this.spawnTween.start();
        
    }
    onRemove(callback?: Function){
        //this.playAudio(this.removeAudio);
        this.removeTween.call(callback).start();
    }
    playAudio(ac: cc.AudioClip){
        if(ac){
            
            cc.audioEngine.playEffect(ac, false);
        }else{
            cc.log("audio clip is null in "+this.node.name);
        }
    }
    captureBall(b: Ball){
        b.node.setParent(this.node);
        if(this.node.scale != 0){
            b.node.scale = 1 / this.node.scale;
        }
        let p = b.node.position.normalizeSelf().mulSelf(this.ccol.radius - b.radius);
        b.rb.active = false;
        this.playAudio(this.ballCatchAudio);
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