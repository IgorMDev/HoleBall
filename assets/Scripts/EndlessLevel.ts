
import Level from "./Level";
import RandomHoleField from "./RandomHoleField";
import Gameplay from "./Gameplay";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EndlessLevel extends Level {
    @property({type:RandomHoleField, override: true})
    holeFields: RandomHoleField[] = [];
    @property
    meterScale = 10;
    @property
    maxSpeed = 10;
    @property(cc.Node)
    ground: cc.Node = null;
    @property(cc.Node)
    bestLine: cc.Node = null;
    @property(cc.Node)
    lastLine: cc.Node = null;
    @property(cc.Label)
    lastLineLabel: cc.Label = null;
    @property(cc.Label)
    bestLineLabel: cc.Label = null;
    
    groundY = 0;
    groundSpeed = 0;
    scoreCounter = 0;
    onLoad() {
        super.onLoad();
        this.groundSpeed = this.speed/2;
        this.groundY = this.ground.y;
        //this.moveWatchers.push(this.lastLine, this.bestLine);
    }
    reset(){
        super.reset();
        this.scoreCounter = 0;
        cc.tween(this.ground).set({y: -this.node.height/2}).to(0.5,{y: this.groundY},null).start();
        
    }
    ready(){
        super.ready();
        this.setRecordLines();
    }
    run(){
        super.run();
        this.schedule(this.progressChecker, 0.2);
    }
    finish(){
        super.finish();
        this.unscheduleAllCallbacks();
        cc.tween(this.ground).to(0.5,{y: -this.node.height/2},null).start();
        this.hideRecordLines();
    }
    update(dt){
        super.update(dt);
        if(!Gameplay.paused && this.isRun){
            this.ground.y += (this.groundSpeed*dt - this.dyt*this.speed);
            this.ground.y = cc.misc.clampf(this.ground.y, -this.node.height/2 - 100, 0);
            
        }
    }
    moveBy(dy: number){
        if(!Gameplay.paused){
        super.moveBy(dy);
        if(dy !== 0 && this.isRun && this.isReady){
            this.scoreCounter += this.dyt*this.speed;
            if(this.scoreCounter >= 0){
                this.score = Math.floor(this.scoreCounter/this.meterScale);
            }

        }
        }
    }
    moveFieldBy(dy: number){
        for(let field of this.holeFields){
            field.node.y += dy*this.speed*this.moveDir;
            if(dy > 0 && field.node.y < -this.node.height/2-field.node.height/2){
                field.node.y += field.node.height*this.holeFields.length;
                field.clear();
                field.spawn();
                console.log("treshhold down");
            }
        }
    }
    setRecordLines(){
        if(this.sd.score){
            this.lastLine.active = true;
            this.lastLine.y = this.sd.score*this.meterScale;
        }
        if(this.sd.bestScore && this.sd.bestScore !== this.sd.score){
            this.bestLine.active = true;
            this.bestLine.y = this.sd.bestScore*this.meterScale;
        }
        this.setRecordLinesLabel();
    }
    hideRecordLines(){
        this.lastLine.active = this.bestLine.active = false;
    }
    /*
        UI
    */
    setRecordLinesLabel(){
        this.lastLineLabel.string = this.sd.score+'';
        this.bestLineLabel.string = this.sd.bestScore+'';
    }
    /*
        progress in game
    */
    minorChecks = 1; midChecks = 1; majorChecks = 1;

    progressChecker(){
        if(this.score >= 1000*this.majorChecks){
            this.onMajorCheck();
            this.majorChecks++;
            this.midChecks++;
        }else if(this.score >= 500*this.midChecks){
            this.onMiddleCheck();
            this.midChecks++;
        }else if(this.score >= 250*this.minorChecks){
            this.onMinorCheck();
            this.minorChecks++;
        }
    }
    onMinorCheck(){
        let r;
        let invoked = false;
        do{
            r = Math.random();
            if(r < 0.4){
                invoked = this.funcInvokeLimiter(()=>{this.speedUp(20)}, 'speedUp20',2);
            }else{
                invoked = this.funcInvokeLimiter(()=>{this.speedUp(10)}, 'speedUp10',2);
            }
        }while(!invoked);
        
    }
    onMiddleCheck(){
        let r;
        let invoked = false;
        do{
            r = Math.random();
            if(r < 0.5){
                invoked = this.funcInvokeLimiter(()=>{
                    this.fieldsFillRateUp();
                }, 'fieldsFillRateUp',2);
            }else{
                invoked = this.funcInvokeLimiter(()=>{this.speedUp(20)}, 'speedUp20', 2);
            }
        }while(!invoked);
    }
    onMajorCheck(){
        let r;
        let invoked = false;
        do{
            r = Math.random();
            if(r < 0.4){
                invoked = this.funcInvokeLimiter(()=>{
                    this.fieldsRevealNewHoles();
                }, '',2);
            }else{
                // invoked = this.funcInvokeLimiter(()=>{
                    
                // }, '',2);
            }
        }while(!invoked);
    }
    fieldsFillRateUp(dr = 0.05){
        let r;
        let invoked = false;
        do{
            r = Math.floor(Math.random()*this.holeFields.length);
            invoked = this.funcInvokeLimiter(()=>{
                this.holeFields[r].fillRateUp(dr)
            }, 'holeFieldRateUp'+r, 2, 'holeFieldsFill');
        }while(!invoked);
    }
    fieldsRevealNewHoles(){
        let r;
        let invoked = false;
        do{
            r = Math.floor(Math.random()*this.holeFields.length);
            invoked = this.funcInvokeLimiter(()=>{
                this.holeFields[r].revealNextHole();
            }, 'holeFieldRevealHole'+r, 2, 'holeFieldsHoles');
        }while(!invoked);
    }
    speedUpByRate(rate = 0.1){
        this.speed = cc.misc.clampf(this.speed + this.speed*rate, 0, this.maxSpeed);
    }
    speedUp(ds = 25){
        this.speed = cc.misc.clampf(this.speed + ds, 0, this.maxSpeed);
        cc.log('speed up by '+ds)
    }
    funcInvokeData = {
        default: {name: '', count: 0}
    }
    funcInvokeLimiter(f: Function, name: string, limit: number, group = 'default'): boolean{
        let d = this.funcInvokeData[group];
        if(!d){
            this.funcInvokeData[group] = d = {name:'', count: 0}
        }
        if(name === d.name){
            if(d.count < limit){
                f();
                d.count++;
            }else{
                return false;
            }
        }else{
            f();
            d.name = name;
            d.count = 1;
        }
        return true;
    }
}