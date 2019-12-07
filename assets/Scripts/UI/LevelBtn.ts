import Game from "../Game";
import LevelsArena from "../LevelsArena";

const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class LevelBtn extends cc.Component {
    @property(cc.String)
    levelId: string = '1';
    @property(cc.Label)
    timeLabel: cc.Label = null;
    @property(cc.Node)
    shadowNode: cc.Node = null;
    @property
    opened = false;
    btn: cc.Button = null;
    levelData: leveldata = null;
    onLoad(){
        this.btn = this.getComponent(cc.Button);
        
    }
    onEnable(){
        this.readSaveData();
        if(this.opened || this.levelData){
            this.onOpened();
        }
        cc.log('level btn enabled');
    }
    open(){

    }
    onOpened(){
        this.shadowNode.opacity = 128;
        this.btn.interactable = true;
        if(this.levelData && this.levelData.bestScore > 0){
            this.timeLabel.string = LevelsArena.MilisecondsToMinSec(this.levelData.bestScore);
            this.timeLabel.node.active = true;
        }
    }
    readSaveData(){
        this.levelData = Game.instance.progressData.LevelsArena[this.levelId];
        
    }
    
}