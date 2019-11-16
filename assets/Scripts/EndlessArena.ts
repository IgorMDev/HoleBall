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
export default class EndlessArena extends Arena{
    
    @property(cc.Node)
    scorePanel: cc.Node = null;
    @property(cc.Node)
    summaryPanel: cc.Node = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Label)
    bestScoreLabel: cc.Label = null;
    score = 0;
    onLoad () {
        super.onLoad();
    }

    lateUpdate(){
        if(this.level.isRun){
            if(this.score !== this.level.score){
                this.setScoreLabel(this.score = this.level.score);
            }
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
    /*
    **********--- UI ---*************
    */
    resetUI(){
        this.scorePanel.active = false;
        this.setScoreLabel(this.score = 0);
    }
    readyUI(){
        this.scorePanel.active = true;
    }
    showSummaryUI(){
        this.summaryPanel.getComponent(NavigationPanel).openNext();
        this.scoreLabel.string = this.level.sd.lastScore +'m';
        this.setBestScoreLabel(this.level.sd.bestScore);
    }
    setScoreLabel(sc: number){
        this.scoreLabel.string = sc+'';
    }
    setBestScoreLabel(sc: number){
        this.bestScoreLabel.string = sc + 'm';
    }
}

