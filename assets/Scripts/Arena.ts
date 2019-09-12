
const {ccclass, property} = cc._decorator;

@ccclass
export default class Arena extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    onLoad () {
        const pm = cc.director.getPhysicsManager();
        pm.enabled = true;
        pm.gravity = cc.v2(0, -9.8);
    }

    start () {

    }

    // update (dt) {}
}
/* 
const {ccclass, property} = cc._decorator;

@ccclass
export default class Platform extends cc.Component {

    onLoad () {

    }
    start () {

    }

    // update (dt) {}
} */