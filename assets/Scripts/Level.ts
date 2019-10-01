
const {ccclass, property} = cc._decorator;

@ccclass
export default class Level extends cc.Component {
    @property
    speed = 0;
    @property
    meterScale = 10;

    scoreMeters = 0;
    metersCounter = 0;
    onLoad () {
        
    }
    start () {

    }

    // update (dt) {}

    move(dy: number){
        this.metersCounter += dy*Math.abs(this.speed);
        if(this.metersCounter >= this.meterScale){
            this.scoreMeters += Math.floor(this.metersCounter/this.meterScale);
            this.metersCounter %= this.meterScale;
        }

    }
    reset(){
        this.scoreMeters = this.metersCounter = 0;
    }
    clear(){

    }
    
}