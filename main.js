const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "Myung-Player-Storage";

const playLists = $(".playlist");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const titleSong = $("header h2");

const app = {
  currentIndex: 0,
  userConfig: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.userConfig[key] = value;
    // set play storage vào application
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.userConfig));
  },
  songs: [
    {
      name: "Feel Good Inc.",
      bandName: "Gorillaz",
      path: "./assets/music/FeelGoodInc..mp4",
      image: "./assets/img/FeelGoodInc..png",
    },
    {
      name: "Fire Flies",
      bandName: "Gorillaz",
      path: "./assets/music/FireFlies.mp4",
      image: "./assets/img/FileFlies.png",
    },
    {
      name: "Tranz",
      bandName: "Gorillaz",
      path: "./assets/music/Tranz.mp4",
      image: "./assets/img/Tranz.png",
    },
    {
      name: "Silent Running",
      bandName: "Gorillaz",
      path: "./assets/music/SilentRunning.mp4",
      image: "./assets/img/SilentRunning.png",
    },
    {
      name: "Saturnz Barz",
      bandName: "Gorillaz",
      path: "./assets/music/SaturnzBarz.mp4",
      image: "./assets/img/SaturnzBarz.png",
    },
    {
      name: "Rhinestone Eyes",
      bandName: "Gorillaz",
      path: "./assets/music/RhinestoneEyes.mp4",
      image: "./assets/img/RhinestoneEyes.png",
    },
    {
      name: "Hollywood",
      bandName: "Gorillaz",
      path: "./assets/music/Hollywood.mp4",
      image: "./assets/img/Hollywood.png",
    },
    {
      name: "Cracker Island",
      bandName: "Gorillaz",
      path: "./assets/music/CrackerIsland.mp4",
      image: "./assets/img/CrackerIsLand.png",
    },
    {
      name: "Clint Eastwood",
      bandName: "Gorillaz",
      path: "./assets/music/ClintEastwood.mp4",
      image: "./assets/img/ClintEastwood.png",
    },
    {
      name: "Baby Queen",
      bandName: "Gorillaz",
      path: "./assets/music/BabyQueen.mp4",
      image: "./assets/img/BabyQueen.png",
    },
  ],

  // Show toast function
  toast: function ({
    title = "",
    message = "",
    type = "",
    storageView = "",
    duration = 3000,
  }) {
    const mainToast = document.getElementById("toast");
    if (mainToast) {
      const toast = document.createElement("div");
      const icons = {
        bookmark: "fa-solid fa-bookmark",
        lyrics: "fa-solid fa-microphone",
      };
      const icon = icons[type];
      const delay = (duration / 1000).toFixed(2);

      toast.classList.add("toast", `toast--${type}`);
      toast.style.animation = `slideInLeft ease 0.7s, fadeOut linear 1s ${delay}s forwards`;
      toast.innerHTML = `
      <div class="toast__icon">
        <i class="${icon}"></i>
      </div>
      <div class="toast_body">
        <h3 class="toast_title">
          ${title}
        </h3>
        <p class="toast_msg">${message}<a style="color:white; font-weight: 700;">
          ${storageView}
        </a>
      </p>
     </div>
      <div class="toast__close">
      <i class="fa-solid fa-circle-xmark"></i>
      </div>
      `;
      toast.onclick = function (e) {
        if (e.target.closest(".toast__close")) {
          // selector toast__close
          mainToast.removeChild(toast); // xoa di toast message
          clearTimeout(autoRemoveID); // clear timeout for dom
        }
      };
      // Add div con
      mainToast.appendChild(toast);

      // Sau khoang thoi gian xoa div con
      const autoRemoveID = setTimeout(function () {
        mainToast.removeChild(toast);
      }, duration + 1000); // plus 1000 for fadeout 1s to synchronize
    }
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index = ${index}>
        <div class="thumb" 
          style="background-image: url(${song.image})">
        </div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.bandName}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>`;
    });
    playLists.innerHTML = htmls.join("");
  },
  //   getCurrentSong: function() {
  //     return this.songs[this.currentIndex] // start bài hát dầu tiên
  //   },
  defineProperties: function () {
    // Số nhiều
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
    // {name: 'Feel Good Inc.', bandName: 'Gorillaz', path: './assets/music/FeelGoodInc..mp4', image: './assets/img/FeelGoodInc..png'}
    // bài hát dầu tiên
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    }); // số ít
  },
  // flags
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  handleEvent: function (event) {
    // Xu ly phong to
    const cd = $(".cd");
    const cdThumbnail = $(".cd-thumbnail");
    const cdWidth = cd.offsetWidth;
    // Volume change
    const rangeVolume = $(".range-volume");
    // Rotate CD / Pause CD
    const cdThumbAnimate = cdThumbnail.animate(
      // animate tra ve 1 doi tuong nen phai cho vao bien
      [{ transform: "rotate(360deg)" }],
      {
        duration: 10000, // 10 second (toc do quay 1 vong la 10s)
        iterations: Infinity, // Loop
      }
    );
    cdThumbAnimate.pause();

    //  kích thước đĩa CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      // Lấy 1 trong 2
      const newCdWidth = cdWidth - scrollTop; // Cách thu nhỏ hoặc biến mất khi scroll window (kích thước khi scroll)
      // console.log(newCdWidth);
      // console.log(document.documentElement.scrollTop) // thẻ html scroll Top
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
      // console.log(newCdWidth / cdWidth)
    };
    // PLAY / PAUSE MUSIC
    const bookMarkBtn = $(".btn-bookmark");
    const lyricBtn = $(".btn-lyrics");
    const playButton = $(".btn-toggle-play");
    const player = $(".player"); // xử lý khi nhấn play thành pause và ngược lại
    const audio = $("#audio");
    const progress = $("#progress");
    const nextBtn = $(".btn-next");
    const prevBtn = $(".btn-prev");
    const randomBtn = $(".btn-random");
    const repeatBtn = $(".btn-repeat");
    const muteBtn = $(".volume-off");
    const maxVolumeBtn = $(".volume-high");
    const _this = this;

    // Show toast
    bookMarkBtn.onclick = function () {
      _this.toast({
        title: "Bookmarked (Update Soon)",
        message: "Added to your",
        type: "bookmark",
        storageView: "Liked Songs",
        duration: 5000,
      });
    };
    lyricBtn.onclick = function () {
      _this.toast({
        title: "Lyrics (Update Soon)",
        message: "Opened lyric view",
        type: "lyrics",
        storageView: titleSong.textContent,
        duration: 5000,
      });
    };

    // Cách 1 :
    playButton.onclick = function () {
      // console.log(audio.duration)
      if (_this.isPlaying) {
        // _this.isPlaying = false; ném phía dưới
        audio.pause();
        // player.classList.remove("playing"); ném phía dưới
      } else {
        // _this.isPlaying = true; ném phía dưới
        audio.play();
        // player.classList.add("playing"); ném phía dưới
      }
    };

    //  DOM Events Audio/Video
    // https://www.w3schools.com/tags/ref_av_dom.asp
    //  Lắng nghe sự kiện play

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // console.log(cdThumbAnimate);
    // Khi song pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    // Follow audio player progress
    audio.ontimeupdate = function () {
      // first value của duration là NaN
      // audio.duration là tổng số thời gian(giây) của audio
      // target value = số phần trăm của audio khi tua
      // CurrentTime : số giây hiện tại của audio ( ban đầu là 0 )
      // tính số giây của audio khi tua
      // Xử lý
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
        // console.log(progressPercent)
      }
      // console.log(audio.currentTime / audio.duration * 100 )
    };
    // console.log(audio.duration);

    // Xử lý khi TUA nhạc
    // change value of progress
    // kiểm tra value khi tua nhạc
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
      // console.log(e.target.value * audio.duration / 100) // số giây khi tua nhạc
    };
    // Next button click
    (nextBtn.onclick = function () {
      if (_this.isRandom) {
        // nếu như nút random : On
        _this.randomSong(); // random song
      } else {
        // random:off
        _this.nextSong(); // next song theo tuần tự
      }
      // _this.nextSong()
      audio.play(); //  play next song starting at beginning of new song
      _this.render(); // render lại khi click song trong list (nếu nhiều song tìm cách add classlist để performance)
      _this.scrollToActiveSong(); // scroll to active song
    }),
      // Prev button click
      (prevBtn.onclick = function () {
        if (_this.isRandom) {
          // nếu như nút random : On
          _this.randomSong(); // random song
        } else {
          // random:off
          _this.prevSong(); // next song theo tuần tự
        }
        // _this.prevSong();
        audio.play();
        _this.render();
        _this.scrollToActiveSong(); // scroll to active song
      });
    //  Random button click
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom; // đảo ngược lại
      randomBtn.classList.toggle("active", _this.isRandom);
      _this.setConfig("isRandom", _this.isRandom);

      // api toggle classlist, ( nếu randomBtn là true thì add class .active)
      // nếu randomBtn là falsee thì remove class .active)
    };
    // Next song when ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Repeat song when click repeat button
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
      _this.setConfig("isRepeat", _this.isRepeat);
    };

    // Play song when click
    playLists.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      // Bắt sự kiện khi click vào mục tiêu
      // closest kiểm tra con của playlists
      if (songNode || e.target.closest(".option")) {
        // bỏ sự kiện khi bắt vào song playing và menu button
        // Xử lý khi click vào song
        if (songNode) {
          // console.log(songNode.getAttribute('data-index'))
          // currentIndex ban đầu là number
          // khi get thuộc tính để bắt index khi click song bất kỳ thì nó thành chuỗi
          // Nên convert ra thành số
          _this.currentIndex = Number(songNode.getAttribute("data-index"));
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }
      }
    };
    // Volume adjust
    rangeVolume.oninput = function (e) {
      // console.log(e.target.value/100);
      const currentVolume = e.target.value / 100;
      // console.log(e.target.value);
      audio.volume = currentVolume;
    };
    muteBtn.onclick = function () {
      audio.muted = !audio.muted;
      rangeVolume.value = 0;
    };
    maxVolumeBtn.onclick = function () {
      audio.play();
      audio.volume = 1.0;
      rangeVolume.value = 100;
    };
  },
  // Scroll active song into view
  scrollToActiveSong: function () {
    setTimeout(function () {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 500);
  },
  loadConfig: function () {
    // Lưu config user when refresh is enabled
    this.isRandom = this.userConfig.isRandom;
    this.isRepeat = this.userConfig.isRepeat;

    // Object.assign(this,this.userConfig) (Save all configs)
  },
  loadCurrentSong: function () {
    const titleSong = $("header h2");
    const cdThumb = $(".cd .cd-thumbnail");
    const audio = $("#audio");

    titleSong.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
    // console.log(titleSong, cdThumb, audio);
  },
  // Time song loading
  timeUpdate: function () {
    const timeCurrent = $(".timeCurrent");
    const timeEnd = $(".timeEnd");
    audio.ontimeupdate = function () {
      // take time format
      const currentTime = timeFormat(audio.currentTime);
      timeCurrent.textContent = currentTime;
      const endTime = timeFormat(audio.duration);
      // thanh progress
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
      // update thời gian của bài hát
      function timeFormat(seconds) {
        let minute = Math.floor(seconds / 60);
        let second = Math.floor(seconds % 60);
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        return minute + ":" + second;
      }
      if (endTime != "NaN:NaN") {
        timeEnd.textContent = endTime;
      }
    };
  },
  // Next song
  nextSong: function () {
    this.currentIndex++; // first index = 0 (first song) --> next song ==> index = 1 (next song)
    // console.log(this.currentIndex,this.songs.length) // 1 10 --> 10 10 --> 1 10
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0; // start về index = 0
    }
    this.loadCurrentSong(); // khi bấm next tải lại thông tin bài hát ( titleSong, cdThumb, audio)
  },
  // Prev song
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1; // current index(0-9)  , this.songs.length(10)
    }
    console.log(this.currentIndex, this.songs.length);
    this.loadCurrentSong(); // khi bấm prev tải lại thông tin bài hát ( titleSong, cdThumb, audio)
  },

  // Trường hợp random trong songs.length
  randomSong: function () {
    let newIndex; // trường hợp  khi random nó quay lại chính cái bài đó ( xử lý --- dùng do while)
    do {
      newIndex = Math.floor(Math.random() * app.songs.length); // random current index (0-10)
    } while (newIndex === this.currentIndex); // loại bỏ trường hợp lặp lại bài cũ

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  //
  start: function () {
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();
    // Listen || Handle (DOM Events)
    this.handleEvent();
    // Tải thông tin bài hát đầu tiên vào UI
    this.loadCurrentSong();
    // Save Configuration to application
    this.timeUpdate();
    this.loadConfig();
    // Playlists render here
    this.render();

    // Show first status of buttons repeat & random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
