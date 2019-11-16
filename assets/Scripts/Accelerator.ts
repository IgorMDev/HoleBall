
import Mathu from "./MathModule";

const {ccclass, property,requireComponent} = cc._decorator;
@ccclass
export default class Accelerator extends cc.Component{
    @property
    isFlipping = true;
    @property
    isDumping = true;
    @property(cc.String)
    easing: string = '';
    easeFunc: Function = (k:number)=>k;
    y = 0;
    x = 0;
    onLoad(){
        this.setEasing(this.easing);
    }
    lateUpdate(){
        if(this.isDumping && this.x > Number.EPSILON){
            this.to(0,1);
        }
    }
    to(p: number, dt?: number){
        if(!dt){dt = cc.director.getDeltaTime();}
        let sign = Math.sign(p);
        let np = dt * p;
        if((this.x<0 && np>this.x) || (this.x>0 && np<this.x)){
            p = this.x;
        }
        if(this.isFlipping && ((sign > 0 && this.x < 0) || (sign < 0 && this.x > 0))){
            this.x = 0;
        }
        this.x = Mathu.moveTowards(this.x, sign, dt);
        this.y = this.easeFunc(Math.abs(this.x))*p;
        return this.y;
    }
    
    setEasing(eas: string | Function){
        if(typeof eas === 'string'){
            if(eas !== ''){
                this.easeFunc = cc.easing[eas] || this.easeFunc;
            }
        }else{
            this.easeFunc = eas;
        }
    }
}