import BallSpawner from "./BallSpawner";
import Ball from "./Ball";
import PlatformBlock from "./Block";
import Arena from "./Arena";
import Mathu from "./MathModule";
import Accelerator from "./Accelerator";
import KeyboardInput from "./KeyboardInput";
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
    ball: Ball = null;
    platformY = 0;
    groundY = 0;
    groundSpeed = 0;
    scoreMeters = 0;
    metersCounter = 0;
    onLoad () {
        //this.grounUp = cc.tween(this.ground).by(1, {y: })
        this.groundSpeed = 2*this.speed/3;
        this.platformY = this.platform.node.y;
        this.groundY = this.ground.y;
        this.platformAcc = new Accelerator('smooth', false);
        this.groundAcc = new Accelerator('quadOut', false);
        this.moveAcc = new Accelerator();
        this.rotAcc = new Accelerator('cubicOut');
    }
    start () {
        
    }

    // update (dt) {}

    reset(){
        this.scoreMeters = this.metersCounter = 0;
        this.ballSpawner.spawn((bn)=>{this.ballSpawned(bn.getComponent(Ball))});
        this.platform.spawn();
        this.ground.y = this.groundY;
    }
    ready(){

    }
    run(){

    }
    finish(){
        this.platform.remove();
        Arena.instance.endGame();
    }
    end(){

    }
    update(dt) {
        if(Arena.instance.isReady){
            let moveAxis = KeyboardInput.getAxis(cc.macro.KEY.up, cc.macro.KEY.down),
                rotAxis = KeyboardInput.getAxis(cc.macro.KEY.left, cc.macro.KEY.right);
            let dy = this.moveAcc.to(moveAxis, dt);
            let dr = this.rotAcc.to(rotAxis, dt);
            if(dr !== 0){
                this.tiltBy(dr*dt);
            }
            if(dy !== 0){
                if(!Arena.instance.isRun) Arena.instance.runGame();
                this.moveBy(dy*dt);
                this.actualSpeed = dy*this.speed;
            }
            this.platform.node.y = this.platformY + this.platformAcc.to(moveAxis, dt)*this.platformDelta;
            if(Arena.instance.isRun){
                this.ground.y += (this.groundSpeed-this.actualSpeed)*dt;
                this.ground.y = Mathu.clamp(this.ground.y, -this.node.height/2, 0);
            }
        }
        
    }
    moveBy(dy: number){
        if(dy !== 0){
            this.metersCounter += dy*Math.abs(this.speed);
            if(this.metersCounter >= this.meterScale){
                this.scoreMeters += Math.floor(this.metersCounter/this.meterScale);
                this.metersCounter %= this.meterScale;
            }
        }
        
    }
    tiltBy(da: number){
        this.platform.tiltBy(da);
    }
    ballReady(){
        Arena.instance.readyGame();
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
        this.finish();
    }
}