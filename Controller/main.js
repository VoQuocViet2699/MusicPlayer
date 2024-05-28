/**
 * 1.Render song
 * 2.Scroll top
 * 3.Play / pause
 * 4.CD rotate
 * 5.Next / prev
 * 6.Random
 * 7.when ended
 * 8.active song
 * 9.scroll active song into view
 * 10.play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'voquocvietf8'
const playList = $('.playlist')
const heading = $("header h2");
const audio = $("#audio");
const cd = $(".cd");
const cdThum = $(".cd-thumb");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnRandom = $(".btn-random");
const btnRepeat = $('.btn-repeat')
const app = {
  currentIndex: 0,
  isRandom : false,
  isRepeat : false,
  config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  songs: [
    {
      name: "Đừng đổ lỗi cho bọn trẻ",
      singer: "Bray",
      path: "/MusicPlayer/Music/Đừng Đổ Lỗi Bọn Trẻ - B Ray x Hoàng Yến Chibi - Official Lyrics Video.mp3",
    },
    {
      name: "Badabum",
      singer: "Bray",
      path: "/MusicPlayer/Music/Ba Da Bum - B Ray - Audio Lyric Oficial.mp3",
    },
    {
      name: "7 years",
      singer: "Lukas Graham",
      path: "/MusicPlayer/Music/Lukas Graham - 7 Years.mp3",
    },
    {
      name: "25",
      singer: "Mashup remix",
      path: "/MusicPlayer/Music/Mashup by Wikin 25 Táo x Young H x Sol'Bass x Nah x B Ray x Chú 13 x Khói Lyric Video( Remix).mp3",
    },
    {
      name: "Past live",
      singer: "Sapientdream",
      path: "/MusicPlayer/Music/sapientdream- Past lives [lyrics].mp3",
    },
    {
      name: "Thuốc lá và cafe",
      singer: "Cậu Bảo",
      path: "/MusicPlayer/Music/t h u ố c l á & c à p h ê - cậu bảo.mp3",
    },
    {
      name: "Thuốc lá và cafe",
      singer: "Cậu Bảo",
      path: "/MusicPlayer/Music/t h u ố c l á & c à p h ê - cậu bảo.mp3",
    },
    {
      name: "Thuốc lá và cafe",
      singer: "Cậu Bảo",
      path: "/MusicPlayer/Music/t h u ố c l á & c à p h ê - cậu bảo.mp3",
    },
    {
      name: "Thuốc lá và cafe",
      singer: "Cậu Bảo",
      path: "/MusicPlayer/Music/t h u ố c l á & c à p h ê - cậu bảo.mp3",
    },
    {
      name: "Thuốc lá và cafe",
      singer: "Cậu Bảo",
      path: "/MusicPlayer/Music/t h u ố c l á & c à p h ê - cậu bảo.mp3",
    },
    {
      name: "Thuốc lá và cafe",
      singer: "Cậu Bảo",
      path: "/MusicPlayer/Music/t h u ố c l á & c à p h ê - cậu bảo.mp3",
    }
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index ="${index}">
            <div class="thumb" style="background-image: url('https://photo-resize-zmp3.zadn.vn/w320_r1x1_jpeg/cover/2/d/b/d/2dbda188888888888888888888888888.jpg')"></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `;
    });
    playList.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    const cdWidth = cd.offsetWidth;
    //xử lí cd quay và dừng
    const cdThumAnimate = cdThum.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumAnimate.pause();

    //phóng to thu nhỏ
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //play/ pause
    playBtn.onclick = function () {
      if (audio.paused) {
        audio.play();
        player.classList.add("playing")
        cdThumAnimate.play();
      } else {
        audio.pause();
        player.classList.remove("playing")
        cdThumAnimate.pause();
      }
    };

    //time update
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    //xử lí tua
    progress.oninput = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    //next song
    btnNext.onclick =  () => {
      if (this.isRandom) {
        this.playRandomSong()
      } else {
        this.nextSong()
      }
      audio.play()
      player.classList.add("playing")
      this.render()
      this.scrollToActiveSong()
    }

    //prev song
    btnPrev.onclick = () => {
      if (this.isRandom) {
        this.playRandomSong()
      } else {
        this.prevSong()
      }
      audio.play() 
      player.classList.add("playing")
      this.render()
      this.scrollToActiveSong()
    }

    //random song
    btnRandom.onclick = () => {
      this.isRandom =!this.isRandom;
      this.setConfig('isRandom', this.isRandom )
      btnRandom.classList.toggle('active', this.isRandom)
      
    }

    //khi audio ended thì autonext 
    audio.onended = () => {
      if (this.isRandom) {
        this.playRandomSong()
      } else {
        this.nextSong()
      }
      audio.play()
    }

    //xử lí lặp lại 1 bài hát
    btnRepeat.onclick = () => {
      this.isRepeat =!this.isRepeat;
      this.setConfig('isRepeat', this.isRepeat )
      btnRepeat.classList.toggle('active', this.isRepeat)
    }

    //khi audio ended thì autonext 
    audio.onended = () => {
      if(this.isRepeat) {
        audio.play()
      }else {
        btnNext.onclick()
      }
    }

    //lắng nghe click vào playlist
    playList.onclick =  (e) => {
      const songEle = e.target.closest('.song:not(.active)')
      if(songEle|| !e.target.closest('.option')) {
        //xử lí khi click vào song
        if(songEle){
          this.currentIndex = Number(songEle.dataset.index)
          this.loadCurrentSong()
          audio.play()
          this.render()
        }
      }
    }
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    audio.src = this.currentSong.path;
    this.setConfig('currentSong', this.currentSong)
  },
  loadConfig : function () {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length ) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong();
  },
  playRandomSong: function() {
    let newIndex
    do{
      newIndex = Math.floor(Math.random() *  this.songs.length)
    }while(newIndex === this.currentIndex)

    this.currentIndex = newIndex
    this.loadCurrentSong()
  },

  // shuffleArray: function(array) {
  //   for(let i = array.length - 1 ; i > 0 ; i--) {
  //     const j = Math.floor(Math.random() * (i + 1))
  //     [array[i], array[j]] = [array[j], array[i]]
  //   }
  //   this.array
  // },
  scrollToActiveSong : function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    },300)
  },
  start: function () {
    //gán cấu hình từ config vào ứng dụng
    this.loadConfig()
    //định nghĩa cho thuộc tính Object
    this.defineProperties();
    //lắng nghe/ xử lí sự kiện(dom event)
    this.handleEvent();
    //tải thông tin bài hát đầu tiên và ui
    this.loadCurrentSong();
    //render song
    this.render();

    btnRepeat.classList.toggle('active', this.isRepeat)
    btnRandom.classList.toggle('active', this.isRandom)

  },
};

app.start();
