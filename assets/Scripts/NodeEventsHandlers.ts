
const {ccclass, property} = cc._decorator;

@ccclass
export default class NodeEventHandlers extends cc.Component {

    activate(){this.node.active = true;}
    deactivate(){this.node.active = false;}
    evalCode(event: Event, code?: string){
        if(code){
            eval(code);
        }
    }
}