/*
*音乐播放器***
*作者-iimT
*博客www.iimt.me
*2017.1.10
*/
var audio = $("audio")[0];
var playStatu = 0;//初始状态未播放
var play = $("#play");
play.on('click',function(event) {
	event.preventDefault();
	if (!playStatu) {
		audio.play();
		playStatu = 1;
	}else{
		audio.pause();
		playStatu = 0;
	}
	changePlayIcon(playStatu);
});



function changePlayIcon (a) {//更改播放与暂停按钮
	if (a) {//正在播放
		play.removeClass('icon-bofang');
		play.addClass('icon-zanting');
	}else{
		play.removeClass('icon-zanting');
		play.addClass('icon-bofang');
	}
}



