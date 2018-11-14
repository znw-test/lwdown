var WebGL = laya.webgl.WebGL;

var stageWidth = 480;
var stageHeight = 800
Laya.MiniAdpter.init();
Laya.init(stageWidth, stageHeight, WebGL);
Laya.stage.scaleMode = "showall";

var engine;

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
    //flag 用来标记是否第一次落进板快
    this.firstIn = true;
    this.isFall = false;
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
        this.luwei.x -= 4;
    }
}
function runRight(){
    this.luwei.playAction("run_right");
    if(this.luwei.x + 1 <= stageWidth-55){
        this.luwei.x += 4;
    }
}
//增加板左移右移
// function moveLeft(){
//     this.luwei.x -= 2;
// }
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
    //30帧一个板
    if(Laya.timer.currFrame % 30 === 0){
        createBoard();
    }
    //150帧下一层
    if(Laya.timer.currFrame % 150 === 0){
        this.level += 1;
        this.gameInfo.level(this.level);
    }
    // if(this.luwei.hp <= 0){
    //     this.luwei.dead = true;
    // }
    //检测碰撞
    // this.luwei.y += this.luwei.speed;
    //芦苇下落
    this.luwei.fall();
    for(var i = this.boardBox.numChildren-1;i>-1;i--){
        var board = this.boardBox.getChildAt(i);
        board.y += board.speed;
        if(!this.luwei.dead && Math.abs(this.luwei.x-board.x) <= (this.luwei.bound.width/2 + board.bound.width/2) && 
            Math.abs(this.luwei.y-board.y) <= (this.luwei.bound.height/2 + board.bound.height/2)){
                // if(this.firstIn){
                //     this.firstIn = false;
                //     board.doEffect(this.luwei);
                //     // switch (board.type) {
                //     //     case 0:
                //     //         this.luwei.hpAdd(1);
                //     //         Laya.SoundManager.playSound("sounds/hit0.mp3",1);
                //     //         break;
                //     //     case 1:
                //     //         this.luwei.hpSub(3);
                //     //         Laya.SoundManager.playSound("sounds/hit1.mp3",1);
                //     //         // Laya.timer.loop(10,this.luwei,runLeft,2);
                //     //         break;
                //     //     case 2:
                //     //         this.luwei.hpAdd(1);
                //     //         Laya.SoundManager.playSound("sounds/hit0.mp3",1);
                //     //         board.playAction("down");
                //     //         break;
                //     //     case 3:
                //     //         this.luwei.hpAdd(1);

                //     //     default:
                //     //         break;
                //     // }
                    
                    
                // }
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
        Laya.timer.clearAll(this.luwei);
        this.firstIn = true;
    }
    if(this.luwei.y <= 90){
        this.luwei.y += 100;
        this.luwei.hpSub(5);
        Laya.SoundManager.playSound("sounds/hit2.mp3",1);
    }
    if(this.luwei.y > 850){
        // this.luwei.dead = true;
        resetDatas();
        Laya.timer.clear(this,onLoop);
        this.gameInfo.reset();

    }
}

//创建板，x随机,y坐标固定
function createBoard(){
    var r = Math.random();
    var board = Laya.Pool.getItemByClass("board",Board);
    board.init(parseInt(Math.random() * 5));
    board.pos((r * (stageWidth-160))+80,stageHeight + 80);
    this.boardBox.addChild(board);
}

//用于重新开始游戏
function startGame(){
    //移除旧板
    resetDatas();
    //重新开始
    this.luwei.init();
    this.luwei.pos(240, 700);
    Laya.stage.addChild(this.luwei);

    //开始之板
    var board1 = new Board();
    board1.init(0);
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