import BallSpawner from "./BallSpawner";
import Ball from "./Ball";
import PlatformBlock from "./Block";
import Level from "./Level";
import Game from "./Game";
import Accelerator from "./Accelerator";
import KeyboardInput from "./KeyboardInput";
import Gameplay from "./Gameplay";
import ArenaUI from "./UI/ArenaUI";
import Arena from "./Arena";

const {ccclass, property, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@executionOrder(-10)
@disallowMultiple
export default class LevelsArena extends Arena{
    
    touchVec: cc.Vec2 = cc.Vec2.ZERO;
    isReady = false;
    //isRun = false;
    //saveData = Game.instance.saveData;
    onLoad () {
        
        
    }
    start () {
        
    }
    
}

