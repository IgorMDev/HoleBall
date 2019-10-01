import BallSpawner from "./BallSpawner";
import Ball from "./Ball";
import PlatformBlock from "./Block";
import Level from "./Level";
import Game from "./Game";
import InGameUI from "./UI/InGameUI";

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
    @property(PlatformBlock)
    platform: PlatformBlock = null;
    @property(Level)
    level: Level = null;
    @property(cc.Node)
    objects: cc.Node = null;
    @property(cc.Node)
    touchArea: cc.Node = null;
    @property(InGameUI)
    inGameUI: InGameUI = null;

    score = 0;
    ball: Ball = null;
    rotationAxis = 0;
    moveAxis = 0;
    touchVec: cc.Vec2 = cc.Vec2.ZERO;
    isReady = false;
    //saveData = Game.instance.saveData;
    onLoad () {
        const pm = cc.director.getPhysicsManager();
        pm.enabled = true;
        pm.gravity = cc.v2(0, -10);
        const colman = cc.director.getCollisionManager();
        colman.enabled = true;
        //colman.enabledDebugDraw = true;
        //colman.enabledDrawBoundingBox = true;
        this.ballSpawner.spawned = this.ballSpawned;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.touchArea.on('touchstart', this.touchStart, this.touchArea);
        this.touchArea.on('touchend', this.touchEnd, this.touchArea);
        
    }

    start () {
        this.startGame();
    }
    
    update(dt) {
        if(this.isReady){
            if(this.rotationAxis != 0){
                this.platform.tiltBy(this.rotationAxis*dt);

            }
            if(this.moveAxis != 0){
                this.level.move(this.moveAxis*dt);
                if(this.score != this.level.scoreMeters){
                    this.inGameUI.setScore(this.score = this.level.scoreMeters);
                }
                
            }
            if(this.touchVec.mag() > 0){
                //this.node.position.addSelf(this.touchVec.mul(dt));
                this.touchArea.position = this.touchArea.position.addSelf(this.touchVec.mul(dt));
                cc.Camera.main.node.position = cc.Camera.main.node.position.addSelf(this.touchVec.mul(dt));
            }
        }
        
    }

    startGame(){
        this.level.node.active = true;
        this.objects.active = true;
        this.isReady = false;
        this.score = 0;
        this.inGameUI.node.active = false;
        this.ballSpawner.spawn();
    }
    readyGame(){
        if(!this.isReady){
            this.level.reset();
            this.inGameUI.node.active = true;
            this.isReady = true;
        }
    }
    restartGame(){
        this.level.node.active = false;
        this.objects.active = false;
        this.startGame();
    }
    endGame(){

    }
    ballSpawned = (b: Ball)=>{
        this.ball = b;
    }
    ballDestroyed(b: Ball){
        this.level.clear();
        this.restartGame();
    }
    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    onKeyDown(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.left:
                this.rotationAxis = 1;
            break;
            case cc.macro.KEY.right:
                this.rotationAxis = -1;
            break;
            case cc.macro.KEY.up:
                this.moveAxis = 1;
            break;
            case cc.macro.KEY.down:
                this.moveAxis = -1;
            break;
        }
    }
    onKeyUp(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this.rotationAxis = 0;
            break;
            case cc.macro.KEY.up:
            case cc.macro.KEY.down:
                this.moveAxis = 0;
            break;
        }
    }
    touchStart = (event: cc.Event.EventTouch) => {
        let loc = event.getLocation();
        let dx = loc.x - this.touchArea.width/2,
            dy = loc.y - this.touchArea.height/2;
        this.touchVec = cc.v2(dx, dy);
        console.log("*******t loc "+loc);
        
    }
    touchEnd = (event: cc.Event.EventTouch) => {
        this.touchVec = cc.Vec2.ZERO;
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
