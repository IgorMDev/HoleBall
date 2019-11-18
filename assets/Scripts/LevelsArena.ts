import BallSpawner from "./BallSpawner";
import Ball from "./Ball";
import PlatformBlock from "./Block";
import Level from "./Level";
import Game from "./Game";
import Accelerator from "./Accelerator";
import KeyboardInput from "./KeyboardInput";
import Gameplay from "./Gameplay";
import ArenaUI from "./UI/ArenaUI";
import Arena from "./Arena";
import NavigationPanel from "./UI/NavigationPanel";

const {ccclass, property, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@executionOrder(-10)
@disallowMultiple
export default class LevelsArena extends Arena{
    
    @property(cc.Node)
    scorePanel: cc.Node = null;
    @property(cc.Node)
    summaryPanel: cc.Node = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Label)
    bestScoreLabel: cc.Label = null;
    onLoad () {
        super.onLoad();
    }

    lateUpdate(){
        if(this.level.isRun){
            this.setScoreLabel(this.level.score);
        }
    }
    startGame(){
        super.startGame();
        this.resetUI();
    }
    readyGame(){
        super.readyGame();
        this.readyUI();
    }
    finishGame(){
        super.finishGame();
        this.showSummaryUI();
    }
    endGame(){
        super.endGame();
        this.closeUI();
    }
    /*
    **********--- UI ---*************
    */
    private resetUI(){
        this.scorePanel.active = false;
        this.summaryPanel.getComponent(NavigationPanel).openPrevious();
        this.setScoreLabel(this.level.score);
    }
    private readyUI(){
        this.scorePanel.active = true;
    }
    private showSummaryUI(){
        this.summaryPanel.getComponent(NavigationPanel).openNext();
        this.scoreLabel.string = this.level.sd.score +'m';
        this.setBestScoreLabel(this.level.sd.bestScore);
    }
    private closeUI(){
        this.scorePanel.active = false;
        this.summaryPanel.getComponent(NavigationPanel).close();
    }
    private setScoreLabel(sc: number){
        this.scoreLabel.string = sc+'';
    }
    private setBestScoreLabel(sc: number){
        this.bestScoreLabel.string = sc + 'm';
    }
    
}

