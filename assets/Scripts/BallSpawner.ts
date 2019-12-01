
const {ccclass, property} = cc._decorator;

@ccclass
export default class BallSpawner extends cc.Component {
    @property(cc.Prefab)
    ballPrefab: cc.Prefab = null;
    @property(cc.Node)
    mask: cc.Node = null;
    @property({type: cc.AudioClip})
    spawnAudio: cc.AudioClip = null;
    
    start(){
        this.node.scale = 0;
    }
    spawn(callback: (b: cc.Node) => void){
        var ball = cc.instantiate(this.ballPrefab);
        ball.parent = this.mask;
        ball.setPosition(cc.v2(0, this.mask.height/2 + ball.height));
        ball.active = false;
        cc.tween(this.node).set({scale: 0}).delay(0.5).call(()=>{
            if(this.spawnAudio) cc.audioEngine.playEffect(this.spawnAudio, false);
        }).to(0.5, {scale: 1}, {easing: 'backOut'})
        .call(()=>{
            
            ball.active = true;
            cc.tween(ball).to(0.8, {y: 0}, null).call(()=>{
                ball.setParent(this.node.parent);
                ball.setPosition(this.node.position);
                callback(ball);
            }).start();
        }).delay(1).to(0.5, {scale: 0}, {easing: 'quadIn'}).start();
        
    }
}