import NavigationNode from "./NavigationNode";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NavigationManager extends cc.Component {
    private navStack: NavigationNode[] = [];
    private static _instance: NavigationManager = null;
    static get instance(){
        return NavigationManager._instance;
    }
    constructor(){
        super();
        return NavigationManager._instance || (NavigationManager._instance = this);
    }
    @property(NavigationNode)
    rootNode: NavigationNode = null;
    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    onKeyDown(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.back:
            case cc.macro.KEY.backspace:
            case cc.macro.KEY.escape:
               this.goBack();
            break;
        }
    }
    addNavigation(nav: NavigationNode): number{
        return this.navStack.push(nav)-1;
    }
    goBack(){
        if(this.navStack.length > 1){
            let l = this.navStack.pop();
            if(l) l.close();
        }
        if(this.navStack.length > 0){
            
            this.navStack[this.navStack.length-1].open();
        }
    }
    backTo(nav: NavigationNode){
        let i = this.navStack.indexOf(nav);
        if(i > -1){
            this.navStack.splice(i)[0].close();
            if(i > 0){
                this.navStack[i-1].open();
            }
        }
    }
}