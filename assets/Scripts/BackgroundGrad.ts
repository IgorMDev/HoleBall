import Game from "./Game";

const {ccclass, property} = cc._decorator;
@ccclass
export default class BackgroundGrad extends cc.Component {
    static _instance: BackgroundGrad = null;
    @property(cc.Node)
    nodes: cc.Node[] = [];
    sd = {}
    onLoad(){
        BackgroundGrad._instance = this;
        this.nodes = this.node.children;
        this.readSaveData();
        
    }
    moveY(dy: number){
        if(dy !== 0 && this.nodes.length){
        for(let n of this.nodes){
            n.y += dy;
            if(dy > 0 && n.y > this.node.height+n.height/2*n.scaleY){
                n.y -= n.height*n.scaleY*this.nodes.length;
            }else if(dy < 0  && n.y < -n.height/2*n.scaleY){
                n.y += n.height*n.scaleY*this.nodes.length;
            }
        }
        }
    }
    readSaveData(){
        this.sd = Game.instance.progressData.Background;
        if(this.sd){
            for(let n of this.nodes){
                n.y = this.sd[n.name].y;
            }
        }
    }
    writeSaveData(){
        if(!this.sd) this.sd = {};
        for(let n of this.nodes){
            this.sd[n.name] = {y: n.y};
        }
        Game.instance.progressData.Background = this.sd;
    }
}