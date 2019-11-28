
const {ccclass, property,requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Collider)
export default class CollisionHandler extends cc.Component {
    @property(cc.String)
    otherGroup = '';
    @property(cc.Component.EventHandler)
    onEnterEvents: cc.Component.EventHandler[] = [];
    @property(cc.Component.EventHandler)
    onStayEvents: cc.Component.EventHandler[] = [];
    @property(cc.Component.EventHandler)
    onExitEvents: cc.Component.EventHandler[] = [];
    onLoad () {
        
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        if(!this.otherGroup || other.node.group === this.otherGroup){
            this.onEnterEvents.forEach(val=>val.emit(null));
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider){
        if(!this.otherGroup || other.node.group === this.otherGroup){
            this.onEnterEvents.forEach(val=>val.emit(null));
        }
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider){
        if(!this.otherGroup || other.node.group === this.otherGroup){
            this.onEnterEvents.forEach(val=>val.emit(null));
        }
    }
}