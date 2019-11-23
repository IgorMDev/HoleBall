
const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class RadioBtn extends cc.Component {
    static groups: Array<Set<RadioBtn>> = [];
    @property({type: cc.Integer, min: 0})
    group = 0;
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
        this.addToGroup();
    }
    start(){
        if(this.isOn){
            this.checkOn();
        }
    }
    onDestroy(){
        this.unregisterEvents();
    }
    addToGroup(){
        let gr = RadioBtn.groups[this.group];
        if(!gr){
            RadioBtn.groups[this.group] = new Set();
        }
        RadioBtn.groups[this.group].add(this);
        cc.log('added to group '+this.group);
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
    check(){
        if(!this.isOn){
            this.checkOn();
        }
    }
    checkOn(){
        RadioBtn.groups[this.group].forEach(val => {
            if(val != this && val.isOn){
                val.checkOff();
            }
        })
        this.isOn = true;
        this.btn.interactable = false;
        this.onEvents.forEach(val=>val.emit([val.customEventData]));
        cc.log('radio on '+this.node.name);
    }
    checkOff(){
        this.isOn = false;
        this.btn.interactable = true;
        this.offEvents.forEach(val=>val.emit([val.customEventData]));
        cc.log('radio off '+this.node.name);
    }
    onTouchEnd(e){
        this.check()
    }
}