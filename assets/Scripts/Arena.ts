import BallSpawner from "./BallSpawner";
import Ball from "./Ball";

const {ccclass, property, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@executionOrder(-10)
@disallowMultiple
export default class Arena extends cc.Component {
    private static _instance: Arena = null;
    static get instance(){
        return Arena._instance;
    }
    constructor(){
        super();
        return Arena._instance || (Arena._instance = this);
    }

    @property(BallSpawner)
    ballSpawner: BallSpawner = null;
    @property(cc.Node)
    objects: cc.Node = null;

    ball: Ball = null;
    onLoad () {
        const pm = cc.director.getPhysicsManager();
        pm.enabled = true;
        pm.gravity = cc.v2(0, -10);
        this.ballSpawner.spawned = this.ballSpawned;
    }

    start () {
        this.startGame();
    }
    
    // update (dt) {}

    startGame(){
        this.objects.active = true;
        this.ballSpawner.spawn();
    }
    restartGame(){

        this.objects.active = false;
        this.startGame();
    }
    ballSpawned(b: Ball){
        this.ball = b;
    }
}
/* 
const {ccclass, property} = cc._decorator;

@ccclass
export default class  extends cc.Component {

    onLoad () {

    }
    start () {

    }

    // update (dt) {}
} */