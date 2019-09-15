
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
            this.isFocused = false;
        }
        
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
            case cc.macro.KEY.back:
            case cc.macro.KEY.backspace:
            case cc.macro.KEY.escape:
               
            break;
            case cc.macro.KEY.enter:
                
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
}