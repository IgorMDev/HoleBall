
import Arena from "./Arena";
import NavigationPanel from "./UI/NavigationPanel";

const {ccclass, property, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@executionOrder(-10)
@disallowMultiple
export default class LevelsArena extends Arena{
    @property(cc.Node)
    uiNode: cc.Node = null;
    @property(NavigationPanel)
    scorePanel: NavigationPanel = null;
    @property(NavigationPanel)
    summaryPanel: NavigationPanel = null;
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
        this.closeUI();
        super.endGame();
    }
    onPause(){
        this.hideUI();
    }
    onResume(){
        this.showUI();
    }
    /*
    **********--- UI ---*************
    */
    private resetUI(){
        this.showUI();
        this.scorePanel.hide();
        this.summaryPanel.close();
        this.setScoreLabel(this.level.score);
    }
    private readyUI(){
        this.scorePanel.show();
    }
    private showSummaryUI(){
        this.summaryPanel.openNext();
        this.scoreLabel.string = this.level.sd.score +'m';
        this.setBestScoreLabel(this.level.sd.bestScore);
    }
    private closeUI(){
        this.scorePanel.hide();
        this.summaryPanel.close();
    }
    private setScoreLabel(sc: number){
        this.scoreLabel.string = sc+'';
    }
    private setBestScoreLabel(sc: number){
        this.bestScoreLabel.string = sc + 'm';
    }
    hideUI(){
        this.uiNode.active = false;
    }
    showUI(){
        this.uiNode.active = true;
    }
}
