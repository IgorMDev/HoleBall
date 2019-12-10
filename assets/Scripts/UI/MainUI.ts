import Game from "../Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUI extends cc.Component {
    @property(cc.Node)
    recordsPanel: cc.Node = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.RichText)
    bestScoreLabel: cc.RichText = null;
    @property(cc.Label)
    gemsLabel: cc.Label = null;
    onEnable(){
        this.setGemsLabel();
        this.showRecordsPanel();
    }
    setGemsLabel(){
        this.gemsLabel.string = Game.instance.progressData.EndlessArena.gems+'';
    }
    showRecordsPanel(){
        let rd = Game.instance.progressData.EndlessArena['EndlessLevel'];
        if(this.recordsPanel && rd && rd.score && rd.bestScore){
            this.recordsPanel.active = true;
            this.scoreLabel.string = rd.score+'';
            this.bestScoreLabel.string = rd.bestScore+'';
        }
    }
}