import Arena from "./Arena";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TiltInputAxis extends cc.Component {
    @property({type:cc.Integer, min: 1})
    moveUnit = 100;
    @property({type:cc.Float, min: 0.1, max: 1, step: 0.1})
    accUnit = 1;
    @property(cc.Node)
    touchArea: cc.Node = null;
    @property(cc.Node)
    arena: Arena = null;

    startPoint: cc.Vec2 = cc.Vec2.ZERO;
    movePoint: cc.Vec2 = cc.Vec2.ZERO;
    isActive = false;
    onLoad(){
        if(!this.arena){
            this.arena = this.getComponent(Arena);
        }
        this.arena.node.on('resumed', this.onResume, this);
        this.arena.node.on('paused', this.onPause, this);
        cc.systemEvent.setAccelerometerEnabled(true);
        this.touchArea.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onTilt, this);
    }
    onDestroy(){
        this.touchArea.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onTilt, this);
    }
    update(dt){
        if(this.isActive){
            this.arena.level.moveBy(this.movePoint.y/this.moveUnit*dt);
        }
    }
    onResume(){

    }
    onPause(){

    }
    onTouchStart(event: cc.Event.EventTouch){
        if(event.getID() < 1){
            this.startPoint = event.getLocation();
            this.isActive = true;
        }
    }
    onTouchMove(event: cc.Event.EventTouch){
        if(event.getID() < 1){
            this.movePoint = event.getLocation().subSelf(this.startPoint);
            this.movePoint.y = cc.misc.clampf(this.movePoint.y, -this.moveUnit, this.moveUnit);
        }
    }
    onTouchEnd(event: cc.Event.EventTouch){
        if(event.getID() < 1){
            this.startPoint = cc.Vec2.ZERO;
            this.isActive = false;
        }
    }
    onTilt(event){
        let accX = event.acc.x;
        if(accX){
            this.arena.level.tiltTo(accX/this.accUnit);
            cc.log('acc vector x '+accX);
        }
    }
}