

const {ccclass, property} = cc._decorator;

@ccclass
export default class NavigationPanel extends cc.Component {
    static focusedPanel: NavigationPanel = null;
    @property
    isOpen = false;
    
    @property(cc.Component.EventHandler)
    onEscape: cc.Component.EventHandler[] = [];
    @property(cc.Component.EventHandler)
    openedEvent: cc.Component.EventHandler[] = [];
    @property(cc.Component.EventHandler)
    closedEvent: cc.Component.EventHandler[] = [];

    isShow = false;
    prevPanel: NavigationPanel = null;
    nextPanel: NavigationPanel = null;
    onLoad () {
        if(this.isOpen && !NavigationPanel.focusedPanel){
            NavigationPanel.focusedPanel = this;
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, NavigationPanel.onKeyUp);
            this.isShow =  true;
            this.onOpen();
        }
    }
    hide(){
        if(this.isShow){
            this.node.active = false;
            this.isShow = false;
        }
    }
    show(){
        if(!this.isShow){
            this.node.active = true;
            this.isShow = true;
        }
    }
    openNext(){
        if(NavigationPanel.focusedPanel) NavigationPanel.focusedPanel.hide();
        this.open();
        
    }
    openPrevious(){
        let prev = this.prevPanel;
        this.closeNext(this);
        if(prev){
            prev.nextPanel = null;
            prev.open();
        }
    }
    close(){
        if(this.prevPanel){
            NavigationPanel.focusedPanel = this.prevPanel;
        }
        this.closeNext(this);
        
    }
    open(){
        if(!this.isOpen){
            this.isOpen = true;
            if(NavigationPanel.focusedPanel){
                this.prevPanel = NavigationPanel.focusedPanel;
                this.prevPanel.nextPanel = this;
            }
            NavigationPanel.focusedPanel = this;
            this.show();
            this.onOpen();
        }else if(!this.isShow){
            NavigationPanel.focusedPanel = this;
            this.show();
        }
        cc.log('opened panel '+this.node.name+'\nprev '+(this.prevPanel ? this.prevPanel.node.name : null))
    }
    closeNext(next?: NavigationPanel){
        cc.log('closed panel '+this.node.name+'\nprev '+(this.prevPanel? this.prevPanel.node.name : null)+
        '\nnext '+(this.nextPanel ? this.nextPanel.node.name : null))
        if(!next) next = this;
        if(next.nextPanel){
            next.nextPanel.closeNext();
        }
        if(next.isOpen){
            this.isOpen = false;
            next.nextPanel = next.prevPanel = null;
            this.hide();
            this.onClose();
        }else if(next.isShow){
            next.hide();
        }
        
    }
    onOpen(){
        
        this.openedEvent.forEach(val=>val.emit(null));
    }
    onClose(){
        
        this.closedEvent.forEach(val=>val.emit(null));
    }
    static onKeyUp(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.back:
            case cc.macro.KEY.backspace:
            case cc.macro.KEY.escape:
            if(NavigationPanel.focusedPanel.isOpen){
                if(NavigationPanel.focusedPanel.onEscape.length){
                    NavigationPanel.focusedPanel.onEscape.forEach(val=>val.emit(null));
                }else{
                    NavigationPanel.focusedPanel.openPrevious();
                }
            }
            break;
        }
    }
}