import Game from "../Game";
import RadioBtn from "./RadioBtn";
import SpriteToggleBtn from "./SpriteToggleBtn";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingUI extends cc.Component {
    private static _instance: SettingUI = null;
    static get instance(){
        return SettingUI._instance;
    }
    constructor(){
        super();
        console.log('setting constructor');
        return SettingUI._instance || (SettingUI._instance = this);
    }
    @property(SpriteToggleBtn)
    soundBtn: SpriteToggleBtn = null;
    @property(SpriteToggleBtn)
    musicBtn: SpriteToggleBtn = null;
    @property(RadioBtn)
    keyContrBtn: RadioBtn = null;
    @property(RadioBtn)
    touchContrBtn: RadioBtn = null;
    @property(RadioBtn)
    tiltContrBtn: RadioBtn = null;
    onLoad(){
        if(Game.instance.settings.music){
            this.musicBtn.toggleOn();
        }else{
            this.musicBtn.toggleOff();
        }
        if(Game.instance.settings.sound){
            this.soundBtn.toggleOn();
        }else{
            this.soundBtn.toggleOff();
        }
        this.keyContrBtn.node.active = !cc.sys.isMobile;
        this.touchContrBtn.node.active = cc.sys.isMobile || cc.sys.isNative || cc.sys.isBrowser;
        this.tiltContrBtn.node.active = cc.sys.isMobile;
    }
    init(){
        if(cc.sys.isMobile){
            this.setTouchControls();
        }else{
            this.setKeyboardControls();
        }
    }
    star(){
        if(Game.instance.settings.controls[ControlType.Keyboard]){
            this.keyContrBtn.checkOn();
        }else if(Game.instance.settings.controls[ControlType.Touch]){
            this.touchContrBtn.checkOn();
        }else if(Game.instance.settings.controls[ControlType.Tilt]){
            this.tiltContrBtn.checkOn();
        }else{
            if(!cc.sys.isMobile){
                this.keyContrBtn.node.active = true;
                this.keyContrBtn.checkOn();
            }else{
                this.touchContrBtn.checkOn();
            }
        }
    }
    toggleMusic(){
        if(Game.instance.settings.music){
            this.musicOff();
        }else{
            this.musicOn();
        }
    }
    toggleSound(){
        if(Game.instance.settings.sound){
            this.soundOff();
        }else{
            this.soundOn();
        }
    }
    soundOn(){
        cc.audioEngine.setEffectsVolume(1);
        Game.instance.settings.sound = true;
        cc.log('sound on');
        this.musicOn();
    }
    soundOff(){
        cc.audioEngine.setEffectsVolume(0);
        Game.instance.settings.sound = false;
        cc.log('sound off');
        this.musicOff();
    }
    musicOn(){
        cc.audioEngine.setMusicVolume(1);
        Game.instance.settings.music = true;
        cc.log('music on');
    }
    musicOff(){
        cc.audioEngine.setMusicVolume(0);
        Game.instance.settings.music = false;
        cc.log('music off');
    }
    setKeyboardControlsHandler(s, data){
        cc.log("%%%%%% key sender "+ typeof s);
        cc.log("%%%%%% key data "+data);
        this.setKeyboardControls(data == 'false' ? false : true);
    }
    setTouchControlsHandler(s, data){
        cc.log("%%%%%% touch sender "+ typeof s);
        cc.log("%%%%%% touch data "+data);
        this.setTouchControls(data == 'false' ? false : true);
    }
    setTiltControlsHandler(s, data){
        cc.log("%%%%%% tilt sender "+ typeof s);
        cc.log("%%%%%% data "+data);
        this.setTiltControls(data == 'false' ? false : true);
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
        if(!Game.instance.settings.controls[c])
            Game.instance.settings.controls[c] = true;
    }
    removeControls(c: ControlType){
        if(Game.instance.settings.controls[c])
            Game.instance.settings.controls[c] = false;
    }
}