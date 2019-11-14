import BallSpawner from "./BallSpawner";
import Ball from "./Ball";
import PlatformBlock from "./Block";
import Arena from "./Arena";
import Mathu from "./MathModule";
import Accelerator from "./Accelerator";
import KeyboardInput from "./KeyboardInput";
import Gameplay from "./Gameplay";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Level extends cc.Component {
    @property
    speed = 0;
    @property
    meterScale = 10;
    @property
    platformDelta = 100;
    
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
    platformY = 0;
    groundY = 0;
    groundSpeed = 0;
    scoreMeters = 0;
    metersCounter = 0;
    isReady = false;
    isRun = false;
    onLoad () {
        //this.grounUp = cc.tween(this.ground).by(1, {y: })
        this.groundSpeed = 2*this.speed/3;
        this.platformY = this.platform.node.y;
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
        this.scoreMeters = this.metersCounter = 0;
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
    }
    end(){

    }
    update(dt) {
        if(this.isReady && !Gameplay.paused){
            let moveAxis = KeyboardInput.getAxis(cc.macro.KEY.up, cc.macro.KEY.down),
                rotAxis = KeyboardInput.getAxis(cc.macro.KEY.left, cc.macro.KEY.right);
            if(moveAxis !== 0){
                if(!this.isRun) this.run();
            }
            let dy = this.moveAcc.to(moveAxis, dt);
            let dr = this.rotAcc.to(rotAxis, dt);
            if(dr !== 0){
                this.tiltBy(dr*dt);
            }
            if(dy !== 0){
                
                this.moveBy(dy*dt);
                this.actualSpeed = dy*this.speed;
            }
            if(this.isRun){
                    
                this.platform.node.y = this.platformY + this.platformAcc.to(moveAxis, dt)*this.platformDelta;
                // this.ground.y += (this.groundSpeed-this.actualSpeed)*dt;
                // this.ground.y = Mathu.clamp(this.ground.y, -this.node.height/2, 0);
            }
        }
        
    }
    moveBy(dy: number){
        if(dy !== 0){
            if(dy < 0 && this.metersCounter > 0 || dy > 0 && this.metersCounter < 0){
                this.metersCounter = 0;
            }
            this.metersCounter += dy*this.speed;
            if(Math.abs(this.metersCounter) >= this.meterScale){
                this.scoreMeters += Math.floor(this.metersCounter/this.meterScale);
                this.metersCounter %= this.meterScale;
            }
        }
        
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