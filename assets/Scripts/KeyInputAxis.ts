import Arena from "./Arena";
import Game from "./Game";
import KeyboardInput from "./KeyboardInput";
import Level from "./Level";

const {ccclass, property} = cc._decorator;

const axesEnum = cc.Enum({
    NONE: 0, ARROWS: 1, WASD: 2
});
@ccclass
export default class KeyInputAxis extends cc.Component {
    @property(cc.Node)
    arena: Arena = null;
    
    moveAxis = 0;
    rotAxis = 0;
    onLoad(){
        if(!this.arena){
            this.arena = this.getComponent(Arena);
        }
        this.arena.node.on('resumed', this.onResume, this);
        this.checkControls();
    }
    // onEnable(){
    //     this.registerEvents();
    // }
    // onDisable(){
    //     this.unregisterEvents();
    // }
    onDestroy(){
        
    }
    update(dt){
        if(KeyboardInput.isSomeKeyPressed()){
            this.moveAxis = KeyboardInput.getAxes([cc.macro.KEY.up,cc.macro.KEY.w], [cc.macro.KEY.down,cc.macro.KEY.s]);
            this.rotAxis = KeyboardInput.getAxes([cc.macro.KEY.left,cc.macro.KEY.a], [cc.macro.KEY.right,cc.macro.KEY.d]);
            this.arena.level.moveBy(this.moveAxis*dt);
            this.arena.level.tiltBy(this.rotAxis*dt);
        }
    }
    onResume(){
        this.checkControls();
    }
    checkControls(){
        if(Game.instance.settings.controls.has(ControlType.Keyboard)){
            this.enabled = true;
        }else{
            this.enabled = false;
        }
    }
    // arrowsAxis(){
    //     this.moveAxis = KeyboardInput.getAxis(cc.macro.KEY.up, cc.macro.KEY.down);
    //     this.rotAxis = KeyboardInput.getAxis(cc.macro.KEY.left, cc.macro.KEY.right);
    //     cc.log('arrow axis ');
    // }
    // wasdAxis(){
    //     this.moveAxis = KeyboardInput.getAxis(cc.macro.KEY.w, cc.macro.KEY.s);
    //     this.rotAxis = KeyboardInput.getAxis(cc.macro.KEY.a, cc.macro.KEY.d);
    //     cc.log('wasd axis ');
    // }
    // getAxisHandler(ae: axesEnum){
    //     switch(ae){
    //         case axesEnum.ARROWS:
    //             return this.arrowsAxis;
    //         case axesEnum.WASD:
    //             return this.wasdAxis;
    //     }
    //     return null;
    // }
    // registerEvents(){
        
    // }
    // unregisterEvents(){
        
    // }
}
declare global{
    enum axesEnum{
        NONE, ARROWS, WASD
    }
}