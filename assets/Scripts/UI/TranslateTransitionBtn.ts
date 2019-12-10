import TransitionBtn from "./TransitionBtn";

const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class TranslateTransitionBtn extends TransitionBtn {
    @property(cc.Vec2)
    hoverDelta = cc.Vec2.ZERO;
    @property(cc.Vec2)
    pressedDelta = cc.Vec2.ZERO;
    @property({type: cc.Float, min: 0})
    duration = 0.1;
    @property
    easing: string = 'linear';

    startPos: cc.Vec2 = cc.Vec2.ZERO;
    
    registerEvents(){
        super.registerEvents();
        this.startPos = this.target.position;
        this.resetTween = cc.tween(this.target).to(this.duration, {
            position: this.startPos
        },{easing: this.easing});
        if(this.hoverDelta.mag()){
            this.hoverTween = cc.tween(this.target).to(this.duration, {
                position: this.startPos.add(this.hoverDelta)
            },{easing: this.easing});
        }
        if(this.pressedDelta.mag()){
            this.pressedTween = cc.tween(this.target).to(this.duration, {
                position: this.startPos.add(this.pressedDelta)
            },{easing: this.easing});
        }
    }

}