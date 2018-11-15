var Role = (function(_super){
    function Role(){
        Role.super(this);
        // this.init();
    }
    Role.cache = false;
    Laya.class(Role,"Role",_super);
    var _proto = Role.prototype;
    _proto.init = function(){
        //角色是否死亡，主要判断英雄
        this.dead = false;
        //角色的血量
        this.MAXHP = 10;
        this.hp = this.MAXHP;
        //角色的下落速度
        this.speed = 5;
        //创作图集动画
        if(!Role.cache){
            Role.cache = true;
            //创建奔跑突击动画
            Laya.Animation.createFrames(["comp/hero_run1.png","comp/hero_run2.png","comp/hero_run3.png",
                                            "comp/hero_run4.png","comp/hero_run5.png","comp/hero_run6.png"],"hero_run_right");
            Laya.Animation.createFrames(["comp/hero_run7.png","comp/hero_run8.png","comp/hero_run9.png",
                                            "comp/hero_run10.png","comp/hero_run11.png","comp/hero_run12.png"],"hero_run_left");
            //停止
            Laya.Animation.createFrames(["comp/hero_stay.png"],"hero_stay");
        }
        if(!this.body){
            this.body = new Laya.Animation();
            this.addChild(this.body);
            this.body.on(Laya.Event.COMPLETE,this,this.onPlayComplete);
        }
        this.playAction("stay");
    }

    _proto.onPlayComplete = function(){
        this.playAction("stay")
    }

    _proto.hpAdd = function(num){
        if(this.hp + num <= this.MAXHP){
            this.hp += num;
        }
        else{
            this.hp = this.MAXHP;
        }
    }

    _proto.hpSub = function(num){
        if(this.hp - num >= 0){
            this.hp -= num;
        }
        else{
            this.hp = 0;
            this.dead = true;
        }
    }

    _proto.fall = function(){
        this.y += this.speed;
    }

    _proto.moveLeft = function(num){
        if(this.x - 1 >= 55){
            this.x -= num;
        }
    }

    _proto.moveRight = function(num){
        if(this.x + 1 <= stageWidth-55){
            this.x += num;
        }
    }

    _proto.playAction = function(act){
        // this.action = action;
        this.body.play(0,true,"hero_"+ act);
        this.bound = this.body.getBounds();
        this.body.pos(-this.bound.width/2,-this.bound.height/2);
    }
    return Role;
})(Laya.Sprite);