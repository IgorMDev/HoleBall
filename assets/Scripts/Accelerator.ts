
import Mathu from "./MathModule";

const {ccclass, property,requireComponent} = cc._decorator;
@ccclass
export default class Accelerator extends cc.Component{
    @property
    scale = 1;
    @property
    isFlipping = false;
    @property
    isDumping = true;
    @property(cc.String)
    easing: string = '';
    easeFunc: Function = (k:number)=>k;
    dumpingSpeed = 1;
    y = 0;
    x = 0;
    active = false;
    onLoad(){
        if(this.easing)
            this.setEasing(this.easing);
    }
    lateUpdate(){
        if(this.isDumping && !this.active && (this.x > Number.EPSILON || this.x < Number.EPSILON)){
            this.by(0);
        }
        this.active = false;
    }
    /* to(p: number, dt?: number){
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
        this.active = true;
        return this.y;
    } */
    by(da: number){
        let sign = Math.sign(da);
        if((sign > 0 && this.x < 0) || (sign < 0 && this.x > 0)){
            if(this.isFlipping)
                this.x = 0;
        }
        if(da === 0){
            da = cc.director.getDeltaTime()*this.dumpingSpeed;
        }
        this.x = Mathu.moveTowards(this.x, sign, Math.abs(da));
        this.y = this.easeFunc(Math.abs(this.x))*this.scale*Math.sign(this.x);
        this.active = true;
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