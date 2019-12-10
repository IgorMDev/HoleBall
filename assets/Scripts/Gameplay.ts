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
        cc.game.on(cc.game.EVENT_HIDE, this.pauseGame, this);
        cc.game.on(cc.game.EVENT_SHOW, this.resumeGame, this);
    }
    startGame(){
        Arena.instance.enable();
    }
    pauseGame(){
        Gameplay.paused = true;
        if(Arena.instance){
            this.enablePhysics(false);
            Arena.instance.onPause();
        }
    }
    resumeGame(){
        Gameplay.paused = false;
        if(Arena.instance){
            this.enablePhysics();
            Arena.instance.onResume();
        }
    }
    restartGame(){
        Arena.instance.restartGame()
    }
    exitGame(){
        Arena.instance.endGame();
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

