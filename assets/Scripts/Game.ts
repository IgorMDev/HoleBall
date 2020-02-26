import BackgroundGrad from "./BackgroundGrad";
import SettingUI from "./UI/SettingUI";

//import encrypt from "encryptjs";

const {ccclass, property, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@executionOrder(-15)
@disallowMultiple
export default class Game extends cc.Component {
    private static _instance: Game = null;
    static get instance(){
        return Game._instance;
    }
    constructor(){
        super();
        return Game._instance || (Game._instance = this);
    }
    
    onLoad(){
        this.loadSaveData();
        window.addEventListener('beforeunload', (e)=>{console.log('window before unloaded'); this.writeSaveData();});
        
    }
    start(){
        SettingUI.instance.init();
    }
    progressData = {
        Background: null,
        EndlessArena: {
            gems: 0
        },
        LevelsArena: {
            Level1: {score: 0, bestScore:0}
        }
    };
    settings: gamedata = {
        sound: true, music: true,
        controls: {
            [ControlType.Touch]: false,
            [ControlType.Keyboard]: false,
            [ControlType.Tilt]: false,
        }
    }
    onDestroy(){
        this.writeSaveData();
        cc.log('game destroyed');
    }
    loadSaveData(){
        let pd = cc.sys.localStorage.getItem('progressData'),
            set = cc.sys.localStorage.getItem('settings');
        if(pd){
            this.progressData = JSON.parse(pd);
        }
        if(set){
            this.settings = JSON.parse(set);
        }
        
    }

    writeSaveData(){
        BackgroundGrad._instance.writeSaveData();
        cc.sys.localStorage.setItem('progressData', JSON.stringify(this.progressData));
        cc.sys.localStorage.setItem('settings', JSON.stringify(this.settings));
        cc.log('-=-=-write game savedata');
    }
    clearSaveData(){
        cc.sys.localStorage.removeItem('progressData');
        cc.sys.localStorage.removeItem('settings');
    }
    exit(){
        this.writeSaveData();
        cc.game.end();
        
    }
}
enum ControlType{
    Keyboard, Touch, Tilt
}
window['ControlType'] = ControlType;

declare global{
    type gamedata = {
        sound: boolean,
        music: boolean,
        controls: {}
    }
    type levelsdata = {
        [key: string]: leveldata
    }
    type leveldata = {
        score: number,
        bestScore: number
    }
    enum ControlType{
        Keyboard, Touch, Tilt
    }
}
