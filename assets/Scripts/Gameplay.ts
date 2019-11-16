import Arena from "./Arena";

//import encrypt from "encryptjs";

const {ccclass, property, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@executionOrder(-12)
@disallowMultiple
export default class Gameplay extends cc.Component {
    private static _instance: Gameplay = null;
    static paused = false;
    static get instance(){
        return Gameplay._instance;
    }
    constructor(){
        super();
        return Gameplay._instance || (Gameplay._instance = this);
    }
    @property(cc.Component.EventHandler)
    gameStartEvents: cc.Component.EventHandler[] = [];
    @property(cc.Component.EventHandler)
    gameEndEvents: cc.Component.EventHandler[] = [];
    startGame(){
        Arena.instance.startGame();
    }
    pauseGame(){
        Gameplay.paused = true;
    }
    resumeGame(){
        Gameplay.paused = false;
    }
    restartGame(){
        Arena.instance.restartGame()
    }
    exitGame(){
        //Arena.instance.disable();
    }
    gameStart(){
        Gameplay.paused = false;
        this.gameStartEvents.forEach(val=>val.emit(null));
    }
    gameEnd(){
        this.gameEndEvents.forEach(val=>val.emit(null));
    }
}

