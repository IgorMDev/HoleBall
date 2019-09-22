const {ccclass, property} = cc._decorator;

@ccclass
export default class Ball extends cc.Component {

    rb:cc.RigidBody = null;
    onLoad () {
        this.rb = this.getComponent(cc.RigidBody);
    }
    start () {
        
    }

    // update (dt) {}

    spawn(){
        this.getComponent(cc.Animation).play("ballSpawn");
    }
    onSpawned(){
        console.log("--------------ball Spawned");
        this.rb.awake = true;
    }
    onDestroy(){
        console.log("-------------Ball destroyed");
        
    }
}