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
    
    levelsData: levelsdata = {}
    
    loadSaveData(){

    }

    writeSaveData(){
        //Object.assign(this.saveData, JSON.parse(cc.sys.localStorage.getItem('saveData')));
        console.log("endlessData "+this.levelsData);
    }
}
declare global{
    type gamedata = {
        sound: boolean,
        music: boolean
    }
    type levelsdata = {
        [key: string]: leveldata
    }
    type leveldata = {
        lastScore: number,
        bestScore: number
    }
    
}
