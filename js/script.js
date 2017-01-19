/*
*音乐播放器***
*作者-iimT
*博客www.iimt.me
*2017.1.10
*/
var audio = $("audio")[0];
var playStatu = 0;//初始状态未播放
var play = $("#play");//播放暂停按钮
var ListTog = $("#playList");//音乐列表按钮
var prev = $("#after"); //上一曲
var next = $("#before");//下一曲
var loopMethod = $("#loop");//循环按钮
var musicList = $(".List");//音乐列表
var musicListItems = musicList.find('ul li'); //List下的所有li
var panelTitle = $(".panel-title");
var musicSrc = []; //音乐文件的路径
var musicImgSrc = [];  //音乐对应头像的路径
var musicNames = []; //音乐名称
getMusicAllSrc();  //获取上面三项
var songCover = $(".song-img img");
var curMusicIndex = 0;
var processDotTimer; //进度条的时间函数
var playedTime;//当前音乐播放了多长时间
var processDot = $(".dot");
var volumeBtn = $(".icon-shengyin");//音量按钮
var volNum = 1;//设置音量
var volDot = $(".dot-volume");//音量的dot
var ListItems = $(".List ul li");



(function () { //初始化
	if (musicSrc.length>=0) {
		changeCurMusicSrc(curMusicIndex);//设置第一个播放的音乐
		changeMusicCover(curMusicIndex);//设置封面
	}
	audio.loop = true;//初始化为单曲循环方式
	audio.volume = volNum;
	playedTime = 0;
})();



musicList.hide();//隐藏歌曲列表


prev.on('click',function (event) {
	event.preventDefault();
	playPrev();
});

next.on('click',function (event) {
	event.preventDefault();
	playNext();
});

ListTog.on('click', function(event) {//列表按钮-->显示与隐藏
	event.preventDefault();
	if (musicList.is(':hidden')) {
		musicList.show();
	}else{
		musicList.hide();
	}
});

play.on('click',function(event) {//播放按钮-->播放与暂停
	event.preventDefault();
	playMusicByIndex(curMusicIndex);
	if (!playStatu) {
		audio.play();
		playStatu = 1;
		processDotGo();
	}else{
		audio.pause();
		playStatu = 0;
		clearInterval(processDotTimer);
	}
	changePlayIcon();//改变播放和暂停的图标
	changePanelTitle();//改变面板的标题
});

loopMethod.on('click',function(event) {
	event.preventDefault();
 	if (audio.loop) {//如果当前是单曲循环模式
 		audio.loop = false;//关闭单曲循环
 		classTog('icon-shuaxin','icon-danquxunhuan',loopMethod);
 	}else {
 		audio.loop = true;//开启单曲循环
 		classTog('icon-danquxunhuan','icon-shuaxin',loopMethod);
 	}
});

volumeBtn.on("click",function (){
	if (volNum==0) {
		volNum = 1;//打开声音
		classTog('icon-shengyin','icon-jingyin',volumeBtn);
	}else{
		volNum = 0;//关闭声音
		classTog('icon-jingyin','icon-shengyin',volumeBtn);
	}
	audio.volume = volNum;
	volDot.css('left', volNum*100 +'%');
});

ListItems.on('click',function (event) {
	event.preventDefault();
	curMusicIndex = $(this).attr('index');//更改播放的音乐索引
	playMusicByIndex(curMusicIndex);
	playMusic();
})


dragDot();//添加进度条 音量条事件监听

function classTog (addCls,delCls,obj) {//对应对象切换cls
	obj.addClass(addCls);
	obj.removeClass(delCls);
}

function dragDot(){//音乐进度条和音量托条事件绑定

	var proDot = $(".dot");//获取到进度条的dot
	var MusicPro = document.getElementById('pro');//蓝色进度条
	var proX = getLeft(MusicPro);//进度条的横坐标
	var proWidth = $(MusicPro).width();//进度条的宽
	var curTime;
	proDot.on('mousedown',function(event) {//音乐进度条拖动点 绑定鼠标按下时事件
		event.preventDefault();
		if (!event) {event = window.event;}
		document.onmousemove=function(event) {//必须要用原生js绑定是因为后面有document.onmousemove = null;
			event.preventDefault();
			if (!event) {event = window.event}
			var posX = event.clientX;//鼠标在屏幕上的坐标
			event = window.event;
			posX = event.clientX;
			curTime = moveDot(proX,proX+proWidth,posX-6,proDot,98);
			audio.currentTime = curTime*audio.duration/98;
		};
		$(document).on('mouseup',function(event) {//当点击拖动点时，对全局监听鼠标移动事件并设置对应的dot位置
			event.preventDefault();
			document.onmousemove = null;
			audio.play();
			playStatu = 1;
			changePlayIcon();
		});
	});

	MusicPro.onclick = function (event){//点击蓝色进度条事件
		event.preventDefault();
		if (!event) {event = window.event}
		var posX = event.clientX;//鼠标在屏幕上的坐标
		curTime = moveDot(proX,proX+proWidth,posX,proDot,98);
		audio.currentTime = curTime*audio.duration/98;
		audio.play();
		playStatu = 1;
		changePlayIcon();
		processDotGo();
	};


	//  ↑↑↑音乐进度条事件绑定 ------- ↓↓↓音量条事件绑定


	var volPro = document.getElementById('vol');//音量条
	var volX = getLeft(volPro);//音量条的横坐标
	var volWidth = $(volPro).width();//音量条的宽度
	volDot.on('mousedown',function(event) {
		event.preventDefault();
		if (!event) {event = window.event;}
		document.onmousemove = function (event){//当鼠标按下音量拖动点之后开启全局鼠标移动监听事件
			event.preventDefault();
			if (!event) {event = window.event;}
			var posX = event.clientX;//鼠标在屏幕上的坐标
			volNum = moveDot(volX,volX+volWidth,posX,volDot,1);
			audio.volume = volNum;
		}
		$(document).on('mouseup',function (event) {//鼠标放开之后删除全局鼠标移动监听事件
			event.preventDefault();
			document.onmousemove = null;
		});

	});
	volPro.onclick = function (event) {
		event.preventDefault();
		if (!event) {event = window.event;}
		var posX = event.clientX;
		volNum = moveDot(volX,volX+volWidth,posX-6,volDot,1);
		audio.volume = volNum;
	};
}

function getLeft(e){//获取元素的横坐标
    var offset=e.offsetLeft;
    if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
    return offset;
}

function moveDot (left,right,X,obj,base) {//移动点 条的左右坐标  鼠标目前横坐标  点对象  基于98还是100
	var rate = 0; //鼠标在进度条位置的百分比
	if (X>right) {
		rate = base;
	}else if(X<left){
		rate = 0;
	}else{
		rate = (X-left)/(right-left)*base;
	}
	if (base==1) {
		if (!rate) {//拖到静音的时候
			classTog('icon-jingyin','icon-shengyin',volumeBtn);
		}else{
			classTog('icon-shengyin','icon-jingyin',volumeBtn);
		}
		obj.css('left', rate*100 +'%');
	}else{
	obj.css('left', rate+'%');		
	}
	return rate;
}


function playMusic(){//当一个音乐播放的时候需要干的事情
	audio.play(); //播放音乐
	playStatu = 1;//设置当前状态为-->播放
	changePlayIcon();//改变播放和暂停的图标
	changePanelTitle();//改变面板的标题
	playedTime = 0;
	audio.addEventListener('loadeddata',function () {
		processDotGo();
	});
}

function pauseMusic(){//当一个音乐暂停的时候需要干的事情
	audio.pause();
	playStatu = 0;//设置当前状态为-->暂停
	changePlayIcon();//改变播放和暂停的图标
	clearInterval(processDotTimer);
}

function playPrev() {//播放上一曲
	curMusicIndex--;
	if (curMusicIndex<0) {
		curMusicIndex = musicNames.length-1;
	}
	
	processDot.css('left', 0 + '%');
	playMusicByIndex(curMusicIndex);
	playMusic();
}

function playNext() {//播放下一曲
	curMusicIndex++;
	if (curMusicIndex>=musicNames.length) {
		curMusicIndex = 0;
	}
	processDot.css('left', 0 + '%');
	playMusicByIndex(curMusicIndex);
	playMusic();
}

function processDotGo(){//传入音乐总时长  让进度条开始go!
	if (processDotTimer) {
		clearInterval(processDotTimer);
	}
	var dur = Math.round(audio.duration);
	var cnt=1;
	playedTime = audio.currentTime;
	var processRate = (playedTime/dur)*98;
	processDotTimer = setInterval(function () {
		playedTime=audio.currentTime;
		processRate = (playedTime/dur)*98;
		processDot.css('left', processRate+'%');
		processDot.css('box-shadow', '0 0 3px 0px #fff');
		if (audio.ended) {
			if (!audio.loop) {//如果不是单曲循环模式  就播放下一曲
				playNext();
				clearInterval(processDotTimer);
			}
			processDot.css('left', 0 + '%');
			playedTime = 0;
		}
		//添加小点忽闪忽灭样式
		if (cnt) {
			cnt = 0;
			processDot.css('box-shadow', '0 0 3px 0px #fff');
		}else{
			cnt = 1;
			processDot.css('box-shadow', '0 0 8px 0px #fff');
		}
	},500);
}


function changePlayIcon () {//更改播放与暂停按钮的图标
	if (playStatu) {//正在播放
		play.removeClass('icon-bofang');
		play.addClass('icon-zanting');
	}else{
		play.removeClass('icon-zanting');
		play.addClass('icon-bofang');
	}
}


function  changePanelTitle (index) {//改变面板标题为当前歌曲名  传入当前播放音乐的索引
	var curMusicName = musicNames[curMusicIndex];
	panelTitle.html(curMusicName);
}

function changeMusicCover (index) { //设置音乐的封面
	songCover.attr('src',musicImgSrc[index]);
}

function changeCurMusicSrc (index){//设置音乐路径
	audio.src = musicSrc[index];
}
function changeListItem (index) {//使当前播放音乐在列表中高亮
	ListItems.css({
		color: '#ccc',
		background: 'none'
	});
	$(ListItems[index]).css({
		color: '#eee',
		background: 'rgba(200,200,200,.1)'
	});
}

function playMusicByIndex (index) {//传入当前播放音乐的索引
	changePanelTitle(index);//改变标题
	changeMusicCover(index);
	changeCurMusicSrc(index);
	changeListItem(index);
}

function getMusicAllSrc(){//获取音乐的地址 图片地址  音乐标题
	for (var i = 0; i < musicListItems.length; i++) {
		var Msrc = $(musicListItems[i]).attr('src');
		var ImgSrc = $(musicListItems[i]).attr('data-img');
		var Mtitle = $(musicListItems[i]).html();
		musicSrc.push(Msrc);
		musicImgSrc.push(ImgSrc);
		musicNames.push($.trim(Mtitle));
	}
}
