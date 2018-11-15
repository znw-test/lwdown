var Board = (function(_super){
    function Board(){
        Board.super(this);
    }
    Board.cache = false;
    Laya.class(Board,"Board",_super);
    var _proto = Board.prototype;
    _proto.init = function(_type,_speed){
        //板子的速度
        this.speed = _speed;
        //板子的种类
        this.type = _type;
        //一次性效果标记
        this.done = false;
        //板子的名字
        switch (_type) {
            case 0:
                this.name = "boardNormal";
                break;
            case 1:
                this.name = "boardPrickly";
                break;
            case 2:
                this.name = "boardFragile";
                break;
            case 3:
                this.name = "boardLeft";
                break;
            case 4:
                this.name = "boardRight";
                break;
            default:
                this.name = "boardNormal"
                break;
        }

        if(!Board.cache){
            Board.cache = true;
            Laya.Animation.createFrames(["comp/boardNormal.png"],"boardNormal_stay");
            Laya.Animation.createFrames(["comp/boardPrickly.png"],"boardPrickly_stay");
            Laya.Animation.createFrames(["comp/boardFragile1.png"],"boardFragile_stay");
            Laya.Animation.createFrames(["comp/boardFragile2.png","comp/boardFragile3.png","comp/boardFragile4.png"],"boardFragile_down");
            Laya.Animation.createFrames(["comp/boardLeft.png"],"boardLeft_stay");
            Laya.Animation.createFrames(["comp/boardRight.png"],"boardRight_stay");
        }
        if(!this.body){
            this.body = new Laya.Animation();
            this.addChild(this.body);
            this.body.on(Laya.Event.COMPLETE,this,this.onPlayComplete);
        }
        this.playAction("stay");
    }

    _proto.doEffect = function(target){
        if(this.done){
            return null;
        }
        switch (this.type) {
            //boardNormal
            case 0:
                target.hpAdd(1);
                Laya.SoundManager.playSound("sounds/hit0.mp3",1);
                break;
            //boardPrickly
            case 1:
                target.hpSub(3);
                Laya.SoundManager.playSound("sounds/hit1.mp3",1);
                break;
            //boardFragile
            case 2:
                target.hpAdd(1);
                Laya.SoundManager.playSound("sounds/hit0.mp3",1);
                this.playAction("down");
                break;
            //boardLeft
            case 3:
                target.hpAdd(1);
                Laya.timer.loop(10,target,target.moveLeft,[2]);
                break;
            //boardRight
            case 4:
                target.hpAdd(1);
                Laya.timer.loop(10,target,target.moveRight,[2]);
                break;
            default:
                break;
        }
        this.done = true;
    }


    _proto.onPlayComplete = function(){
        if(this.action === "down"){
            this.body.stop();
            this.visible = false;
        }
        else{
            this.playAction("stay");
        }

    }
    _proto.playAction = function(act){
        this.action = act;
        this.body.play(0,true,this.name+"_"+act);
        this.bound = this.body.getBounds();
        this.body.pos(-this.bound.width/2,-this.bound.height/2);
    }
    return Board;
})(Laya.Sprite);