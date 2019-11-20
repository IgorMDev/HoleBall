
const {ccclass, property} = cc._decorator;

@ccclass
export default class TouchInputAxis extends cc.Component {
    @property({type:cc.Integer, min: 1})
    unitSize = 100;
    @property(cc.Node)
    touchArea: cc.Node = null;

    startPoint: cc.Vec2 = cc.Vec2.ZERO;
    movePoint: cc.Vec2 = cc.Vec2.ZERO;
    isActive = false;
    onLoad () {

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
    getHorizontal(){
        return this.movePoint.x/this.unitSize;
    }
    getVertical(){
        return this.movePoint.y/this.unitSize;
    }
    isTouch(){
        return (this.isActive ? 1 : 0);
    }
    onTouchStart(event: cc.Event.EventTouch){
        cc.log('touch start id'+event.getID());
        if(event.getID() < 1){
            let loc = event.getLocation();
            this.startPoint = loc;
            console.log("*******t loc "+loc);
            this.isActive = true;
        }
    }
    onTouchMove(event: cc.Event.EventTouch){
        if(event.getID() < 1){
            let loc = event.getLocation();
            this.movePoint = loc.subSelf(this.startPoint);
        }
    }
    onTouchEnd(event: cc.Event.EventTouch){
        cc.log('touch end id'+event.getID());
        if(event.getID() < 1){
            this.startPoint = this.movePoint = cc.Vec2.ZERO;
            this.isActive = false;
        }
    }
}