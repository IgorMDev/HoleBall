
const {ccclass, property} = cc._decorator;
@ccclass
export default class BackgroundGrad extends cc.Component {
    static _instance: BackgroundGrad = null;
    @property(cc.Node)
    nodes: cc.Node[] = [];
    
    onLoad(){
        BackgroundGrad._instance = this;
        this.nodes = this.node.children;
    }
    moveY(dy: number){
        if(dy !== 0 && this.nodes.length){
        for(let n of this.nodes){
            n.y += dy;
            if(dy > 0 && n.y > this.node.height+n.height/2*n.scaleY){
                n.y -= n.height*n.scaleY*this.nodes.length;
                cc.log('-----bg threshhold up');
            }else if(dy < 0  && n.y < -n.height/2*n.scaleY){
                n.y += n.height*n.scaleY*this.nodes.length;
                cc.log('-----bg threshhold down');
            }
        }
        }
    }
}