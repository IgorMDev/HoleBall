
import Hole from "../Hole";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MovingHole extends Hole {
    speed = 250;
    dir = 1;
    moveFunc: Function = null;
    onLoad(){
        super.onLoad();
        this.moveFunc = this.horizontalMove;
        this.node.name = 'MovingHole';
    }
    update(dt){
        if(!this.isBallCaptured){
            this.moveFunc(dt);
        }
    }
    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        if(self.tag === 1 && other.node.group === 'hole'){
            if(other.node.name === 'MovingHole' && other.tag === 1){
                let oh = other.getComponent(MovingHole);
                //if(oh.dir === this.dir){
                    oh.dir = -this.dir;
                //}
            }else if(other.tag === 0){
                this.dir = -this.dir 
            }
            
        }
    }
    onCollisionStay(other: cc.Collider, self: cc.Collider){
        if(self.tag === 1 && other.node.group === 'hole'){
            if(other.node.name === 'MovingHole' && other.tag === 1){
                let oh = other.getComponent(MovingHole);
                //if(oh.dir === this.dir){
                    oh.dir = -this.dir;
                //}
            }
            
        }
    }
    horizontalMove(dt){
        let pwh = this.node.parent.width/2;
        if(this.node.x >= pwh-this.getRadius()*2){
            this.dir = -1;
        }else if(this.node.x <= -pwh+this.getRadius()*2){
            this.dir = 1;
        }
        this.node.x += dt*this.dir*this.speed;
    }
}