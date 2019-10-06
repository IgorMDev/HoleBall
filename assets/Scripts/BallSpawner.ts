import Ball from "./Ball";
import Level from "./Level";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BallSpawner extends cc.Component {
    @property(cc.Prefab)
    ballPrefab: cc.Prefab = null;
    ballSpawned: (b: cc.Node) => void;
    onLoad(){
        
    }
    spawn(callback: (b: cc.Node) => void){
        this.getComponent(cc.Animation).play();
        this.ballSpawned = callback;
    }
    onBallSpawn(){
        var ball = cc.instantiate(this.ballPrefab);
        ball.parent = this.node.parent;
        ball.setPosition(this.node.position);
        this.ballSpawned(ball);
    }
}