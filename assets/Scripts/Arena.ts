import BallSpawner from "./BallSpawner";
import Ball from "./Ball";
import PlatformBlock from "./Block";
import Level from "./Level";
import Game from "./Game";
import Accelerator from "./Accelerator";
import KeyboardInput from "./KeyboardInput";
import Gameplay from "./Gameplay";
import ArenaUI from "./UI/ArenaUI";

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
    @property(ArenaUI)
    arenaUI: ArenaUI = null;
    @property(cc.Component.EventHandler)
    onGameStart: cc.Component.EventHandler[] = [];
    @property(cc.Component.EventHandler)
    onGameEnd: cc.Component.EventHandler[] = [];
    touchVec: cc.Vec2 = cc.Vec2.ZERO;
    isReady = false;
    //isRun = false;
    //saveData = Game.instance.saveData;
    onLoad () {
        if(Arena._instance && Arena._instance !== this){
            Arena._instance.destroy();
        }
        Arena._instance = this;
        const pm = cc.director.getPhysicsManager();
        pm.enabled = true;
        pm.gravity = cc.v2(0, -10);
        const colman = cc.director.getCollisionManager();
        colman.enabled = true;
        //colman.enabledDebugDraw = true;
        //colman.enabledDrawBoundingBox = true;
        cc.log("@@@ arena loaded");
    
        this.touchArea.on('touchstart', this.touchStart, this.touchArea);
        this.touchArea.on('touchend', this.touchEnd, this.touchArea);
        
    }
    onEnable(){
        this.level.arena = this;
        this.arenaUI.configureLevelUI(this.level);
        this.startGame();
    }
    enable(){
        
        
        if(this.node.active){
            this.onEnable();
        }else{
            this.node.active = true;
        }
    }
    start () {
        
    }
    
    loadLevelHandler(s, data){
        cc.log("%%%%%% sender "+ typeof s);
        cc.log("%%%%%% data "+data);
        this.loadLevel(data);
    }
    loadLevel(lname?: String){
        if(lname && this.level && this.level.name !== lname){
            cc.loader.loadRes('levels/'+lname, (err, prefab)=>{
                if(err){
                    cc.error(err.message || err)
                    return;
                }
                let ln = cc.instantiate<cc.Node>(prefab);
                if(ln){
                    ln.setParent(this.level.node.parent);
                    this.level.node.destroy();
                    this.level = ln.getComponent(Level);
                    this.enable();
                }
            })
        }else if(this.level){
            this.enable();
        }
    }
    startGame(){
        Gameplay.instance.gameStart();
        this.isReady = false;
        this.level.reset();
        this.arenaUI.reset();
        
        //this.onGameStart.forEach(val=>val.emit(null));
    }
    readyGame(){
        if(!this.isReady){
            this.level.ready();
            this.arenaUI.ready();
            
            this.isReady = true;
        }
    }
    // runGame(){
    //     if(!this.isRun){
    //         this.level.run();
    //         this.isRun = true;
    //     }
    // }
    restart(){
        
        this.startGame();
    }
    finishGame(){
        this.isReady = false;
        this.level.finish();

        this.arenaUI.summary();
    }
    endGame(){
        Gameplay.instance.gameEnd();
        
        this.level.end();
        //this.onGameEnd.forEach(val=>val.emit(null));
        
    }
    disable(){
        if(!this.node.active){
            this.onDisable();
        }else{
            this.node.active = false;
        }
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
