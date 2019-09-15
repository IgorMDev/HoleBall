import NavigationManager from "./NavigationManager";

 
const {ccclass, property} = cc._decorator;

@ccclass
export default class NavigationNode extends cc.Component {
    @property
    isOpen: boolean = false;
    @property
    showOnly: boolean = false;
    onLoad () {
        if(this.isOpen){
            this.opened();
        }
    }
    hide(){
        this.node.active = false;
    }
    show(){
        this.node.active = true;
    }
    open(){
        this.show();
        if(!this.isOpen){
            
            this.opened();
            this.isOpen = true;
        }
    }
    close(){
        if(!this.showOnly){
            this.hide();
            if(this.isOpen){
                
                this.closed();
                this.isOpen = false;
            }
        }
    }
    private opened(){
        NavigationManager.instance!.addNavigation(this);
    }
    private closed(){
        NavigationManager.instance!.backTo(this);
    }
}