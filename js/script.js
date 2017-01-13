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



(function () { //初始化
	if (musicSrc.length>=0) {
		changeCurMusicSrc(curMusicIndex);//设置第一个播放的音乐
		changeMusicCover(curMusicIndex);//设置封面
	}
	audio.loop = true;//初始化为单曲循环方式
	playedTime = 0;
})();



musicList.hide();//隐藏歌曲列表


prev.on('click', function(event) {//上一曲
	event.preventDefault();
	curMusicIndex--;
	if (curMusicIndex<0) {
		curMusicIndex = musicNames.length-1;
	}
	
	processDot.css('left', 0 + '%');
	playMusicByIndex(curMusicIndex);
	playMusic();
});

next.on('click', function(event) {//下一曲
	event.preventDefault();
	curMusicIndex++;
	if (curMusicIndex>=musicNames.length) {
		curMusicIndex = 0;
	}
	processDot.css('left', 0 + '%');
	playMusicByIndex(curMusicIndex);
	playMusic();
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

volumeBtn.on("click",function (){
	if (audio.muted) {
		console.log("当前是静音,打开声音");
		audio.muted = false;//打开声音
		volumeBtn.addClass('icon-shengyin');
		volumeBtn.removeClass('icon-jingyin');
	}else{
		console.log("当前不是静音,关闭声音");
		audio.muted = true;//关闭声音
		volumeBtn.addClass('icon-jingyin');
		volumeBtn.removeClass('icon-shengyin');
	}
});

dragDot();

function dragDot(){
	var proDot = $(".dot");//获取到进度条的dot
	var volDot = $(".dot-volume");//获取到音量的dot
	var pro = document.getElementById('pro');
	var proX = getLeft(pro);//进度条的横坐标
	var proWidth = $(pro).width();//进度条的宽
	var curTime;
	proDot.on('mousedown',function(event) {//鼠标按下时
		event.preventDefault();
		if (!event) {event = window.event;}
		document.onmousemove=function(event) {
			event.preventDefault();
			if (!event) {event = window.event}
			var posX = event.clientX;//鼠标在屏幕上的坐标
			event = window.event;
			posX = event.clientX;
			curTime = moveDot(proX,proX+proWidth,posX-6);
			audio.currentTime = curTime*audio.duration/100;
		};
		$(document).on('mouseup',function(event) {
			event.preventDefault();
			document.onmousemove = null;
			audio.play();
			playStatu = 1;
			changePlayIcon();
		});
	});

	pro.onclick = function (event){
		event.preventDefault();
		if (!event) {event = window.event}
		var posX = event.clientX;//鼠标在屏幕上的坐标
		curTime = moveDot(proX,proX+proWidth,posX-6);
		audio.currentTime = curTime*audio.duration/100;
		audio.play();
		playStatu = 1;
		changePlayIcon();
	}
}

function getLeft(e){//获取元素的横坐标
    var offset=e.offsetLeft;
    if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
    return offset;
}

function moveDot (left,right,X) {//移动点 传入进度条的左右坐标  鼠标目前坐标
	var rate = 0; //鼠标在进度条位置的百分比
	if (X>right) {
		rate = 98;
	}else if(X<left){
		rate = 0;
	}else{
		rate = (X-left)/(right-left)*100;
	}
	processDot.css('left', rate>98? 98:rate + '%');
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

function processDotGo(){//传入音乐总时长
	if (processDotTimer) {
		clearInterval(processDotTimer);
	}
	var dur = Math.round(audio.duration);
	playedTime = audio.currentTime;
	var processRate = (playedTime/dur)*100;
	processDotTimer = setInterval(function () {
		playedTime=audio.currentTime;
		processRate = (playedTime/dur)*100;
		processDot.css('left', processRate>98.5? 98.5:processRate + '%');
		if (audio.ended) {
			if (!audio.loop) {clearInterval(processDotTimer);}
			processDot.css('left', 0 + '%');
			playedTime = 0;
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

function playMusicByIndex (index) {//传入当前播放音乐的索引
	changePanelTitle(index);//改变标题
	changeMusicCover(index);
	changeCurMusicSrc(index);
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
