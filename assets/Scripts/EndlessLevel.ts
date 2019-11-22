
import Level from "./Level";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EndlessLevel extends Level {
    @property
    meterScale = 10;
    @property(cc.Node)
    ground: cc.Node = null;
    
    groundY = 0;
    groundSpeed = 0;
    scoreCounter = 0;

    onLoad() {
        super.onLoad();
        this.groundSpeed = 2*this.speed/3.5;
        this.groundY = this.ground.y;
    }
    reset(){
        super.reset();
        this.scoreCounter = 0;
        cc.tween(this.ground).set({y: -this.node.height/2}).to(0.5,{y: this.groundY},null).start();

    }
    finish(){
        super.finish();
        cc.tween(this.ground).to(0.5,{y: -this.node.height/2},null).start();
    }
    update(dt){
        super.update(dt);
        if(this.isRun){
            // this.ground.y += (this.groundSpeed-this.dy*this.speed)*dt;
            // this.ground.y = MathUtils.clamp(this.ground.y, -this.node.height/2, 0);
            
        }
    }
    moveBy(dy: number){
        super.moveBy(dy);
        if(dy !== 0 && this.isRun){
            // if(dy < 0 && this.scoreCounter > 0 || dy > 0 && this.scoreCounter < 0){
            //     this.scoreCounter = 0;
            // }
            this.scoreCounter += dy*this.speed;
            this.score = Math.floor(this.scoreCounter/this.meterScale);
        }
        
    }
    moveFieldBy(dy: number){
        for(let field of this.holeFields){
            field.node.y += dy*-this.speed;
            if(dy > 0 && field.node.y < -this.node.height/2-field.node.height/2){
                field.node.y += this.node.height*this.holeFields.length;
                field.reset();
                console.log("treshhold down");
            }
        }
    }
    onLevelUp(){
        
    }
}