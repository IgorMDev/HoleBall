import Arena from "./Arena";

const {ccclass, property, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@executionOrder(-11)
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
    onLoad(){
        cc.director.getPhysicsManager().gravity = cc.v2(0, -10);
    }
    startGame(){
        Arena.instance.enable();
        
        this.gameStart();
    }
    pauseGame(){
        Gameplay.paused = true;
        this.enablePhysics(false);
        Arena.instance.onPause();
    }
    resumeGame(){
        Gameplay.paused = false;
        this.enablePhysics();
        Arena.instance.onResume();
    }
    restartGame(){
        Arena.instance.restartGame()
    }
    exitGame(){
        Arena.instance.disable();
        this.gameEnd();
    }
    gameStart(){
        Gameplay.paused = false;
        this.enablePhysics();
        this.gameStartEvents.forEach(val=>val.emit(null));
    }
    gameEnd(){
        Gameplay.paused = true;
        this.enablePhysics(false);
        this.gameEndEvents.forEach(val=>val.emit(null));
    }
    enablePhysics(is = true){
        cc.director.getPhysicsManager().enabled = is;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -10);
        cc.director.getCollisionManager().enabled = is;
    }
}

