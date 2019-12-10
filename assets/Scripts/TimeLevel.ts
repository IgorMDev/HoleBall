import HoleSpawner from "./HoleSpawner";
import Hole from "./Hole";
import Level from "./Level";
import Gameplay from "./Gameplay";
import LevelsArena from "./LevelsArena";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TimeLevel extends Level {
    @property(cc.String)
    nextLevel = '';
    arena: LevelsArena = null;
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