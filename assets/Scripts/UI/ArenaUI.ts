import Game from "../Game";
import NavigationPanel from "./NavigationPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ArenaUI extends cc.Component {

    @property(cc.Node)
    scorePanel: cc.Node = null;
    @property(cc.Node)
    summaryPanel: cc.Node = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Label)
    bestScoreLabel: cc.Label = null;
    saveData: endlessdata = null;
    onLoad () {
        this.saveData = Game.instance.endlessData;
    }
    start () {

    }
    reset(){
        this.scorePanel.active = false;
        this.setScore(0);
        this.setBestScore(this.saveData.bestScore);
    }
    ready(){
        this.scorePanel.active = true;
    }
    summary(score: number){
        this.summaryPanel.getComponent(NavigationPanel).openNext();
        
        if(this.saveData.bestScore < score){
            this.saveData.bestScore = score;
            this.setBestScore(this.saveData.bestScore);
        }
    }
    setScore(sc: number){
        this.scoreLabel.string = sc + "m";
    }
    setBestScore(sc: number){
        this.bestScoreLabel.string = sc + "m";
    }
}