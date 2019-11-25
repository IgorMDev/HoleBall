
const {ccclass, property, executeInEditMode} = cc._decorator;
const linGradDir = cc.Enum({Horizontal: 0, Vertical: 1});
@ccclass
@executeInEditMode
export default class LinearGradientBg extends cc.Component {
    @property([cc.Color])
    colors: cc.Color[] = [cc.Color.WHITE, cc.Color.WHITE];
    @property({type: linGradDir})
    dir = linGradDir.Horizontal;

    sprite: cc.Sprite = null;
    tex: cc.Texture2D = null;
    pixFormat = cc.Texture2D.PixelFormat.RGBA8888;
    onLoad () {
        this.sprite = this.getComponent(cc.Sprite);
        //this.tex = this.sprite.spriteFrame.getTexture();
        this.tex = new cc.Texture2D();
        this.sprite.spriteFrame.setTexture(this.tex);
    }
    start(){
        this.setColors(...this.colors);
    }
    onFocusInEditor(){
        this.setColors(...this.colors);
    }
    setColors(...cs: cc.Color[]){
        this.colors = cs;
        let cdata = new Uint8Array(cs.reduce((acc, c)=> acc.concat([c.getR(), c.getG(), c.getB(), c.getA()]), []));
        switch(this.dir){
            case linGradDir.Horizontal:
                this.tex.initWithData(cdata, this.pixFormat, cs.length, 1);
                break;
            case linGradDir.Vertical:
                this.tex.initWithData(cdata, this.pixFormat, 1, cs.length);
                break;
        }
        
    }
    
    
}

declare global{
    enum linGradDir{
        Horizontal, Vertical
    }
}