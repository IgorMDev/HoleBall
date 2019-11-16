import HoleSpawner from "./HoleSpawner";
import Hole from "./Hole";
import Level from "./Level";
import HoleField from "./HoleField";
import Ball from "./Ball";
import MathUtils from "./MathModule";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TimeLevel extends Level {
    
    @property
    startPosY = 0;
    onLoad() {
        super.onLoad();
    }
    start() {
        super.start();
    }
    reset(){
        super.reset();
        this.holeField.clear();
        
    }
    ready(){
        super.ready();
        this.holeField.reset();
    }
    run(){
        super.run();
        
    }
    finish(){
        this.holeField.setClear();
        super.finish();
    }
    end(){
        
        super.end();
    }
    update(dt){
        super.update(dt);
    }
    moveBy(dy: number){
        super.moveBy(dy);
        if(dy !== 0 && this.ball.isReady){
            
        }
        this.holeField.node.y += dy*-this.speed;
        
    }
    checkBestScore(){
        return this.score < this.sd.bestScore;
    }
}