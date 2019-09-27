import HoleSpawner from "./HoleSpawner";
import Hole from "./Hole";
import Level from "./Level";
import HoleField from "./HoleField";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EndlessLevel extends Level {
    @property(cc.Node)
    holeFields: cc.Node[] = [];
    @property
    startPosY = 0;
    level = 1;
    score = 0;
    bottomLimit = 0;
    onLoad() {
        this.bottomLimit = this.node.position.y - this.node.height;
    }
    onEnable(){
        for(let i in this.holeFields){
            this.holeFields[i].y = this.startPosY+this.node.height*parseInt(i);
        }
    }
    start() {

    }

    move(dy: number){
        
        for(let field of this.holeFields){
            field.y = field.y + dy*this.speed;
            
            if(field.y < this.bottomLimit){
                field.y = field.y + this.node.height*this.holeFields.length;
                console.log("treshhold");
            }
        }
        super.move(dy);
    }
    reset(){
        for(let field of this.holeFields){
            field.getComponent(HoleField).resetR();
        }
        super.reset();
    }
    onLevelUp(){
        
    }
}