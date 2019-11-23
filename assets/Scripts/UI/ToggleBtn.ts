
const {ccclass, property} = cc._decorator;

@ccclass
export default class ToggleBtn extends cc.Component {
    @property
    isOn = true;
    @property(cc.Component.EventHandler)
    onEvents: cc.Component.EventHandler[] = [];
    @property(cc.Component.EventHandler)
    offEvents: cc.Component.EventHandler[] = [];

    btn: cc.Button = null;
    onLoad(){
        this.btn = this.getComponent(cc.Button);
        this.registerEvents();
    }
    start(){
        if(this.isOn){
            this.toggleOn();
        }
    }
    onDestroy(){
        this.unregisterEvents();
    }
    registerEvents(){
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    };
    unregisterEvents(){
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    hide(){
        this.node.active = false;
    }
    show(){
        this.node.active = true;
    }
    toggle(){
        if(this.isOn){
            this.toggleOff();
        }else{
            this.toggleOn();
        }
    }
    toggleOn(){
        this.isOn = true;
        this.btn.interactable = false;
        this.onEvents.forEach(val=>val.emit([val.customEventData]));
        cc.log('toggle on '+this.node.name);
    }
    toggleOff(){
        this.isOn = false;
        this.btn.interactable = true;
        this.offEvents.forEach(val=>val.emit([val.customEventData]));
        cc.log('toggle off '+this.node.name);
    }
    onTouchEnd(e){
        this.toggle();
    }
}