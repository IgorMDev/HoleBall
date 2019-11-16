import Game from "../Game";

const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class LevelBtn extends cc.Component {
    @property(cc.String)
    levelId: string = '1';
    @property(cc.Label)
    timeLabel: cc.Label = null;
    @property(cc.SpriteFrame)
    openedSprite: cc.SpriteFrame = null;
    @property
    opened = false;
    btn: cc.Button = null;
    levelData: leveldata = null;
    onLoad(){
        this.btn = this.getComponent(cc.Button);
        this.levelData = Game.instance.levelsData[this.levelId];
        
    }
    start(){
        if(this.opened || this.levelData){
            this.onOpened();
        }
    }
    open(){

    }
    onOpened(){
        this.btn.target.getComponent(cc.Sprite).spriteFrame = this.openedSprite;
        if(this.levelData && this.levelData.bestScore > 0){
            this.timeLabel.string = '';
            this.timeLabel.enabled = true;
        }
    }
}