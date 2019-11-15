import BallSpawner from "./BallSpawner";
import Ball from "./Ball";
import PlatformBlock from "./Block";
import Arena from "./Arena";
import Mathu from "./MathModule";
import Accelerator from "./Accelerator";
import KeyboardInput from "./KeyboardInput";
import Gameplay from "./Gameplay";
import Game from "./Game";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Level extends cc.Component {
    
    @property
    speed = 0;
    @property
    meterScale = 10;
    @property
    platformDelta = 100;
    @property(cc.String)
    type: string = 'distance';
    @property(BallSpawner)
    ballSpawner: BallSpawner = null;

    @property(PlatformBlock)
    platform: PlatformBlock = null;
    @property(cc.Node)
    ground: cc.Node = null;

    platformAcc: Accelerator = null;
    groundAcc: Accelerator = null;
    moveAcc: Accelerator = null;
    rotAcc: Accelerator = null;
    actualSpeed = 0;
    arena: Arena = null;
    ball: Ball = null;
    groundY = 0;
    groundSpeed = 0;
    score = 0;
    scoreCounter = 0;
    isReady = false;
    isRun = false;
    saveData: leveldata = null;
    onLoad () {
        //this.grounUp = cc.tween(this.ground).by(1, {y: })
        this.saveData = Game.instance.levelsData[this.node.name];
        if(!this.saveData){
            this.saveData = Game.instance.levelsData[this.node.name] = {
                lastScore: 0, bestScore: 0
            };
        }
        cc.log(this.node.name+" save data "+JSON.stringify(this.saveData));
        this.groundSpeed = 2*this.speed/3.5;
        this.groundY = this.ground.y;
        this.platformAcc = new Accelerator('smooth', false);
        this.groundAcc = new Accelerator('quadOut', false);
        this.moveAcc = new Accelerator();
        this.rotAcc = new Accelerator('quintOut');
    }
    start () {
        
        
    }

    // update (dt) {}

    reset(){
        this.isReady = this.isRun = false;
        this.score = this.scoreCounter = 0;
        if(this.ball){
            this.ball.node.destroy();
            this.ball = null;
        }
        this.ballSpawner.spawn((bn)=>{this.ballSpawned(bn.getComponent(Ball))});
        this.platform.spawn();
        cc.tween(this.ground).set({y: -this.node.height/2}).to(0.5,{y: this.groundY},null).start();
        //this.ground.y = this.groundY;
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
        cc.tween(this.ground).to(0.5,{y: -this.node.height/2},null).start();
        this.saveData.lastScore = this.score;
        if(this.checkBestScore())
            this.saveData.bestScore = this.score;
    }
    end(){
        
    }
    checkBestScore(){
        return this.score > this.saveData.bestScore;
    }
    update(dt) {
        if(this.isReady && !Gameplay.paused){
            let moveAxis = KeyboardInput.getAxis(cc.macro.KEY.up, cc.macro.KEY.down),
                rotAxis = KeyboardInput.getAxis(cc.macro.KEY.left, cc.macro.KEY.right);
            
            let dy = this.moveAcc.to(moveAxis, dt);
            let dr = this.rotAcc.to(rotAxis, dt);
            if(!this.isRun){
                if(moveAxis !== 0){
                    this.run();
                }
                this.moveAcc.to(0, 1);
                this.rotAcc.to(0, 1);
                this.platformAcc.to(0, 1);
            }
            if(dr !== 0){
                this.tiltBy(dr*dt);
            }
            if(dy !== 0){
                
                this.moveBy(dy*dt);
                this.actualSpeed = dy*this.speed;
            }
            if(this.isRun){
                    
                this.platform.node.y = this.platform.startY + this.platformAcc.to(moveAxis, dt)*this.platformDelta;
                // this.ground.y += (this.groundSpeed-this.actualSpeed)*dt;
                // this.ground.y = Mathu.clamp(this.ground.y, -this.node.height/2, 0);
            }
            
        }
        
    }
    moveBy(dy: number){
        
        
    }
    tiltBy(da: number){
        this.platform.tiltBy(da);
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
}