import SoundManager from "./SoundManager";
import Arena from "./Arena";
import EndlessArena from "./EndlessArena";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Gem extends cc.Component {
    @property(cc.Prefab)
    destroyParticle: cc.Prefab = null;
    @property({type: cc.AudioClip})
    pickSound: cc.AudioClip = null;
    onLoad () {
        this.node.opacity = 0;
    }
    start(){
        cc.tween(this.node).to(0.3, {opacity: 255}, null).start();
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
            if(Arena.instance instanceof EndlessArena){
                (Arena.instance as EndlessArena).onGemPicked();
            }
        }
    }
    
}