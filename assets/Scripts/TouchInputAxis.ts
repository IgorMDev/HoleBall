import Arena from "./Arena";
import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TouchInputAxis extends cc.Component {
    @property({type:cc.Integer, min: 1})
    moveUnit = 100;
    @property({type:cc.Integer, min: 1})
    rotUnit = 100;
    @property(cc.Vec2)
    deadzone: cc.Vec2 = cc.Vec2.ZERO;
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
            this.arena.level.tiltToHandler(-this.movePoint.x/this.rotUnit);
        }
    }
    onResume(){
        this.checkControls();
    }
    checkControls(){
        this.enabled = Game.instance.settings.controls[ControlType.Touch];
    }
    registerEvents(){
        this.touchArea.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    unregisterEvents(){
        this.touchArea.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
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
            let loc = event.getLocation();
            this.movePoint = loc.sub(this.startPoint);
            if(Math.abs(this.movePoint.x) < this.deadzone.x) this.movePoint.x = 0;
            if(Math.abs(this.movePoint.y) < this.deadzone.y) this.movePoint.y = 0;
            this.movePoint.clampf(cc.v2(-this.rotUnit,-this.moveUnit), cc.v2(this.rotUnit,this.moveUnit));
        }
    }
    onTouchEnd(event: cc.Event.EventTouch){
        cc.log('touch end id'+event.getID());
        if(event.getID() < 1){
            this.startPoint = cc.Vec2.ZERO;
            this.movePoint.y = 0;
            this.isActive = false;
        }
    }
}