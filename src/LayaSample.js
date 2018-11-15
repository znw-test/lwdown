var WebGL = laya.webgl.WebGL;

var stageWidth = 480;
var stageHeight = 800
Laya.MiniAdpter.init();
Laya.init(stageWidth, stageHeight, WebGL);
Laya.stage.scaleMode = "showall";

Laya.loader.load("res/atlas/comp.atlas",Laya.Handler.create(this,onLoad),null,Laya.Loader.ATLAS);

function onLoad(){
    //加载边框背景
    var bg = new Laya.Sprite();
    bg.loadImage("comp/lwdownbg.png");
    Laya.stage.addChild(bg);

    //加载UI背景
    this.gameInfo = new GameInfo();
    this.level = 1;
    Laya.stage.addChild(this.gameInfo);

    //显示hp
    this.hpInfo = new Laya.Sprite();
    this.hpInfo.pos(80,10);
    Laya.stage.addChild(this.hpInfo);
    this.hpInfo.loadImage("comp/hp10.png");
    //放弃物理引擎
    console.log("Game Start");

    //放置芦苇
    this.luwei = new Role();
    //增加层级
    this.boardBox = new Laya.Sprite();
    Laya.stage.addChild(this.boardBox);

}

//2018年11月14日 用Layabox官方循环重写鼠标与键盘移动
//鼠标按压控制芦苇跑动
function onMouseDown(){
    if(Laya.stage.mouseX < stageWidth/2){
        Laya.timer.loop(10,this,runLeft);
    }
    else{
        Laya.timer.loop(10,this,runRight);
    }
}
//清除定时器
function onMouseUp(){
    Laya.timer.clear(this,runLeft);
    Laya.timer.clear(this,runRight);
}
// 往左右跑
// TODO：位移与动画分离
function runLeft(){
    this.luwei.playAction("run_left");
    if(this.luwei.x - 1 >= 55){
        this.luwei.x -= 7;
    }
}
function runRight(){
    this.luwei.playAction("run_right");
    if(this.luwei.x + 1 <= stageWidth-55){
        this.luwei.x += 7;
    }
}
//键盘响应
function onKeyDown(e){
    //按下左键
    if(e["keyCode"] == 37){
        Laya.timer.loop(10,this,runLeft);
    }
    //按下右键
    else if(e["keyCode"] == 39){
        Laya.timer.loop(10,this,runRight);
    }
}

function onLoop(){
    this.isFall = true;
    showHp(this.luwei.hp);
    //TODO:难度分级，简单普通困难三模式
    //30帧一个板
    if(Laya.timer.currFrame % this.createBoardInterval === 0){
        createBoard();
    }
    //150帧下一层
    if(Laya.timer.currFrame % 150 === 0){
        this.level += 1;
        this.gameInfo.level(this.level);
    }
    //检测碰撞
    //芦苇下落
    
    for(var i = this.boardBox.numChildren-1;i>-1;i--){
        var board = this.boardBox.getChildAt(i);
        board.y += board.speed;
        if(!this.luwei.dead && Math.abs(this.luwei.x-board.x) <= (this.luwei.bound.width/2 + board.bound.width/2) && 
            Math.abs(this.luwei.y-board.y) <= (this.luwei.bound.height/2 + board.bound.height/2)){
                board.doEffect(this.luwei);
                this.isFall = false;
                this.luwei.y = board.y - 40;
            }
        if(board.y <= 60 || !board.visible){
            board.removeSelf();
            board.visible = true;
            Laya.Pool.recover("board",board);
        }
    }
    if(this.isFall){
        this.luwei.fall();
        Laya.timer.clearAll(this.luwei);
        this.firstIn = true;
    }
    if(this.luwei.y <= 90){
        this.luwei.y += 100;
        this.luwei.hpSub(5);
        Laya.SoundManager.playSound("sounds/hit2.mp3",1);
    }
    if(this.luwei.y > 850){
        resetDatas();
        Laya.timer.clear(this,onLoop);
        this.gameInfo.reset();
    }
}

//创建板，x随机,y坐标固定
function createBoard(){
    var r = Math.random();
    var board = Laya.Pool.getItemByClass("board",Board);
    board.init(parseInt(Math.random() * 5),this.boardSpeed);
    board.pos((r * (stageWidth-160))+80,stageHeight + 80);
    this.boardBox.addChild(board);
}

//用于重新开始游戏
function startGame(nandu){
    //难度判断
    switch (nandu) {
        case "EASY":
            this.createBoardInterval = 40;
            this.boardSpeed = -3;
            break;
        case "NORMAL":
            this.createBoardInterval = 45;
            this.boardSpeed = -4;
            break;
        case "HARD":
            this.createBoardInterval = 50;
            this.boardSpeed = -5;
            break;
        default:
            this.createBoardInterval = 30;
            this.boardSpeed = -3
            break;
    }
    //重置数据
    resetDatas();
    //重新开始
    this.luwei.init();
    this.luwei.pos(240, 700);
    Laya.stage.addChild(this.luwei);

    //开始之板
    var board1 = new Board();
    board1.init(0,this.boardSpeed);
    board1.pos(240,760);
    this.boardBox.addChild(board1);

    Laya.stage.on(Laya.Event.MOUSE_DOWN,this,onMouseDown);
    Laya.stage.on(Laya.Event.MOUSE_UP,this,onMouseUp);
    Laya.stage.on(Laya.Event.KEY_DOWN,this,onKeyDown);
    Laya.stage.on(Laya.Event.KEY_UP,this,onMouseUp);

    Laya.timer.frameLoop(1,this,onLoop);
}

//重置数据
function resetDatas(){
    //flag 用来标记是否在下落
    this.isFall = false;

    //移除旧板
    for(var i = this.boardBox.numChildren-1;i>-1;i--){
        var board = this.boardBox.getChildAt(i);
        board.removeSelf();
        board.visible = true;
        Laya.Pool.recover("board",board);
    }
    //等级
    this.level = 1;
}

//显示血量
function showHp(h){
        h = h < 11 ? h : 10;
        this.hpInfo.scale(h/10,1); 
}