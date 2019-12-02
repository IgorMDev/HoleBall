
import Hole from "../Hole";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GravityHole extends Hole {
    @property
    gravityAcc = 10;

    onCollisionStay(other: cc.Collider, self: cc.Collider){
        if(self.tag === 1 && other.node.group === 'ball' && !this.isBallCaptured){
            let dp = this.node.convertToWorldSpaceAR(cc.v2(0,0)).sub(other.node.convertToWorldSpaceAR(cc.v2(0,0)));
            let f = ((self as cc.CircleCollider).radius*this.node.scale + other.node.width - dp.mag())*this.gravityAcc*this.node.scale;
            let orb = other.getComponent(cc.RigidBody);
            if(orb) orb.applyForceToCenter(dp.normalize().mul(f), true);
        }
    }
}