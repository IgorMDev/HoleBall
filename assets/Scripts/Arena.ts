
import Level from "./Level";
import Game from "./Game";
import Gameplay from "./Gameplay";

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
    keyName = 'Arena';
    sd = {};
    onLoad(){
        this.level.arena = this;
        this.readSaveData();
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
    loadLevelHandler(s, data){
        cc.log("%%%%%% sender "+ typeof s);
        cc.log("%%%%%% data "+data);
        this.loadLevel(data);
    }
    loadLevel(lname?: String){
        if(lname && this.level && this.level.node.name !== lname){
            cc.loader.loadRes(this.levelsPath + lname, cc.Prefab, (err, prefab)=>{
                if(err){
                    cc.error(err.message || err)
                    return;
                }
                let ln = cc.instantiate<cc.Node>(prefab);
                if(ln){
                    let newLevel = ln.getComponent(Level);
                    newLevel.arena = this;
                    ln.setParent(this.level.node.parent);
                    cc.loader.releaseRes(this.levelsPath + this.level.node.name, cc.Prefab);
                    this.level.node.destroy();
                    this.level = newLevel;
                    cc.log('load new level '+this.level.node.name);
                    this.enable();
                }
            })
            
        }else if(this.level){
            cc.log('load same level');
            this.enable();
        }
    }
    startGame(){
        this.node.opacity = 255;
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
    failGame(){
        this.isReady = false;
        this.level.fail();
    }
    finishGame(){
        this.isReady = false;
        this.level.finish();
        this.node.emit('finished');
    }
    endGame(){
        this.level.end();
        this.writeSaveData();
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
        this.node.opacity = 0;
        this.node.emit('paused');
    }
    onResume(){
        this.node.opacity = 255;
        this.node.emit('resumed');
    }
    readSaveData(){
        this.sd = Game.instance.progressData[this.keyName] || this.sd;
    }
    writeSaveData(){
        Game.instance.progressData[this.keyName] = this.sd;
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
