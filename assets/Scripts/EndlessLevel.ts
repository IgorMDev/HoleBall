
import Level from "./Level";
import RandomHoleField from "./RandomHoleField";
import Gameplay from "./Gameplay";
import EndlessArena from "./EndlessArena";

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
    arena: EndlessArena = null;
    groundY = 0;
    groundSpeed = 0;
    scoreCounter = 0;
    startSpeed = 0;
    onLoad() {
        super.onLoad();
        this.groundSpeed = this.speed/2;
        this.groundY = this.ground.y;
        this.startSpeed = this.speed;
        this.node.on('powerup', this.powerUpHandler, this);
    }
    reset(){
        super.reset();
        this.speed = this.startSpeed;
        this.scoreCounter = 0;
        cc.tween(this.ground).set({y: -this.node.height/2}).to(0.5,{y: this.groundY},null).start();
        this.hideRecordLines();
        this.resetProgress();
    }
    ready(){
        super.ready();
        this.setRecordLines();
    }
    run(){
        super.run();
        this.schedule(this.progressChecker, 0.2);
    }
    fail(){
        this.finish();
    }
    finish(){
        super.finish();
        this.unschedule(this.progressChecker);
        cc.tween(this.ground).to(0.5,{y: -this.node.height/2},null).start();
        this.hideRecordLines();
    }
    update(dt){
        super.update(dt);
        if(!Gameplay.paused && this.isRun && this.isReady){
            this.ground.y += (this.groundSpeed*dt - this.dyt*this.speed);
            this.ground.y = cc.misc.clampf(this.ground.y, -this.node.height/2 - 100, 0);
            if(this.dyt !== 0){
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
    onGemPicked(){
        this.arena.onGemPicked();
    }
    powerUpHandler(type){
        cc.log('powerup handler');
        switch(type){
            case 'liftUp':
                cc.log('on lift up');
                let ballBlink = cc.tween(this.ball.node).repeat(4, cc.tween().to(0.3, {opacity: 128}, null).to(0.3, {opacity: 255}, null))
                .call(()=>{
                    this.ball.canBeCaught = true; 
                })
                cc.tween(this.node).call(()=>{
                    this.ball.canBeCaught = false;
                    this.canMove = false;
                    ballBlink.stop();
                    this.schedule(this.onLiftUp(1),0);
                }).delay(1).call(()=>{
                    if(this.onLiftUp(-1) === null){
                        ballBlink.start();
                        this.canMove = true;
                    }
                }).start();
                break;
        }
    }
    onLiftUp = (()=>{
        var count = 0;
        var func = ()=>{
            this.moveBy(4);
        }
        return (num)=>{
            count += num;
            if(count <= 0){
                this.unschedule(func);
                return null;
            }
            return func;
        }
    })()
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
        this.lastLineLabel.string = this.sd.score+'m';
        this.bestLineLabel.string = this.sd.bestScore+'m';
    }
    /*
        progress in game
    */
    resetProgress(){
        this.minorChecks = this.midChecks = this.majorChecks = 1;
        this.funcInvokeData = {
            default: {name: '', count: 0}
        }
    }
    minorChecks = 1; midChecks = 1; majorChecks = 1;

    progressChecker(){
        if(this.score >= 1000*this.majorChecks){
            this.onMajorCheck();
            this.majorChecks++;
            this.midChecks++;
            this.minorChecks++;
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
            if(r < 0.3){
                invoked = this.funcInvokeLimiter(()=>{this.speedUp(20)}, 'speedUp20',2);
            }else if(r < 0.6){
                invoked = this.funcInvokeLimiter(()=>{this.speedUp(10)}, 'speedUp10',2);
            }else{
                invoked = this.funcInvokeLimiter(this.fieldsRevealNewPowerUp, 'revealPowerup',2);
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
            if(r < 0.8){
                invoked = this.funcInvokeLimiter(this.fieldsRevealNewHoles, 'revealHole',2);
            }else{
                // invoked = this.funcInvokeLimiter(()=>{
                    
                // }, '',2);
                break;
            }
        }while(!invoked);
    }
    fieldsFillRateUp(){
        let r, dr;
        let invoked = false;
        do{
            r = Math.floor(Math.random()*this.holeFields.length);
            dr = Math.random()*0.08;
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
    fieldsRevealNewPowerUp(){
        let r;
        let invoked = false;
        do{
            r = Math.floor(Math.random()*this.holeFields.length);
            invoked = this.funcInvokeLimiter(()=>{
                this.holeFields[r].revealNextPowerUp();
            }, 'holeFieldRevealPowerup'+r, 2, 'holeFieldsPowerups');
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
                f.call(this);
                d.count++;
            }else{
                return false;
            }
        }else{
            f.call(this);
            d.name = name;
            d.count = 1;
        }
        return true;
    }
}