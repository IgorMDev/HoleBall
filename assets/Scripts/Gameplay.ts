import Arena from "./Arena";
import Game from "./Game";

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
        Arena.instance.enable();
        this.gameStart();
    }
    pauseGame(){
        Gameplay.paused = true;
        Arena.instance.onPause();
    }
    resumeGame(){
        Gameplay.paused = false;
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
        this.gameStartEvents.forEach(val=>val.emit(null));
    }
    gameEnd(){
        Gameplay.paused = true;
        this.gameEndEvents.forEach(val=>val.emit(null));
    }
    setKeyboardControlsHandler(s, data){
        this.setKeyboardControls(data === 'false' ? false : true);
    }
    setTouchControlsHandler(s, data){
        this.setTouchControls(data === 'false' ? false : true);
    }
    setTiltControlsHandler(s, data){
        this.setTiltControls(data === 'false' ? false : true);
    }
    setKeyboardControls(yes = true){
        if(yes) this.addControls(ControlType.Keyboard);
        else this.removeControls(ControlType.Keyboard);
    }
    setTouchControls(yes = true){
        if(yes) this.addControls(ControlType.Touch);
        else this.removeControls(ControlType.Touch);
    }
    setTiltControls(yes = true){
        if(yes) this.addControls(ControlType.Tilt);
        else this.removeControls(ControlType.Tilt);
    }
    addControls(c: ControlType){
        Game.instance.settings.controls.add(c);
    }
    removeControls(c: ControlType){
        Game.instance.settings.controls.delete(c);
    }
}

