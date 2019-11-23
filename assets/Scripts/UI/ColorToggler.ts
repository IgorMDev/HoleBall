
const {ccclass, property} = cc._decorator;

@ccclass
export default class ColorToggler extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;
    @property(cc.Color)
    onColor: cc.Color = cc.Color.WHITE;
    @property(cc.Color)
    offColor: cc.Color = cc.Color.WHITE;
    @property
    duration = 0.1;
    isOn = true;
    onTween: cc.Tween = null;
    offTween: cc.Tween = null;
    onLoad(){
        this.onTween = cc.tween(this.target).to(this.duration, {color: this.onColor}, null);
        this.offTween = cc.tween(this.target).to(this.duration, {color: this.offColor}, null);
    };
    toggle(){
        if(this.isOn){
            this.toggleOff();
        }else{
            this.toggleOn();
        }
    }
    toggleOn(){
        if(this.onTween){
            if(this.offTween) this.offTween.stop();
            this.onTween.start();
        }
    }
    toggleOff(){
        if(this.offTween){
            if(this.onTween) this.onTween.stop();
            this.offTween.start();
        }
    }
}