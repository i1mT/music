<?php 
	$musicHost = "music/"; //音乐文件所在的路径
	$musicImgHost = "images/music-img/"; //音乐对应图片所在路径
	$musicNames = scandir($musicHost);//获得音乐名
	$musicImgNames = scandir($musicImgHost);//获得所有图片名字
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<title>音乐播放器-By iimT</title>
	<link rel="stylesheet" type="text/css" href="css/iconfont.css">
	<link rel="stylesheet" href="css/main.css">
	<script src="js/jquery-3.1.1.js"></script>
	<script src="js/jquery-3.1.1.min.js"></script>
</head>
<body>
	<img src="images/background.jpg" class="bg">
	<div class="panel">
		<div class="panel-title">音乐播放器 - By iimT</div>
		<div class="volume">
			<i class="iconfont icon-shengyin"></i>
			<div class="volume-line">
				<span class="dot-volume"></span>
			</div>
		</div>
		<div class="song-img">
			<img src="images/default-song-img.jpg" alt="">
		</div>
		<div class="progress-bar">
			<span class="dot"></span>
		</div>
		<div class="footer">
			<button id="loop" class="iconfont icon-danquxunhuan"></button>
			<button id="after" class="iconfont icon-kuaitui"></button>
			<button id="play" class="iconfont icon-bofang"></button>
			<button id="before" class="iconfont icon-kuaijin"></button>
			<button id="playList" class="iconfont icon-liebiao"></button>
		</div>
	</div>
	<audio src="music/Kelly Clarkson - Catch My Breath.mp3" preload>
		<?php 
			for($i=1;$i<=5;$i++){ 
		?> 
			<source id="<?php echo $i; ?>" title="名字" data-img="封面" src="地址">
		<?php
			}
		?>
	</audio>
</body>
	<script src="js/script.js"></script>
</html>