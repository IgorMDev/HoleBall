
const {ccclass, property} = cc._decorator;

@ccclass
export default class TiltInputAxis extends cc.Component {
    @property({type:cc.Integer, min: 1})
    unitSize = 100;
    @property(cc.Node)
    touchArea: cc.Node = null;

    startPoint: cc.Vec2 = cc.Vec2.ZERO;
    accVec: cc.Vec2 = cc.Vec2.ZERO;
    isActive = false;
    onLoad () {
        cc.systemEvent.setAccelerometerEnabled(true);
        this.touchArea.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onTilt, this);
    }
    onDestroy(){
        this.touchArea.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onTilt, this);
    }
    getHorizontal(){
        return this.accVec.x/this.unitSize;
    }
    getVertical(){
        return this.accVec.y/this.unitSize;
    }
    isTouch(){
        return this.isActive ? 1 : 0;
    }
    onTouchStart(event: cc.Event.EventTouch){
        if(event.getID() < 1){
            let loc = event.getLocation();
            this.startPoint = loc;
            console.log("*******t loc "+loc);
            this.isActive = true;
        }
    }
    onTouchEnd(event: cc.Event.EventTouch){
        if(event.getID() < 1){
            this.startPoint = cc.Vec2.ZERO;
            this.isActive = false;
        }
    }
    onTilt(event){
        this.accVec = cc.v2(event.acc.x, event.acc.y);
        //cc.log('accvector '+this.accVec);
    }
}