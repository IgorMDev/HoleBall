import Game from "../Game";


const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingUI extends cc.Component {
    static _instance: SettingUI = null;
    
    onLoad(){
        SettingUI._instance = this;
        if(Game.instance.settings.music){
            this.musicOn();
        }else{
            this.musicOff();
        }
        if(Game.instance.settings.sound){
            this.soundOn();
        }else{
            this.soundOff();
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
        Game.instance.settings.controls.add(c);
    }
    removeControls(c: ControlType){
        Game.instance.settings.controls.delete(c);
    }
}