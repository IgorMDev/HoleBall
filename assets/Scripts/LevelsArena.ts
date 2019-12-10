
import Arena from "./Arena";
import NavigationPanel from "./UI/NavigationPanel";
import TimeLevel from "./TimeLevel";

const {ccclass, property, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@executionOrder(-10)
@disallowMultiple
export default class LevelsArena extends Arena{
    private static time = new Date();
    static MilisecondsToMinSec(ms: number){
        this.time.setTime(ms);
        let m = LevelsArena.time.getMinutes().toString(),
            s = LevelsArena.time.getSeconds().toString();
        return m.padStart(2, '0')+':'+s.padStart(2, '0');
    }
    @property(cc.Node)
    uiNode: cc.Node = null;
    @property(NavigationPanel)
    scorePanel: NavigationPanel = null;
    @property(NavigationPanel)
    summaryPanel: NavigationPanel = null;
    @property(NavigationPanel)
    failurePanel: NavigationPanel = null;
    @property(cc.Node)
    nextBtn: cc.Node = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Label)
    bestScoreLabel: cc.Label = null;

    keyName = "LevelsArena";
    onLoad () {
        super.onLoad();
    }
    lateUpdate(){
        if(this.level && this.level.isRun){
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
    failGame(){
        super.failGame();
        this.showFailureUI();
    }
    finishGame(){
        super.finishGame();
        let tl = this.level.getComponent(TimeLevel);
        if(tl && tl.nextLevel){
            this.sd[tl.nextLevel] = {score:0, bestScore: 0}
        }
        this.showSummaryUI();
    }
    endGame(){
        this.closeUI();
        super.endGame();
    }
    onPause(){
        super.onPause();
        this.hideUI();
    }
    onResume(){
        super.onResume();
        this.showUI();
    }
    nextLevel(){
        let tl = this.level.getComponent(TimeLevel);
        if(tl && tl.nextLevel){
            this.loadLevel(tl.nextLevel);
        }
    }
    /*
    **********--- UI ---*************
    */
    private resetUI(){
        this.showUI();
        this.scorePanel.hide();
        this.summaryPanel.close();
        this.failurePanel.close();
        this.setScoreLabel(this.level.score);
    }
    private readyUI(){
        this.scorePanel.show();
    }
    private showSummaryUI(){
        this.checkNextBtn();
        this.summaryPanel.openNext();
        this.setScoreLabel(this.level.sd.score);
        this.setBestScoreLabel(this.level.sd.bestScore);
    }
    private showFailureUI(){
        this.nextBtn.active = false;
        this.scorePanel.hide();
        this.failurePanel.openNext();
    }
    private checkNextBtn(){
        let tl = this.level.getComponent(TimeLevel);
        if(tl && tl.nextLevel){
            this.nextBtn.active = true;
        }else{
            this.nextBtn.active = false;
        }
    }
    private closeUI(){
        this.scorePanel.hide();
        this.summaryPanel.close();
    }
    private setScoreLabel(sc: number){
        this.scoreLabel.string = LevelsArena.MilisecondsToMinSec(sc);
    }
    private setBestScoreLabel(sc: number){
        this.bestScoreLabel.string = LevelsArena.MilisecondsToMinSec(sc);
    }
    hideUI(){
        this.uiNode.active = false;
    }
    showUI(){
        this.uiNode.active = true;
    }
}

