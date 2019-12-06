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
    progressData = {
        EndlessArena: {
            gems: 0
        },
        LevelsArena: {}
    };
    settings: gamedata = {
        sound: true, music: true,
        controls: new Set([ControlType.Touch, ControlType.Keyboard])
    }
    
    loadSaveData(){
        
    }

    writeSaveData(){
        //Object.assign(this.saveData, JSON.parse(cc.sys.localStorage.getItem('saveData')));
    }
    exit(){
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
        controls: Set<ControlType>
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
