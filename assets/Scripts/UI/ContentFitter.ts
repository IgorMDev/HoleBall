import Game from "../Game";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class ContentFitter extends cc.Component {
    
    label: cc.Label = null;
    onLoad () {
        this.label = this.getComponent(cc.Label);
    }
    
    start () {
        
    }

    // update (dt) {}

}