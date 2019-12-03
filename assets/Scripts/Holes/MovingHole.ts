
import Hole from "../Hole";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MovingHole extends Hole {
    speed = 200;
    dir = 1;
    moveFunc: Function = null;
    onLoad(){
        this.moveFunc = this.horizontalMove;
    }
    update(dt){
        if(!this.isBallCaptured){
            this.moveFunc(dt);
        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        if(self.tag === 1 && other.node.group === 'hole' && other.tag === 0){
            this.dir = -this.dir
        }
    }
    horizontalMove(dt){
        let pwh = this.node.parent.width/2;
        if(this.node.x >= pwh-this.getRadius()){
            this.dir = -1;
        }else if(this.node.x <= -pwh+this.getRadius()){
            this.dir = 1;
        }
        this.node.x += dt*this.dir*this.speed;
    }
}