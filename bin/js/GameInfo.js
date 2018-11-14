//游戏UI文件
var GameInfo = (function(_super){
    function GameInfo(){
        GameInfo.super(this);
        //初始化UI显示
        this.reset();
    }
    //注册类
    Laya.class(GameInfo,"GameInfo",_super);
    var _proto = GameInfo.prototype;
    _proto.reset = function(){
        this.levelLabel.text = "1";
        this.startLabel.text = "开始游戏";
        this.startLabel.once(Laya.Event.CLICK,this,this.onStartClick);
    }
    //显示关卡级别
    _proto.level = function(value){
        this.levelLabel.text = value;
    }
    //开始游戏
    _proto.onStartClick = function(){
        this.startLabel.text = "";
        startGame();
    }
    return GameInfo;
})(ui.GameInfoUI);