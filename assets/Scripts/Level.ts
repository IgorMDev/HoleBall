import BallSpawner from "./BallSpawner";
import Ball from "./Ball";
import PlatformBlock from "./Block";
import Arena from "./Arena";
import Accelerator from "./Accelerator";
import Game from "./Game";
import HoleField from "./HoleField";
import BackgroundGrad from "./BackgroundGrad";
import SoundManager from "./SoundManager";
import Gameplay from "./Gameplay";
const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class Level extends cc.Component {
    @property
    speed = 0;
    @property({type: cc.Integer, min: -1, max: 1})
    moveDir = -1;
    @property(cc.String)
    moveEasing = '';
    @property
    startY = 0;
    @property(HoleField)
    holeFields: HoleField[] = [];
    @property(cc.Node)
    moveWatchers: cc.Node[] = [];
    @property(BallSpawner)
    ballSpawner: BallSpawner = null;
    @property(PlatformBlock)
    platform: PlatformBlock = null;
    @property({type: cc.AudioClip})
    readyAudio: cc.AudioClip = null;
    @property({type: cc.AudioClip})
    finishAudio: cc.AudioClip = null;
    @property({type: cc.AudioClip})
    ballCatchAudio: cc.AudioClip = null;

    watchersStartY: number[] = [];
    arena: Arena = null;
    ball: Ball = null;
    moveAcc: Accelerator = null;
    score = 0;
    isReady = false;
    isRun = false;
    sd: leveldata = null;
    dy = 0; da = 0; dt = 0; dyt = 0;
    onLoad(){
        
        this.readSaveData();
        this.watchersStartY = this.moveWatchers.map(n => n.y);
        this.moveAcc = this.node.addComponent(Accelerator);
        this.moveAcc.isFlipping = true;
        this.moveAcc.setEasing(this.moveEasing);
    }
    reset(){
        this.isReady = this.isRun = false;
        this.score = 0;
        if(this.ball){
            this.ball.node.destroy();
            this.ball = null;
        }
        for(let i in this.holeFields){
            this.holeFields[i].clear();
            this.holeFields[i].node.y = this.startY+this.node.height*parseInt(i);
        }
        for(let i in this.watchersStartY){
            this.moveWatchers[i].y = this.watchersStartY[i];
        }
        this.ballSpawner.spawn((bn)=>{this.ballSpawned(bn.getComponent(Ball))});
        this.platform.spawn();
    }
    ready(){
        this.isReady = true;
        for(let field of this.holeFields){
            field.setSpawn();
        }
        SoundManager.playEffect(this.readyAudio);
    }
    run(){
        this.isRun = true;
    }
    finish(){
        this.isReady = this.isRun = false;
        this.platform.remove();
        for(let field of this.holeFields){
            field.setClear();
        }
        this.writeScores();
        cc.tween(this.node).call(()=>{
            SoundManager.playEffect(this.finishAudio);
        }).start();
    }
    end(){
        
    }
    update(dt) {
        this.dt = dt;
        if(!Gameplay.paused){
        
        if(this.isReady && this.isRun){
            this.dyt = this.moveAcc.y*(this.dy!==0?Math.abs(this.dy):1)*this.dt;
        }
        }
    }
    onDestroy(){
        this.writeSaveData();
    }
    moveBy(dy: number){
        if(!Gameplay.paused){
        this.dy = dy;
        this.moveAcc.by(this.dy*this.dt);
        if(dy !== 0){
            if(this.isReady && !this.isRun){
                this.run();
            }
            this.moveFieldBy(this.dyt);
            this.moveWatchersBy(this.dyt);
            this.platform.moveBy(this.dyt);
        }
        }
    }
    tiltBy(da: number){
        if(!Gameplay.paused){
        this.da = da;
        if(da !== 0){
            da *= this.dt;
            this.platform.tiltBy(da);
        }
        }
    }
    tiltTo(a: number){
        this.platform.tiltTo(a);
    }
    moveWatchersBy(dy: number){
        for(let n of this.moveWatchers){
            n.y += dy*this.speed*this.moveDir;
        }
        BackgroundGrad._instance.moveY(dy*this.speed*this.moveDir);
    }
    moveFieldBy(dy: number){
        for(let field of this.holeFields){
            field.node.y += dy*this.speed*this.moveDir;
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
    ballCaptured(b: Ball){
        this.isReady = false;
        SoundManager.playEffect(this.ballCatchAudio);
    }
    ballRemoved(b: Ball){
        this.ball = null;
        this.arena.finishGame();
    }
    writeScores(){
        this.sd.score = this.score;
        if(this.score > this.sd.bestScore){
            this.sd.bestScore = this.score;
        }
    }
    readSaveData(){
        this.sd = Game.instance.progressData[this.arena.node.name][this.node.name] || {
            score: 0, bestScore: 0
        };
        cc.log(this.node.name+" save data "+JSON.stringify(this.sd));
    }
    writeSaveData(){
        //Game.instance.progressData[this.arena.node.name][this.node.name] = this.sd;
    }
}