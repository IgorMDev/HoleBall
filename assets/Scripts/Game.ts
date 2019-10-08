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
    endlessData: endlessdata = {
        lastScore: 0,
        bestScore: 0
    }

    
    loadSaveData(){

    }

    writeSaveData(){
        //Object.assign(this.saveData, JSON.parse(cc.sys.localStorage.getItem('saveData')));
        console.log("endlessData "+this.endlessData);
    }
}
declare global{
    type gamedata = {
        sound: boolean,
        music: boolean
    }
    type endlessdata = {
        lastScore: number,
        bestScore: number
    }
}
