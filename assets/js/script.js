const ham = document.querySelector('.ham');
const header = document.querySelector('.header');
const menuItems = document.querySelectorAll('.nav__item a, .btn__contact');
const pagetop_btn = document.querySelector('.pagetop');
const fadeElements = document.querySelectorAll('.fadeUp__animation');



// ham
ham.addEventListener('click', function() {
  ham.classList.toggle('ham__close');
  header.classList.toggle('open');
})

// nav__item a
menuItems.forEach(function(Item) {
  Item.addEventListener('click', function() {
    ham.classList.remove('ham__close');
    header.classList.remove('open');
  })
})


// pegetop
pagetop_btn.addEventListener('click', scroll_top);
// ページ上部へスムーズに移動
function scroll_top() {
  window.scroll({ top: 0, behavior: 'smooth' });
}

// header
let lastScroll = window.pageYOffset;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  /* =========================
     ① 599px 以下だけ scrolled
  ========================= */
  if (window.innerWidth <= 599) {
    if (currentScroll > 74) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  } else {
    header.classList.remove('scrolled');
  }

  /* =========================
     ② メニュー open 中は無効
  ========================= */
  if (header.classList.contains('open')) {
    lastScroll = currentScroll;
    return;
  }

  /* =========================
     ③ 微小スクロール無視
     （service自動切替対策）
  ========================= */
  if (Math.abs(currentScroll - lastScroll) < 5) {
    lastScroll = currentScroll;
    return;
  }

  /* =========================
     ④ 500px超えてから
        下で hidden / 上で解除
  ========================= */
  if (currentScroll > 500) {
    if (currentScroll > lastScroll) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
  }

  lastScroll = currentScroll;
});

// fadeUp
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target); // 一度表示したら監視解除
    }
  });
}, {
  threshold: 0.15 // 15%見えたらアニメーション
});

fadeElements.forEach(el => observer.observe(el));

// mainTitle animation
document.addEventListener('DOMContentLoaded', () => {
  const spans = document.querySelectorAll('.mainTitle__01, .mainTitle__02');

  spans.forEach((span, index) => {
    setTimeout(() => {
      span.style.clipPath = 'inset(0 0 0 0)'; // ← 背景が左→右へ現れる
    }, index * 600); // 行ごとに遅延
  });
});


// case scroll animation
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".case__wrapper");
  const list = document.querySelector(".case__list");
  const items = Array.from(document.querySelectorAll(".case__item"));

  let currentIndex = 0;
  let interval = null;

  /* ====== 要素を複製（シームレス用） ====== */
  items.forEach(item => {
    const clone = item.cloneNode(true);
    list.appendChild(clone);
  });

  const totalItems = items.length;

  /* ====== 画面幅に応じた設定 ====== */
  function getSettings() {
    const width = window.innerWidth;

    if (width >= 830) {
      return { visible: 3, gap: 50, active: true };
    } else if (width >= 599) {
      return { visible: 2, gap: 30, active: true };
    } else {
      return { visible: 1, gap: 40, active: true };
    }
  }

  /* ====== 移動量 ====== */
  function getStep() {
    const { gap } = getSettings();
    const itemWidth = items[0].getBoundingClientRect().width;
    return itemWidth + gap;
  }

  function slide() {
    const { visible, active } = getSettings();
    if (!active) return;

    currentIndex++;
    const step = getStep();

    list.style.transition = "transform 0.6s ease";
    list.style.transform = `translateX(${-currentIndex * step}px)`;

    /* ====== シームレス処理 ====== */
    if (currentIndex >= totalItems) {
      setTimeout(() => {
        list.style.transition = "none";
        currentIndex = 0;
        list.style.transform = "translateX(0)";
      }, 600); // transition時間と合わせる
    }
  }

  function startSlider() {
    if (interval) clearInterval(interval);
    const speed = window.innerWidth <= 599 ? 2500 : 3000;
    interval = setInterval(slide, speed);
  }

  function stopSlider() {
    clearInterval(interval);
  }

  wrapper.addEventListener("mouseenter", stopSlider);
  wrapper.addEventListener("mouseleave", startSlider);

  window.addEventListener("resize", () => {
    currentIndex = 0;
    list.style.transition = "none";
    list.style.transform = "translateX(0)";
    stopSlider();
    startSlider();
  });

  startSlider();
});

// slider
document.addEventListener("DOMContentLoaded", function () {

  // ★ 連動テキスト（画像と順番を合わせる）
  const staffData = [
    { title: "クリエイティブチーム代表職員", name: "S.M" },
    { title: "Webコーディネーター", name: "T.I" },
    { title: "グラフィックデザイナー", name: "R.I" },
    { title: "Webクリエイター", name: "S.K" },
    { title: "ディレクター", name: "Y.T" },
  ];

  const titleEl = document.querySelector(".swiper__title");
  const nameEl = document.querySelector(".swiper__name");
  const counterEl = document.querySelector(".swiper__counter");

  // ▼ 画面幅チェック
  const isSP = window.innerWidth <= 599;

  // ▼ Swiper 実行
  const swiper = new Swiper(".normal-slider", {
    loop: true,
    slidesPerView: isSP ? 1.6 : 3,
    centeredSlides: true,
    speed: 1000,

    autoplay: {
      delay: 2000,
      reverseDirection: true,
      disableOnInteraction: false,
    },

    spaceBetween: isSP ? 20 : 40,
    watchSlidesProgress: true,

    on: {
      /* ===== アーチ型アニメーション（レスポンシブ対応） ===== */
      progress: function () {
        this.slides.forEach((slide) => {
          const p = slide.progress;

          // PC用
          let rotate = p * -22;
          let translateX = p * 90;
          let translateY = Math.abs(p) * 60;
          let scale = 1 - Math.abs(p) * 0.12;

          // ▼ スマホ用（弱める）
          if (isSP) {
            rotate = p * -12;
            translateX = p * 35;
            translateY = Math.abs(p) * 25;
            scale = 1 - Math.abs(p) * 0.06;
          }

          slide.style.transform = `
            translateX(${translateX}px)
            translateY(${translateY}px)
            rotate(${rotate}deg)
            scale(${scale})
          `;

          slide.style.opacity = 1 - Math.abs(p) * 0.45;
        });
      },

      setTranslate: function () {
        this.updateSlides();
      },

      /* ========== txt連動 ========== */
      slideChange: function () {
        const i = this.realIndex;
        const total = staffData.length;

        titleEl.innerHTML = staffData[i].title;
        nameEl.textContent = staffData[i].name;
        counterEl.textContent =
          `${String(i + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;
      }
    },
  });

  /* ===== navBtn制御 ===== */
  const navBtns = document.querySelectorAll(".swiper__navBtn");

  navBtns[0].addEventListener("click", () => {
    swiper.slidePrev();
  });

  navBtns[1].addEventListener("click", () => {
    swiper.slideNext();
  });

});

// service animation
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".service__item");
  const right = document.querySelector(".service__right");

  const data = [
    {
      title: "Web",
      img: "../assets/img/service/photo__webdesign.png",
      number: "01",
      text: "コーポレートサイトから飲食店サイト、採用サイトなどの実績多数で幅広く制作しております。"
    },
    {
      title: "Graphic",
      img: "../assets/img/service/photo__graphicdesign.png",
      number: "02",
      text: "チラシ・パンフレットの紙媒体やキャラクターデザインまで幅広いグラフィックデザインをご提案。"
    },
    {
      title: "Video",
      img: "../assets/img/service/photo__videoproduction.png",
      number: "03",
      text: "動画は予算規模に合わせて撮影から編集までハイクオリティな制作を行います。"
    }
  ];

  let current = 0;
  const intervalTime = 6000;
  const animationDelay = 100;

  function changeService(index) {
    // 左側
    items.forEach(item => item.classList.remove("is-active"));
    items[index].classList.add("is-active");

    // フェードアウト
    right.classList.add("is-animating");

    setTimeout(() => {
      right.querySelector(".title").textContent = data[index].title;
      right.querySelector("img").src = data[index].img;
      right.querySelector("img").alt = data[index].title;
      right.querySelector(".number").textContent = data[index].number;
      right.querySelector(".txt").textContent = data[index].text;

      // フェードイン
      right.classList.remove("is-animating");
    }, animationDelay);
  }

  /* 初期状態 */
  items[0].classList.add("is-active");

  /* 自動切り替え */
  setInterval(() => {
    current = (current + 1) % data.length;
    changeService(current);
  }, intervalTime);
});