
import Level from "./Level";
import Hole from "./Hole";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {
    @property(cc.Prefab)
    destroyParticle: cc.Prefab = null;
    @property({type: cc.AudioClip})
    spawnAudio: cc.AudioClip = null;
    @property({type: cc.AudioClip})
    removeAudio: cc.AudioClip = null;
    @property({type: cc.AudioClip})
    touchAudio: cc.AudioClip = null;

    rb:cc.RigidBody = null;
    cpcol: cc.PhysicsCircleCollider = null;
    spawnTween: cc.Tween = null;
    destroyTween: cc.Tween = null;
    isReady = false;
    canBeCaught = true;
    level: Level = null;
    get radius(){
        return this.cpcol.radius;
    }
    onLoad () {
        this.rb = this.getComponent(cc.RigidBody);
        this.cpcol = this.getComponent(cc.PhysicsCircleCollider);
        this.spawnTween = cc.tween(this.node).set({scale: 0}).to(0.5, {scale: 1}, null).call(()=>{this.onSpawned()});
        this.destroyTween = cc.tween(this.node).to(0.5, {scale: 0}, null).delay(0.3).call(()=>{this.onRemoved()});
        
    }
    start () {
        this.node.scaleX = 0;
        this.spawn();
    }
    spawn(){
        this.spawnTween.start();
        this.playAudio(this.spawnAudio);
        this.isReady = false;
    }
    remove(){
        this.isReady = false;
        this.rb.destroy();
        this.destroyTween.start();
        this.playAudio(this.removeAudio);
        //this.level.ballReady(false);
    }
    onSpawned(){
        console.log("--------------ball Spawned");
        this.rb.awake = true;
        this.rb.active = true;
    }
    onRemoved(){
        this.level.ballRemoved(this);
        this.node.destroy()
    }
    playAudio(ac:cc.AudioClip){
        if(ac){
            cc.audioEngine.playEffect(ac, false);
        }
    }
    onDestroy(){
        
        console.log("-------------Ball destroyed");
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        if(this.isReady){
            if(this.canBeCaught && other.node.group === "hole" && self.tag === 0 && other.tag === 0){
                this.isReady = false;
                other.getComponent(Hole).captureBall(this);
                this.level.ballCaptured(this);
                console.log("hole collision enter with "+other.name);
            }
        }
    }
    onBeginContact(contact:cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider){
        if(other.node.group === "platform"){
            if(!this.isReady){
                this.isReady = true;
                this.playAudio(this.touchAudio);
                this.level.ballReady();
            }
        }else if(other.node.group === "ground"){
            this.remove();
            if(other.tag === 0){
                let prt = cc.instantiate(this.destroyParticle);
                prt.setParent(this.node.parent);
                prt.position = this.node.position;
                console.log("particle instantiated at "+prt.parent);
            }
        }
        
    }
    
}