import HoleSpawner from "./HoleSpawner";
import Hole from "./Hole";
import Level from "./Level";
import HoleField from "./HoleField";
import Ball from "./Ball";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EndlessLevel extends Level {
    @property(HoleField)
    holeFields: HoleField[] = [];
    @property
    startPosY = 0;
    level = 1;
    score = 0;
    bottomLimit = Number.POSITIVE_INFINITY;;
    topLimit = Number.POSITIVE_INFINITY;
    onLoad() {
        super.onLoad();
        this.bottomLimit = this.node.position.y - this.node.height;
        this.topLimit = this.node.position.y + this.node.height;
    }
    start() {
        super.start();
    }
    reset(){
        super.reset();
        for(let i in this.holeFields){
            this.holeFields[i].clear();
            this.holeFields[i].node.y = this.startPosY+this.node.height*parseInt(i);
            
        }
        
    }
    ready(){
        super.ready();
        for(let field of this.holeFields){
            field.reset();
        }
    }
    run(){
        super.run();
        
    }
    finish(){
        for(let field of this.holeFields){
            field.setClear();
        }
        super.finish();
    }
    end(){
        
        super.end();
    }
    moveBy(dy: number){
        super.moveBy(dy);
        if(dy !== 0 && this.ball.isReady){
            if(dy < 0 && this.scoreCounter > 0 || dy > 0 && this.scoreCounter < 0){
                this.scoreCounter = 0;
            }
            this.scoreCounter += dy*this.speed;
            if(Math.abs(this.scoreCounter) >= this.meterScale){
                this.score += Math.floor(this.scoreCounter/this.meterScale);
                this.scoreCounter %= this.meterScale;
            }
        }
        for(let field of this.holeFields){
            field.node.y += dy*-this.speed;
            if(dy > 0 && field.node.y < this.bottomLimit){
                field.node.y += this.node.height*this.holeFields.length;
                field.reset();
                console.log("treshhold down");
            }
        }
        
    }
    onLevelUp(){
        
    }
}