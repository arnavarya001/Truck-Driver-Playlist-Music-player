let player;
let isReady = false;
let progressTimer = null;
let currentBgIndex = 0;

// Local truck background images (see assets/images/)
const myBackgroundImages = [
  "assets/images/truck1.jpg",
  "assets/images/truck2.jpg"
];

function setInitialBackground() {
  if (myBackgroundImages.length > 0) {
    document.getElementById("bg-overlay").style.backgroundImage = `url('${myBackgroundImages[0]}')`;
  }
}
setInitialBackground();

function changeBackgroundOnSongChange() {
  if (myBackgroundImages.length === 0) return;
  currentBgIndex = (currentBgIndex + 1) % myBackgroundImages.length;
  document.getElementById("bg-overlay").style.backgroundImage = `url('${myBackgroundImages[currentBgIndex]}')`;
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player-target', {
    height: '200',
    width: '200',
    playerVars: {
      'listType': 'playlist',
      'list': 'PL0umg_TNpoZTTdZVIi5tfX69pRmoMFGna',
      'autoplay': 0,
      'controls': 0,
      'enablejsapi': 1
    },
    events: {
      'onReady': () => { isReady = true; },
      'onStateChange': onPlayerStateChange
    }
  });
}

function togglePlay() {
  if (!isReady) return;
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}

function nextTrack() {
  if (isReady) {
    player.nextVideo();
  }
}

function prevTrack() {
  if (isReady) {
    player.previousVideo();
  }
}

function toggleShuffle() {
  if (isReady && player.setShuffle) {
    player.setShuffle(true);
    nextTrack();
  }
}

function seekVideo(event) {
  if (!isReady || !player.getDuration) return;
  const bar = event.currentTarget;
  const rect = bar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percentage = clickX / rect.width;
  const seekTime = player.getDuration() * percentage;
  player.seekTo(seekTime, true);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function updateProgress() {
  if (!player || !player.getCurrentTime) return;
  const current = player.getCurrentTime() || 0;
  const total = player.getDuration() || 0;

  if (total > 0) {
    const percent = (current / total) * 100;
    document.getElementById("progress-fill").style.width = `${percent}%`;
    document.getElementById("time-display").innerText = `${formatTime(current)} / ${formatTime(total)}`;
  }
}

function updateTrackMetadata() {
  if (!player || !player.getVideoData) return;
  const data = player.getVideoData();
  if (data && data.title) {
    document.getElementById("track-title").innerText = data.title;
    document.getElementById("track-artist").innerText = data.author || "Highway Hits";
    if (data.video_id) {
      document.getElementById("track-cover").src = `https://img.youtube.com/vi/${data.video_id}/mqdefault.jpg`;
    }
    changeBackgroundOnSongChange();
  }
}

function onPlayerStateChange(event) {
  const btn = document.getElementById("btn-play");

  if (event.data === YT.PlayerState.PLAYING) {
    btn.innerText = "❚❚";
    updateTrackMetadata();
    if (!progressTimer) {
      progressTimer = setInterval(updateProgress, 500);
    }
  } else {
    btn.innerText = "▶";
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  }

  if (event.data === YT.PlayerState.ENDED) {
    player.nextVideo();
  }
}

function playTruckHorn() {
  const horn = document.getElementById("horn-audio");
  horn.currentTime = 0;
  horn.play().catch(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  });
}

function updateClock() {
  const now = new Date();
  let hours = now.getHours() % 12 || 12;
  let minutes = now.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  document.getElementById('clock').innerText = hours + ':' + minutes + ' ' + (now.getHours() >= 12 ? 'pm' : 'am');
}

setInterval(updateClock, 1000);
updateClock();
