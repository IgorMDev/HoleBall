import BallSpawner from "./BallSpawner";
import Ball from "./Ball";
import PlatformBlock from "./Block";
import Arena from "./Arena";
import Mathu from "./MathModule";
import Accelerator from "./Accelerator";
import KeyboardInput from "./KeyboardInput";
import Gameplay from "./Gameplay";
import Game from "./Game";
import HoleField from "./HoleField";
const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class Level extends cc.Component {
    
    @property
    speed = 0;
    @property(HoleField)
    holeField: HoleField = null;
    @property(BallSpawner)
    ballSpawner: BallSpawner = null;
    @property(PlatformBlock)
    platform: PlatformBlock = null;

    arena: Arena = null;
    ball: Ball = null;
    score = 0;
    isReady = false;
    isRun = false;
    sd: leveldata = null;
    dy = 0; dr = 0;
    onLoad () {
        //this.grounUp = cc.tween(this.ground).by(1, {y: })
        
    }
    reset(){
        this.isReady = this.isRun = false;
        this.score = 0;
        if(this.ball){
            this.ball.node.destroy();
            this.ball = null;
        }
        this.ballSpawner.spawn((bn)=>{this.ballSpawned(bn.getComponent(Ball))});
        this.platform.spawn();
    }
    ready(){
        this.isReady = true;
    }
    run(){
        this.isRun = true;
    }
    finish(){
        this.isReady = this.isRun = false;
        this.platform.remove();
    }
    end(){
        
    }
    update(dt) {
        
    }
    moveBy(dy: number){
        if(dy !== 0){
            if(!this.isRun){
                this.isRun = true;
            }
            this.platform.moveBy(dy);
        }
    }
    tiltBy(da: number){
        if(da !== 0){
            this.platform.tiltBy(da);
        }
    }
    ballReady(b = true){
        if(b) this.arena.readyGame();
        else this.isReady = false;
    }
    ballSpawned(b: Ball){
        if(this.ball){
            this.ball.node.destroy();
        }
        this.ball = b;
        this.ball.level = this;
    }
    ballRemoved(b: Ball){
        this.ball = null;
        this.arena.finishGame();
    }
    readSaveData(){
        this.sd = Game.instance.progressData[this.arena.node.name][this.node.name] || {
            lastScore: 0, bestScore: 0
        };
        cc.log(this.node.name+" save data "+JSON.stringify(this.sd));
    }
    writeSaveData(){
        Game.instance.progressData[this.node.name] = this.sd;
    }
}