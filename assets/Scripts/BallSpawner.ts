import Ball from "./Ball";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BallSpawner extends cc.Component {
    @property(cc.Prefab)
    ballPrefab: cc.Prefab = null;

    ball: Ball = null;
    spawned: (b: Ball) => void;
    onLoad () {

    }
    start () {

    }

    // update (dt) {}
    spawn(){
        if(this.ball){
            this.ball.node.destroy();
        }
        this.getComponent(cc.Animation).play();
    }
    spawnBall(){
        this.ball = cc.instantiate(this.ballPrefab).getComponent(Ball);
        this.ball.node.parent = this.node.parent;
        this.ball.node.setPosition(this.node.position);
        
        if(this.spawned)
            this.spawned(this.ball);
    }
}