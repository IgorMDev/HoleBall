import Arena from "./Arena";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TouchInputAxis extends cc.Component {
    @property({type:cc.Integer, min: 1})
    moveUnit = 100;
    @property({type:cc.Integer, min: 1})
    rotUnit = 100;
    @property(cc.Node)
    touchArea: cc.Node = null;
    @property(cc.Node)
    arena: Arena = null;

    startPoint: cc.Vec2 = cc.Vec2.ZERO;
    movePoint: cc.Vec2 = cc.Vec2.ZERO;
    isActive = false;
    onLoad () {
        if(!this.arena){
            this.arena = this.getComponent(Arena);
        }
        this.touchArea.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    onDestroy(){
        this.touchArea.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    update(dt){
        if(this.isActive){
            this.arena.level.moveBy(this.movePoint.y/this.moveUnit*dt);
            this.arena.level.tiltTo(-this.movePoint.x/this.rotUnit);
        }
    }
    onTouchStart(event: cc.Event.EventTouch){
        cc.log('touch start id'+event.getID());
        if(event.getID() < 1){
            this.startPoint = event.getLocation();
            this.isActive = true;
        }
    }
    onTouchMove(event: cc.Event.EventTouch){
        if(event.getID() < 1){
            this.movePoint = event.getLocation().subSelf(this.startPoint);
            this.movePoint.clampf(cc.v2(-this.rotUnit,-this.moveUnit), cc.v2(this.rotUnit,this.moveUnit));
        }
    }
    onTouchEnd(event: cc.Event.EventTouch){
        cc.log('touch end id'+event.getID());
        if(event.getID() < 1){
            this.startPoint = cc.Vec2.ZERO;
            this.isActive = false;
        }
    }
}