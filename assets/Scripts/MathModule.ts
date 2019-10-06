/**
 * @class Contains some useful math utils
 */
export default class MathUtils{
    /**
     * clamps the value between min (default 0) and max (default 1)
     */
    static clamp(value: number, min: number = 0, max: number = 1):number{
        return (value < min) ? min : (value > max) ? max : value;
    }
    /**
     * linearly interpolates from - to by a ratio
     */
    static lerp(from:number, to:number, ratio:number): number{
        return from + (to - from)*ratio;
    }
    static moveTowards(from:number, to:number, maxDelta:number): number{
        let d = to - from;
        let ad = Math.abs(d);
        if(ad <= Number.EPSILON){
            return to;
        }
        if(maxDelta > ad){
            maxDelta = ad;
        }
        return from + maxDelta*Math.sign(d);
    }

}