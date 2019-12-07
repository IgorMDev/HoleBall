
import Hole from "../Hole";
import Ball from "../Ball";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TargetHole extends Hole {
    @property(cc.Prefab)
    ballCatchParticle: cc.Prefab = null;
    captureBall(b: Ball){
        this.isBallCaptured = true;
        b.node.setParent(this.node);
        if(this.node.scale != 0){
            b.node.scale = (1 / this.node.scale)-0.1;
        }
        b.rb.active = false;
        cc.tween(b.node).to(0.3,{
            position: cc.v2(0,0)
        },{easing:'quadIn'}).call(()=>{
            b.node.setParent(this.mask);
            
            if(this.ballCatchParticle){
                let n = cc.instantiate(this.ballCatchParticle);
                this.node.addChild(n, 0);
                n.setPosition(0,0);
            }
        }).delay(1).call(()=>{b.level.arena.finishGame();}).start();
    }
    
}