var audio = $("audio")[0]
console.log(audio)
audio.autoplay = false
audio.play()
setTimeout(function () {
	audio.pause()
},3000)