import Game from "../Game";
import NavigationPanel from "./NavigationPanel";
import Level from "../Level";

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
    level: Level = null;
    sd:leveldata = null;
    score = 0;
    units: string = '';
    onLoad () {
        
    }
    lateUpdate(){
        if(this.level.isRun){
            if(this.score !== this.level.score){
                this.setScore(this.score = this.level.score);
            }
        }
    }
    configureLevelUI(l: Level){
        this.level = l;
        this.sd = this.level.saveData;
        cc.log("conf ui level sd "+JSON.stringify(this.sd));
            if(this.level.type === 'distance'){
                this.units = 'm';
            }else if(this.level.type === 'time'){
                this.units = 's';
            }
    }
    reset(){
        this.scorePanel.active = false;
        
        this.setScore(0);
    }
    ready(){
        this.scorePanel.active = true;
    }
    summary(){
        this.summaryPanel.getComponent(NavigationPanel).openNext();
        this.scoreLabel.string = this.sd.lastScore +''+ this.units;
        this.setBestScore(this.sd.bestScore);
    }
    setScore(sc: number){
        this.scoreLabel.string = sc+'';
    }
    setBestScore(sc: number){
        this.bestScoreLabel.string = sc + this.units;
    }
}