
import Mathu from "./MathModule";

export default class Accelerator{
    isFlipping = true;
    easing: Function = (k:number)=>k;
    y = 0;
    x = 0;
    constructor(eas?: string | Function, flip = true){
        if(eas){
            this.setEasing(eas);
        }
        this.isFlipping = flip;
    }
    to(p: number, dt: number){
        let sign = Math.sign(p);
        let np = dt * p;
        if((this.x<0 && np>this.x) || (this.x>0 && np<this.x)){
            p = this.x;
        }
        if(this.isFlipping && ((sign > 0 && this.x < 0) || (sign < 0 && this.x > 0))){
            this.x = 0;
        }
        this.x = Mathu.moveTowards(this.x, sign, dt);
        this.y = this.easing(Math.abs(this.x))*p;
        return this.y;
    }
    
    setEasing(eas: string | Function){
        if(typeof eas === 'string'){
            let e = cc.easing[eas];
            if(e){
                this.easing = e;
            }
        }else{
            this.easing = eas;
        }
    }
}