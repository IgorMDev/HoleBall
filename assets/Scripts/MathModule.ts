/**
 * @class Contains some useful math utils
 */
export default class MathUtils{
    /**
     * clamps the value between min and max
     */
    static clamp(value: number, min: number, max: number):number{
        return (value < min) ? min : (value > max) ? max : value;
    }
    /**
     * clamps the value between 0 and 1
     */
    static clamp01(value: number):number{
        return (value < 0) ? 0 : (value > 1) ? 1 : value;
    }
    /**
     * linearly interpolates from - to by a ratio
     */
    static lerp(from:number, to:number, ratio:number): number{
        return from + (to - from)*ratio;
    }
    static moveTowards(from:number, to:number, maxDelta:number): number{
        let d = to - from;
        if(maxDelta > d){
            maxDelta = d;
        }
        return from + maxDelta*Math.sign(d);
    }
}