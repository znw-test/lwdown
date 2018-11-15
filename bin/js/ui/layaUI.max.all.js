var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var GameInfoUI=(function(_super){
		function GameInfoUI(){
			
		    this.levelLabel=null;
		    this.easyStartLabel=null;
		    this.normalStartLabel=null;
		    this.hardStartLabel=null;

			GameInfoUI.__super.call(this);
		}

		CLASS$(GameInfoUI,'ui.GameInfoUI',_super);
		var __proto__=GameInfoUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(GameInfoUI.uiView);

		}

		GameInfoUI.uiView={"type":"View","props":{"width":480,"height":800},"child":[{"type":"Label","props":{"y":220,"x":120,"width":240,"var":"levelLabel","text":"1","styleSkin":"comp/label.png","height":59,"fontSize":50,"color":"#ffffff","alpha":0.5,"align":"center"}},{"type":"Label","props":{"y":300,"x":120,"width":240,"text":"LUWEI DOWN","styleSkin":"comp/label.png","height":76,"fontSize":30,"color":"#ffffff","alpha":0.5,"align":"center"}},{"type":"Image","props":{"y":500,"x":100,"skin":"comp/left.png","alpha":0.5}},{"type":"Image","props":{"y":500,"x":280,"skin":"comp/right.png","alpha":0.5}},{"type":"Label","props":{"y":6,"x":58,"width":26,"text":"hp[","styleSkin":"comp/label.png","height":18,"fontSize":15,"color":"#ffffff"}},{"type":"Label","props":{"y":5,"x":183,"width":26,"text":"]","styleSkin":"comp/label.png","height":18,"fontSize":15,"color":"#ffffff"}},{"type":"Label","props":{"y":136,"x":120,"width":240,"text":"Powered by LayaBox and Adnmb\\nMade by Zhunw","styleSkin":"comp/label.png","height":49,"fontSize":15,"color":"#ffffff","alpha":0.5,"align":"center"}},{"type":"Label","props":{"y":338,"x":120,"width":240,"var":"easyStartLabel","text":"开始游戏（简单）","styleSkin":"comp/label.png","height":39,"fontSize":30,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":393,"x":120,"width":240,"var":"normalStartLabel","text":"开始游戏（中等）","styleSkin":"comp/label.png","height":39,"fontSize":30,"color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":451,"x":120,"width":240,"var":"hardStartLabel","text":"开始游戏（困难）","styleSkin":"comp/label.png","height":39,"fontSize":30,"color":"#ffffff","align":"center"}}]};
		return GameInfoUI;
	})(View);