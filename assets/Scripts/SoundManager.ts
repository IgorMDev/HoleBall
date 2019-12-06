//import encrypt from "encryptjs";

const {ccclass, property, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@executionOrder(-13)
@disallowMultiple
export default class SoundManager extends cc.Component {
    private static _instance: SoundManager = null;
    static get instance(){
        return SoundManager._instance;
    }
    constructor(){
        super();
        return SoundManager._instance || (SoundManager._instance = this);
    }
    @property({type: cc.AudioClip})
    backgroundMusic: cc.AudioClip = null;

    start(){
        
        cc.audioEngine.playMusic(this.backgroundMusic, true);
        
    }
    static playEffect(ac: cc.AudioClip, isLoop = false){
        if(ac){
            cc.audioEngine.playEffect(ac, isLoop);
        }else{
            cc.log('audio clip is null');
        }
    }
}

