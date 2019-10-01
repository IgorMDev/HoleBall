import Game from "../Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InGameUI extends cc.Component {
    @property(cc.Node)
    scorePanel: cc.Node = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Label)
    bestScoreLabel: cc.Label = null;
    
    onLoad () {
        
    }
    onEnable(){
        this.setScore(0);
    }
    start () {

    }

    // update (dt) {}

    setScore(sc: number){
        this.scoreLabel.string = sc + "m";
    }
    setBestScore(sc: number){
        this.bestScoreLabel.string = sc + "m";
    }
}