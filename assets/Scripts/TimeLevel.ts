import HoleSpawner from "./HoleSpawner";
import Hole from "./Hole";
import Level from "./Level";
import Gameplay from "./Gameplay";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TimeLevel extends Level {
    @property(cc.String)
    nextLevel = '';
    
    reset(){
        super.reset();

    }
    update(dt){
        super.update(dt);
        if(!Gameplay.paused && this.isRun && this.isReady){
            this.score += dt*1000;
            
        }
    }
    
    
    writeScores(){
        this.sd.score = this.score;
        if(this.score < this.sd.bestScore || !this.sd.bestScore){
            this.sd.bestScore = this.score;
        }
    }
}