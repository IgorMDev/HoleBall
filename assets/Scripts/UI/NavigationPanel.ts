

const {ccclass, property} = cc._decorator;

@ccclass
export default class NavigationPanel extends cc.Component {
    static focusedPanel: NavigationPanel = null;
    @property
    isOpen: boolean = false;
    @property(cc.Component.EventHandler)
    openedEvent: cc.Component.EventHandler[] = [];
    @property(cc.Component.EventHandler)
    closedEvent: cc.Component.EventHandler[] = [];

    prevPanel: NavigationPanel = null;
    onLoad () {
        if(this.isOpen && !NavigationPanel.focusedPanel){
            NavigationPanel.focusedPanel = this;
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, NavigationPanel.onKeyUp);
            this.onOpen();
        }
    }
    hide(){
        this.node.active = false;
    }
    show(){
        this.node.active = true;
    }
    openNext(){
        if(NavigationPanel.focusedPanel){
            this.prevPanel = NavigationPanel.focusedPanel;
            this.prevPanel.close();
        }
        this.open();
    }
    openPrevious(){
        if(NavigationPanel.focusedPanel === this && this.prevPanel){
            this.close();
            this.prevPanel.open();
            this.prevPanel = null;
        }
    }
    close(){
        this.isOpen = false;
        this.hide();
        this.onClose();
        
    }
    open(){
        this.isOpen = true;
        NavigationPanel.focusedPanel = this;
        this.show();
        this.onOpen();
    }
    private onOpen(){
        
        this.openedEvent.forEach(val=>val.emit(null));
    }
    private onClose(){
        
        this.closedEvent.forEach(val=>val.emit(null));
    }
    static onKeyUp(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.back:
            case cc.macro.KEY.backspace:
            case cc.macro.KEY.escape:
                NavigationPanel.focusedPanel.openPrevious();
            break;
        }
    }
}