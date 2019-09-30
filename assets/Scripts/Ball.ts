import Arena from "./Arena";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    rb:cc.RigidBody = null;
    spawnTween: cc.Tween = null;
    destroyTween: cc.Tween = null;
    isReady = false;
    onLoad () {
        this.rb = this.getComponent(cc.RigidBody);
        this.spawnTween = cc.tween(this.node).set({scale: 0}).to(0.5, {scale: 1}, null).call(()=>{this.onSpawned()});
        this.destroyTween = cc.tween(this.node).to(0.5, {scale: 0}, null).delay(1).call(()=>{this.node.destroy()});
        
    }
    start () {
        this.spawn();
    }
    // update (dt) {}

    spawn(){
        this.spawnTween.start();
        this.isReady = false;
    }
    onSpawned(){
        console.log("--------------ball Spawned");
        this.rb.awake = true;
        this.rb.active = true;
    }
    onHoleCatch(){
        this.isReady = false;
        this.rb.destroy();
        this.destroyTween.start();
        
    }
    onDestroy(){
        
        Arena.instance.ballDestroyed(this);
        console.log("-------------Ball destroyed");
        
    }
    onCollisionEnter(other: cc.Collider | cc.CircleCollider, self: cc.Collider){
        
        if(this.isReady && other.node.group === "hole"){
            this.rb.active = false;
            //this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
            self.node.parent = other.node;
            
            cc.tween(self.node).to(0.5,{
                position: cc.v2(0, 0)
            },null).call(()=>{this.onHoleCatch()}).start();
            
            console.log("hole collision enter with "+other.name);
        }
    }
    onBeginContact(contact:cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider){
        if(other.node.group === "platform"){
            this.isReady = true;
            Arena.instance.readyGame();
        }
        
    }
    onEndContact(contact:cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider){
        
    }
}