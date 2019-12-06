import SoundManager from "./SoundManager";
import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Gem extends cc.Component {
    @property(cc.Prefab)
    destroyParticle: cc.Prefab = null;
    @property({type: cc.AudioClip})
    pickSound: cc.AudioClip = null;
    onLoad () {

    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        if(other.node.group === 'ball'){
            if(this.destroyParticle){
                let p = cc.instantiate(this.destroyParticle);
                p.setParent(this.node.parent);
                p.setPosition(this.node.position);
            }
            SoundManager.playEffect(this.pickSound);
            this.node.destroy();
            this.onPicked();
        }
    }
    onPicked(){
        Game.instance.progressData.EndlessArena.gems++;
    }
}