import Ball from "./Ball";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BallSpawner extends cc.Component {
    @property(cc.Prefab)
    ballPrefab: cc.Prefab = null;
    onLoad () {

    }
    start () {

    }

    // update (dt) {}
    spawn(){
        this.getComponent(cc.Animation).play();
    }
    spawnBall(){
        let ball = cc.instantiate(this.ballPrefab);
        ball.parent = this.node.parent;
        ball.setPosition(this.node.position);
    }
}