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
var MusicDuration;//音乐播放时长
var processDotTimer; //进度条的时间函数
var playedTime,leftTime;//当前音乐播放了多长时间  还剩多长时间



(function () { //初始化
	if (musicSrc.length>=0) {
		changeCurMusicSrc(curMusicIndex);//设置第一个播放的音乐
		changeMusicCover(curMusicIndex);//设置封面
	}
	audio.loop = true;//初始化为单曲循环方式
	playedTime=0,leftTime=0;
})();



musicList.hide();//隐藏歌曲列表


prev.on('click', function(event) {//上一曲
	event.preventDefault();
	curMusicIndex--;
	if (curMusicIndex<0) {
		curMusicIndex = musicNames.length-1;
	}
	playMusicByIndex(curMusicIndex);
});

next.on('click', function(event) {//下一曲
	event.preventDefault();
	curMusicIndex++;
	if (curMusicIndex>=musicNames.length) {
		curMusicIndex = 0;
	}
	playMusicByIndex(curMusicIndex);
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
		playMusic();
	}else{
		pauseMusic();
	}
});


function playMusic(){//当一个音乐播放的时候需要干的事情
	audio.play(); //播放音乐
	playStatu = 1;//设置当前状态为-->播放
	changePlayIcon();//改变播放和暂停的图标
	changePanelTitle();//改变面板的标题
	MusicDuration = audio.duration;//获取当前音乐的时长
	processDotGo(MusicDuration);
}

function pauseMusic(){//当一个音乐暂停的时候需要干的事情
	audio.pause();
	playStatu = 0;//设置当前状态为-->暂停
	changePlayIcon();//改变播放和暂停的图标
	changePanelTitle();//改变面板的标题
	clearInterval(processDotTimer);
}

function processDotGo(dur){//传入音乐总时长
	var processDot = $(".dot");
	var processRate = (playedTime/dur)*98;
	processDotTimer = setInterval(function () {
		processDot.css('left', processRate + '%');
		console.log(processRate+'%');
		playedTime+=0.5;
		leftTime-=0.5;
		if (playedTime>dur) {playedTime = dur;}
		if (leftTime<0) {leftTime = 0;}
		if (leftTime==0) {
			if (!audio.loop) {clearInterval(processDotTimer);}
			processDot.css('left', 0 + '%');
			playedTime = 0;
			leftTime = MusicDuration;
		}
		processRate = (playedTime/dur)*98;
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
	console.log(index);
	changePanelTitle(index);//改变标题
	changeMusicCover(index);
	changeCurMusicSrc(index);
	if (playStatu) {
		playMusic();
	}
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
