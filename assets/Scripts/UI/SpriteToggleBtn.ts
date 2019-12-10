import ToggleBtn from "./ToggleBtn";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpriteToggleBtn extends ToggleBtn {
    @property(cc.Sprite)
    target: cc.Sprite = null;
    @property(cc.SpriteFrame)
    onSprite: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    offSprite: cc.SpriteFrame = null;
    toggleOn(){
        if(!this.isOn){
            this.target.spriteFrame = this.onSprite;
            super.toggleOn();
        }
    }
    toggleOff(){
        if(this.isOn){
            this.target.spriteFrame = this.offSprite;
            super.toggleOff();
        }
    }
    onTouchEnd(e){
        this.toggle();
    }
}