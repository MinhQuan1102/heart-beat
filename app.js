(() => {
  // ============================================================
  // HARD-CODE NỘI DUNG Ở ĐÂY
  // Không có custom box trên web. Chỉ sửa các giá trị bên dưới.
  // ============================================================
  const CONTENT = {
    hello: 'hey babe!',
    inboxLine: "you've got new emails",

    from: 'Your person',
    to: 'You',
    message: 'Check out this awesome surprise for YOU!',

    birthdayTitle: 'Happy Birthday, my love.',
    birthdayBody:
      'Being with you is truly one of the best things that has ever happened to me. From the moment you came into my life, everything started to feel brighter and more meaningful. Thank you for loving me, for being here, and for making ordinary days feel special.',

    // Đổi ảnh: bỏ ảnh của bạn vào folder assets rồi sửa path bên dưới.
    // Ví dụ: 'assets/my-photo.jpg'
    photo: 'assets/photo.svg',
  };

  const inboxStep = document.getElementById('inboxStep');
  const mailStep = document.getElementById('mailStep');
  const birthdayStep = document.getElementById('birthdayStep');
  const openMailButton = document.getElementById('openMailButton');
  const attachmentButton = document.getElementById('attachmentButton');
  const transitionCurtain = document.getElementById('transitionCurtain');
  const birthdayPhoto = document.getElementById('birthdayPhoto');
  const confettiLayer = document.getElementById('confettiLayer');

  let busy = false;

  function applyContent() {
    document.querySelectorAll('[data-content]').forEach((el) => {
      const key = el.dataset.content;
      if (Object.prototype.hasOwnProperty.call(CONTENT, key)) {
        el.textContent = CONTENT[key];
      }
    });

    if (birthdayPhoto) {
      birthdayPhoto.src = CONTENT.photo;
    }
  }

  function simpleSwitch(from, to, delay = 430) {
    from.classList.add('is-leaving');

    window.setTimeout(() => {
      from.classList.remove('is-active', 'is-leaving');
      to.classList.add('is-active');
    }, delay);
  }

  function openEmail() {
    if (busy) return;
    busy = true;

    openMailButton.classList.add('is-opening');

    window.setTimeout(() => {
      simpleSwitch(inboxStep, mailStep, 390);
    }, 620);

    window.setTimeout(() => {
      openMailButton.classList.remove('is-opening');
      busy = false;
    }, 1260);
  }

  function createConfetti() {
    confettiLayer.innerHTML = '';

    const colors = ['#d9cfbd', '#1d7773', '#d2b96d', '#8e2725', '#e3dfd6'];
    const pieces = 44;

    for (let i = 0; i < pieces; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty('--delay', `${0.2 + Math.random() * 1.2}s`);
      piece.style.setProperty('--fall-time', `${2.4 + Math.random() * 2.2}s`);
      piece.style.setProperty('--drift', `${-70 + Math.random() * 140}px`);
      piece.style.setProperty('--spin', `${360 + Math.random() * 760}deg`);
      piece.style.width = `${5 + Math.random() * 7}px`;
      piece.style.height = `${8 + Math.random() * 9}px`;
      piece.style.transform = `rotate(${Math.random() * 180}deg)`;
      confettiLayer.appendChild(piece);
    }
  }

  function openAttachment() {
    if (busy) return;
    busy = true;

    transitionCurtain.classList.remove('is-wiping');
    void transitionCurtain.offsetWidth;
    transitionCurtain.classList.add('is-wiping');

    // Ở giữa curtain wipe, đổi scene để không thấy hard cut.
    window.setTimeout(() => {
      mailStep.classList.remove('is-active', 'is-leaving');
      birthdayStep.classList.add('is-active');
      createConfetti();
    }, 470);

    window.setTimeout(() => {
      transitionCurtain.classList.remove('is-wiping');
      busy = false;
    }, 1160);
  }

  openMailButton.addEventListener('click', openEmail);
  attachmentButton.addEventListener('click', openAttachment);

  applyContent();
})();
