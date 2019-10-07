import BallSpawner from "./BallSpawner";
import Ball from "./Ball";
import PlatformBlock from "./Block";
import Level from "./Level";
import Game from "./Game";
import InGameUI from "./UI/InGameUI";
import Accelerator from "./Accelerator";
import KeyboardInput from "./KeyboardInput";
import Gameplay from "./Gameplay";

const {ccclass, property, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@executionOrder(-10)
@disallowMultiple
export default class Arena extends cc.Component{
    private static _instance: Arena = null;
    static get instance(){
        return Arena._instance;
    }

    @property(Level)
    level: Level = null;
    @property(cc.Node)
    touchArea: cc.Node = null;
    @property(InGameUI)
    inGameUI: InGameUI = null;
    @property(cc.Component.EventHandler)
    onGameStart: cc.Component.EventHandler[] = [];
    @property(cc.Component.EventHandler)
    onGameEnd: cc.Component.EventHandler[] = [];
    score = 0;
    touchVec: cc.Vec2 = cc.Vec2.ZERO;
    isReady = false;
    isRun = false;
    //saveData = Game.instance.saveData;
    onLoad () {
        
        const pm = cc.director.getPhysicsManager();
        pm.enabled = true;
        pm.gravity = cc.v2(0, -10);
        const colman = cc.director.getCollisionManager();
        colman.enabled = true;
        //colman.enabledDebugDraw = true;
        //colman.enabledDrawBoundingBox = true;
        this.level.arena = this;
        this.touchArea.on('touchstart', this.touchStart, this.touchArea);
        this.touchArea.on('touchend', this.touchEnd, this.touchArea);
        
    }
    onEnable(){
        
        if(Arena._instance){
            Arena._instance.endGame();
        }
        Arena._instance = this;
        this.startGame();
    }
    start () {
        
    }
    
    update(dt) {
        if(this.isReady){
            if(this.isRun){
                if(this.score != this.level.scoreMeters){
                    this.inGameUI.setScore(this.score = this.level.scoreMeters);
                }
            }
            
        }
        
    }
    enable(){
        this.node.active = true;
    }
    startGame(){
        Gameplay.instance.gameStart();
        this.isReady = this.isRun = false;
        this.score = 0;
        this.inGameUI.node.active = false;
        this.level.reset();
        this.onGameStart.forEach(val=>val.emit(null));
    }
    readyGame(){
        if(!this.isReady){
            
            this.inGameUI.node.active = true;
            this.level.ready();
            this.isReady = true;
        }
    }
    runGame(){
        if(!this.isRun){
            this.level.run();
            this.isRun = true;
        }
    }
    restart(){
        
        this.startGame();
    }
    finishGame(){
        this.isReady = this.isRun = false;
        this.level.finish();
    }
    endGame(){
        Gameplay.instance.gameEnd();
        

        this.level.end();
        this.onGameEnd.forEach(val=>val.emit(null));
        
    }
    disable(){
        this.node.active = false;
    }
    onDisable(){

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
