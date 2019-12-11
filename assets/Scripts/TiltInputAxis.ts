import Arena from "./Arena";
import Game from "./Game";

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
    accX = 0;
    oAccX = 0;
    isActive = false;
    onLoad(){
        if(!this.arena){
            this.arena = this.getComponent(Arena);
        }
        this.arena.node.on('resumed', this.onResume, this);
        this.arena.node.on('started', this.checkControls, this);
        this.checkControls();
    }
    onEnable(){
        this.registerEvents();
    }
    onDisable(){
        this.unregisterEvents();
    }
    update(dt){
        if(this.isActive){
            this.arena.level.moveByHandler(this.movePoint.y/this.moveUnit);
        }
        if(Math.abs(this.accX - this.oAccX) > 0.05){
            this.arena.level.tiltToHandler(-this.accX/this.accUnit);
        }
        
    }
    onResume(){
        this.checkControls();
    }
    checkControls(){
        this.enabled = Game.instance.settings.controls[ControlType.Tilt];
    }
    registerEvents(){
        cc.systemEvent.setAccelerometerEnabled(true);
        cc.systemEvent.setAccelerometerInterval(0.02);
        this.touchArea.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onTilt, this);
    }
    unregisterEvents(){
        cc.systemEvent.setAccelerometerEnabled(false);
        this.touchArea.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onTilt, this);
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
            this.movePoint.y = 0;
            this.isActive = false;
        }
    }
    onTilt(event){
        if(event.acc){
            this.oAccX = this.accX;
            this.accX = event.acc.x;
            cc.log('acc vector x '+event.acc);
        }
    }
}