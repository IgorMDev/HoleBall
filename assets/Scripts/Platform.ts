
const {ccclass, property} = cc._decorator;

@ccclass
export default class Platform extends cc.Component {

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.keyboardControl, this);
    }
    start () {

    }

    // update (dt) {}

    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.keyboardControl, this);
    }
    keyboardControl(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.left:

                break;
            case cc.macro.KEY.right:
                
                    break;
        }
    }
}
