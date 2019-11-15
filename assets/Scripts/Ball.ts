import Arena from "./Arena";
import Level from "./Level";
import Hole from "./Hole";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {
    @property(cc.Prefab)
    destroyParticle: cc.Prefab = null;

    rb:cc.RigidBody = null;
    cpcol: cc.PhysicsCircleCollider = null;
    spawnTween: cc.Tween = null;
    destroyTween: cc.Tween = null;
    isReady = false;
    level: Level = null;
    get radius(){
        return this.cpcol.radius;
    }
    onLoad () {
        this.rb = this.getComponent(cc.RigidBody);
        this.cpcol = this.getComponent(cc.PhysicsCircleCollider);
        this.spawnTween = cc.tween(this.node).set({scale: 0}).to(0.5, {scale: 1}, null).call(()=>{this.onSpawned()});
        this.destroyTween = cc.tween(this.node).to(0.3, {opacity: 0}, null).delay(0.5).call(()=>{this.onRemoved()});
        
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
    onDestroy(){
        
        console.log("-------------Ball destroyed");
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        if(this.isReady){
            if(other.node.group === "hole"){
                other.getComponent(Hole).captureBall(this);
                this.isReady = false;
                console.log("hole collision enter with "+other.name);
            }
        }

    }
    onBeginContact(contact:cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider){
        if(other.node.group === "platform"){
            this.isReady = true;
            this.level.ballReady();
        }else if(other.node.group === "ground"){
            let prt = cc.instantiate(this.destroyParticle,);
            this.remove();
            prt.setParent(this.node.parent);
            prt.position = this.node.position;
            console.log("particle instantiated at "+prt.parent);
        }
        
    }
    onEndContact(contact:cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider){
        
    }
    
}