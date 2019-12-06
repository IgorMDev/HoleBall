import SoundManager from "./SoundManager";
import Arena from "./Arena";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LiftUp extends cc.Component {
    @property(cc.Prefab)
    destroyParticle: cc.Prefab = null;
    @property({type: cc.AudioClip})
    pickSound: cc.AudioClip = null;
    

    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        if(other.node.group === 'ball'){
            if(this.destroyParticle){
                let p = cc.instantiate(this.destroyParticle);
                p.setParent(this.node.parent);
                p.setPosition(this.node.position);
            }
            SoundManager.playEffect(this.pickSound);
            this.onPicked();
            this.node.destroy();
        }
    }
    onPicked(){
        Arena.instance.level.node.emit('powerup', 'liftUp');
    }
}