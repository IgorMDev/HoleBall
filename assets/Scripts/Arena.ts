
import Level from "./Level";
import Game from "./Game";
import Gameplay from "./Gameplay";
import MathUtils from "./MathModule";

const {ccclass, property, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@executionOrder(-10)
@disallowMultiple
export default abstract class Arena extends cc.Component{
    private static _instance: Arena = null;
    static get instance(){
        return Arena._instance;
    }
    @property(Level)
    level: Level = null;
    @property(cc.String)
    levelsPath: string = '';

    isReady = false;
    sd = {};
    onLoad(){
        this.level.arena = this;
        this.readSaveData();
        cc.log("@@@ arena loaded");
    
    }
    onEnable(){
        if(Arena._instance && Arena._instance !== this){
            Arena._instance.disable();
        }
        Arena._instance = this;
        this.level.arena = this;
        
        this.startGame();
    }
    enable(){
        if(this.node.active){
            this.onEnable();
        }else{
            this.node.active = true;
        }
    }
    // update(dt) {
    //     if(this.isReady && !Gameplay.paused){
            
    //     }
    // }
    loadLevelHandler(s, data){
        cc.log("%%%%%% sender "+ typeof s);
        cc.log("%%%%%% data "+data);
        this.loadLevel(data);
    }
    loadLevel(lname?: String){
        if(lname && this.level && this.level.name !== lname){
            cc.loader.loadRes(this.levelsPath + lname, (err, prefab)=>{
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
        this.isReady = false;
        this.level.reset();
        this.node.emit('started');
        Gameplay.instance.gameStart();
    }
    readyGame(){
        if(!this.isReady){
            this.level.ready();
            
            this.isReady = true;
        }
    }
    restartGame(){
        
        this.startGame();
        //Gameplay.instance.gameRestart();
    }
    finishGame(){
        this.isReady = false;
        this.level.finish();
        this.node.emit('finished');
    }
    endGame(){
        
        this.level.end();
        //this.writeSaveData();
        this.disable();
        Gameplay.instance.gameEnd();
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
    onPause(){
        this.node.emit('paused');
    }
    onResume(){
        this.node.emit('resumed');
    }
    readSaveData(){
        this.sd = Game.instance.progressData[this.node.name];
        if(!this.sd){
            Game.instance.progressData[this.node.name] = this.sd = {

            };
        }
    }
    writeSaveData(){
        Game.instance.progressData[this.node.name] = this.sd;
    }
    // touchStart = (event: cc.Event.EventTouch) => {
    //     let loc = event.getLocation();
    //     let dx = loc.x - this.touchArea.width/2,
    //         dy = loc.y - this.touchArea.height/2;
    //     this.touchVec = cc.v2(dx, dy);
    //     console.log("*******t loc "+loc);
        
    // }
    // touchEnd = (event: cc.Event.EventTouch) => {
    //     this.touchVec = cc.Vec2.ZERO;
    // }
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
