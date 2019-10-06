import Arena from "./Arena";
import Level from "./Level";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {
    @property(cc.Prefab)
    destroyParticle: cc.Prefab = null;

    rb:cc.RigidBody = null;
    spawnTween: cc.Tween = null;
    destroyTween: cc.Tween = null;
    isReady = false;
    level: Level = null;
    onLoad () {
        this.rb = this.getComponent(cc.RigidBody);
        this.spawnTween = cc.tween(this.node).set({scale: 0}).to(0.5, {scale: 1}, null).call(()=>{this.onSpawned()});
        this.destroyTween = cc.tween(this.node).to(0.5, {scale: 0}, null).delay(0.2).call(()=>{this.onRemoved()});
        
    }
    start () {
        this.node.scaleX = 0;
        this.spawn();
    }
    spawn(){
        this.spawnTween.start();
        this.isReady = false;
    }
    remove(){
        this.isReady = false;
        this.rb.destroy();
        this.destroyTween.start();
        
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
    onDestroy(){
        
        
        console.log("-------------Ball destroyed");
        
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        if(this.isReady){
            if(other.node.group === "hole"){
                this.rb.active = false;
                self.node.parent = other.node;
                cc.tween(self.node).to(0.5,{
                    position: cc.v2(0, 0)
                },null).call(()=>{this.remove()}).start();
                
                console.log("hole collision enter with "+other.name);
            }else if(other.node.name === "Ground"){
                let prt = cc.instantiate(this.destroyParticle);
                this.remove();
                prt.position = this.node.position;
                prt.setParent(this.node.parent);
            }
        }

    }
    onBeginContact(contact:cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider){
        if(other.node.group === "platform"){
            this.isReady = true;
            this.level.ballReady();
        }
        
    }
    onEndContact(contact:cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider){
        
    }
}