import HoleSpawner from "./HoleSpawner";
import Hole from "./Hole";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EndlessMode extends cc.Component {
    @property(HoleSpawner)
    holeSpawners: HoleSpawner[] = [];
    @property(cc.Prefab)
    holePrefabs: cc.Prefab[] = [];

    pool: Hole[][] = [];
    poolInd: number[] = [];
    holeProb: number[] = [];
    level = 1;
    numOfVariants = 1;
    score = 0;
    onLoad () {
        for(let i in this.holePrefabs){
            this.pool.push([]);
            this.poolInd.push(0);
            this.holeProb.push(this.holePrefabs[i].data.getComponent(Hole).spawnProbability);
        }

    }
    start () {

    }

    // update (dt) {}
    
    onLevelUp(){
        this.numOfVariants = this.holePrefabs.length <= this.level ? this.holePrefabs.length : this.level;
    }
    getHoleSample(){
        if(this.numOfVariants > 1){
            var i = 0;
            do{
                var rp = Math.random();
                var rhv = Math.floor(Math.random()*this.numOfVariants);

            }while(i++ < 2 && rp > this.holeProb[rhv]);
        }
    }
}