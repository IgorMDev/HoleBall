
const {ccclass, property} = cc._decorator;
type key = cc.macro.KEY;
@ccclass
export default class KeyboardInput extends cc.Component {
    private static _instance: KeyboardInput = null;
    static get instance(){
        return KeyboardInput._instance;
    }
    constructor(){
        super();
        
        return KeyboardInput._instance || (KeyboardInput._instance = this);
    }
    downKeys: Set<key> = new Set();
    upKeys: Set<key> = new Set();
    pressedKeys: Set<key> = new Set();
    onLoad () {
        
        cc.systemEvent.on('keydown', this.onKeyDown, this);
        cc.systemEvent.on('keyup', this.onKeyUp, this);

    }
    lateUpdate(){
        if(this.downKeys.size){
            for(let k of this.downKeys){
                this.pressedKeys.add(k);
            }
            this.downKeys.clear();
        }
        if(this.upKeys.size){
            for(let k of this.upKeys){
                this.pressedKeys.delete(k);
            }
            this.upKeys.clear();
        }
    }
    static getAxis(pk: key, nk: key){
        let res = 0;
        if(KeyboardInput._instance.pressedKeys.has(pk)){
            res++;
        }
        if(KeyboardInput._instance.pressedKeys.has(nk)){
            res--;
        }
        return res;
    }
    static getKey(k: key){
        return KeyboardInput._instance.pressedKeys.has(k);
    }
    static getKeyDown(k: key){
        return KeyboardInput._instance.downKeys.has(k);
    }
    static getKeyUp(k: key){
        return KeyboardInput._instance.upKeys.has(k);
    }
    onKeyDown(event: cc.Event.EventKeyboard){
        this.downKeys.add(event.keyCode);
        
    }
    onKeyUp(event: cc.Event.EventKeyboard){
        
        this.upKeys.add(event.keyCode);
    }
    onDestroy(){
        cc.systemEvent.off('keydown', this.onKeyDown, this);
        cc.systemEvent.off('keyup', this.onKeyUp, this);
    }
}
