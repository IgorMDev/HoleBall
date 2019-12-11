
const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default abstract class TransitionBtn extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;

    resetTween: cc.Tween = null;
    hoverTween: cc.Tween = null;
    pressedTween: cc.Tween = null;
    btn: cc.Button = null;
    onLoad(){
        this.btn = this.getComponent(cc.Button);
        if(!this.target) this.target = this.btn.target;
        this.registerEvents();
    }
    onDestroy(){
        this.unregisterEvents();
    }
    registerEvents(){
        
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onHoverIn, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onHoverOut, this);
    };
    
    unregisterEvents(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this.onHoverIn, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onHoverOut, this);
        
    }
    hide(){
        this.node.active = false;
    }
    show(){
        this.node.active = true;
    }
    click(){
        this.clickDown();
        this.clickUp();
    }
    clickDown(){
        this.btn.node.dispatchEvent(new cc.Event.EventCustom('touchstart',true));
    }
    clickUp(){
        this.btn.node.dispatchEvent(new cc.Event.EventCustom('touchend',true));
    }
    enable(){
        if(!this.enabled){
            this.enabled = true;
        }
    }
    disable(){
        if(this.enabled){
            this.enabled = false;
        }
    }
    onTouchStart(e){
        if(this.pressedTween && this.btn.interactable){
            this.pressedTween.start();
        }
    }
    onTouchEnd(e){
        if(this.pressedTween && this.btn.interactable){
            this.pressedTween.stop();
            this.resetTween.start();
        }
    }
    onHoverIn(){
        if(this.hoverTween && this.btn.interactable){
            this.hoverTween.start();
        }
    }
    onHoverOut(){
        if(this.hoverTween && this.btn.interactable){
            this.hoverTween.stop();
            this.resetTween.start();
        }
    }
}