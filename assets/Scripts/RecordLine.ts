
const {ccclass, property,requireComponent} = cc._decorator;

@ccclass
export default class RecordLine extends cc.Component {

    @property(cc.Prefab)
    breakParticle: cc.Prefab = null;
    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        if(other.node.group === 'ball'){
            let part = cc.instantiate(this.breakParticle);
            this.node.active = false;
            part.setParent(this.node.parent);
            part.setPosition(this.node.position);
        }
    }
    /* onCollisionStay(other: cc.Collider, self: cc.Collider){
        
    }
    onCollisionExit(other: cc.Collider, self: cc.Collider){
        
    } */
}