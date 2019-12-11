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
        this.arena.node.on('started', this.checkControls, this);
        this.checkControls();
    }
    update(dt){
        if(KeyboardInput.isSomeKeyPressed()){
            this.moveAxis = KeyboardInput.getAxes([cc.macro.KEY.up,cc.macro.KEY.w], [cc.macro.KEY.down,cc.macro.KEY.s]);
            this.rotAxis = KeyboardInput.getAxes([cc.macro.KEY.left,cc.macro.KEY.a], [cc.macro.KEY.right,cc.macro.KEY.d]);
            if(this.moveAxis) this.arena.level.moveByHandler(this.moveAxis);
            if(this.rotAxis) this.arena.level.tiltByHandler(this.rotAxis);
        }
    }
    onResume(){
        this.checkControls();
    }
    checkControls(){
        this.enabled = Game.instance.settings.controls[ControlType.Keyboard];
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