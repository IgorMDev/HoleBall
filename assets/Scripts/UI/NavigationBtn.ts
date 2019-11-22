
const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class NavigationBtn extends cc.Component {
    static focusedBtn: NavigationBtn = null;
    @property(NavigationBtn)
    up: NavigationBtn = null;
    @property(NavigationBtn)
    right: NavigationBtn = null;
    @property(NavigationBtn)
    down: NavigationBtn = null;
    @property(NavigationBtn)
    left: NavigationBtn = null;
    @property
    isFocused: boolean = false;

    btn: cc.Button = null;
    onLoad () {
        this.btn = this.getComponent(cc.Button);
        if(this.isFocused && !NavigationBtn.focusedBtn){
            NavigationBtn.focusedBtn = this;
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, NavigationBtn.onKeyDown);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, NavigationBtn.onKeyUp);
            this.isFocused = false;
        }
    }
    hide(){
        this.node.active = false;
    }
    show(){
        this.node.active = true;
    }
    moveUp(){
        this.setFocus(this.up);
    }
    moveRight(){
        this.setFocus(this.right);
    }
    moveDown(){
        this.setFocus(this.down);
    }
    moveLeft(){
        this.setFocus(this.left);
    }
    setFocus(nb: NavigationBtn){
        if(nb){
            NavigationBtn.focusedBtn = nb;
            nb.onFocused();
            this.onUnfocused();
        }
    }
    clickDown(){
        this.btn.node.dispatchEvent(new cc.Event.EventCustom('touchstart',true));
    }
    clickUp(){
        this.btn.node.dispatchEvent(new cc.Event.EventCustom('touchend',true));
    }
    onFocused(){
        if(!this.isFocused){
            switch(this.btn.transition){
                case cc.Button.Transition.COLOR:
                    this.btn.target.color = this.btn.hoverColor;
                break;
                case cc.Button.Transition.SCALE:
                    this.btn.node.scale *= (Math.floor(this.btn.zoomScale)+this.btn.zoomScale)/2;
                break;
                case cc.Button.Transition.SPRITE:
                    this.btn.target.getComponent(cc.Sprite).spriteFrame = this.btn.hoverSprite;
                break;
            }
            this.isFocused = true;
        }
    }
    onUnfocused(){
        if(this.isFocused){
            switch(this.btn.transition){
                case cc.Button.Transition.COLOR:
                    this.btn.target.color = this.btn.normalColor;
                break;
                case cc.Button.Transition.SCALE:
                    this.btn.node.scale /= (Math.floor(this.btn.zoomScale)+this.btn.zoomScale)/2;
                    
                break;
                case cc.Button.Transition.SPRITE:
                    this.btn.target.getComponent(cc.Sprite).spriteFrame = this.btn.normalSprite;
                break;
            }
            this.isFocused = false;
        }
    }
    static onKeyDown(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.enter:
                NavigationBtn.focusedBtn.clickDown();
            break;
            case cc.macro.KEY.up:
                NavigationBtn.focusedBtn!.moveUp();
            break;
            case cc.macro.KEY.right:
                NavigationBtn.focusedBtn!.moveRight();
            break;
            case cc.macro.KEY.down:
                NavigationBtn.focusedBtn!.moveDown();
            break;
            case cc.macro.KEY.left:
                NavigationBtn.focusedBtn!.moveLeft();
            break;
        }
    }
    static onKeyUp(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.enter:
                NavigationBtn.focusedBtn.clickUp();
            break;
        }
    }
}