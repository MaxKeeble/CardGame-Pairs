(function () {

  window.addEventListener('DOMContentLoaded', function () {

    const GRID = document.getElementById('square');
    const RESTART_BTN = document.getElementById('restart-btn');
    const START_BTN = document.getElementById('start-btn');
    const FORM = document.getElementById('form');
    const TIMER_OUTPUT = document.getElementById('timer-output');
    const MODAL = document.getElementById('modal-end');
    const CARDS = [];
    const OPENED_CARDS = [];
    const GAME_NUMBERS = [];
    const DELAY = 500;
    const TIMER_CONST = 60;

    let cardsNumber = 0;
    let progress = 0;
    let timer;
    let timerId;


    FORM.addEventListener('submit', e => e.preventDefault());

    START_BTN.addEventListener('click', function () {
      cardsNumber = document.getElementById('cards').value;
      cardsNumber = Math.pow(checkingCards(cardsNumber), 2);
      GRID.style.gridTemplate = `repeat(${Math.sqrt(cardsNumber)}, 1fr) / repeat(${Math.sqrt(cardsNumber)}, 1fr)`;

      startTheGame();

      console.log('masCards: ', CARDS.map(el => el.innerText));

      FORM.style.display = 'none';
    })

    RESTART_BTN.addEventListener('click', startTheGame);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function startTheGame() {

      console.clear();
      RESTART_BTN.style.display = 'none';
      GRID.style.display = 'grid';
      MODAL.style.display = 'none';
      CARDS.length = 0;
      GAME_NUMBERS.length = 0;
      progress = 0;
      document.querySelectorAll('.scene').forEach(el => el.remove());

      addCards();
      shuffleCards();
      markCards();

      timer = TIMER_CONST;
      TIMER_OUTPUT.style.display = 'block';
      TIMER_OUTPUT.innerText = `00:00:${timer--}`;

      timerId = setInterval(function () {
        if (timer < 10) TIMER_OUTPUT.innerText = `00:00:0${timer--}`;
        else TIMER_OUTPUT.innerText = `00:00:${timer--}`;

        if (timer == -1) {
          finishTheGame(false);
        }
      }, 1000);

    }

    function addCards() {
      for (let i = 1; i <= cardsNumber; i++) {
        const scene = document.createElement('div');
        scene.classList.add(`scene`);
        GRID.append(scene);
        CARDS.push(scene);

        const card = document.createElement('div');
        card.classList.add(`card`);
        card.style.transition = `transform ${DELAY}ms linear`;
        card.style.setProperty('--delay', DELAY + 'ms');
        scene.append(card);

        const back = document.createElement('div');
        back.classList.add(`back`);
        card.append(back);
        const face = document.createElement('div');
        face.classList.add(`face`);
        card.append(face);

        card.addEventListener('click', cardClick);
      }
    }

    function shuffleCards() {
      console.log(CARDS.length);
      for (const key in CARDS) {
        GAME_NUMBERS.push(Math.floor(+key / 2 + 1));
      }
      GAME_NUMBERS.sort(() => Math.random() - 0.5);
      console.log('gameNumber: ', GAME_NUMBERS);
    }

    function markCards() {

      for (let i = 0; i < CARDS.length; i++) {
        CARDS[i].querySelector('.face').innerText = `${GAME_NUMBERS[i]}`;
      }

      for (let i = 0; i < CARDS.length - 1; i++) {
        for (let j = i + 1; j < CARDS.length; j++) {
          if (GAME_NUMBERS[i] == GAME_NUMBERS[j]) {
            CARDS[i].querySelector('.face').style.backgroundColor = CARDS[j].querySelector('.face').style.backgroundColor = `rgb(${randomAB(0, 255)},${randomAB(0, 255)},${randomAB(0, 255)})`;

          }
        }
      }

    }

    function randomAB(a, b) {
      return Math.floor(Math.random() * (b + 1 - a) + a);
    }

    function checkingCards(n) {
      if (n % 2 == 0 && n >= 2 && n <= 10) return n;
      return 4;
    }

    function flip(e) {
      e.currentTarget.style.transform = 'rotateY(180deg)';
    }

    function flop() {
      OPENED_CARDS.pop().style.transform = 'rotateY(0deg)';
      OPENED_CARDS.pop().style.transform = 'rotateY(0deg)';
    }

    function cardClick(e) {
      if (e.currentTarget.classList.contains('done')) return;

      if (OPENED_CARDS.length == 1 && OPENED_CARDS[0] == e.currentTarget) return;

      if (OPENED_CARDS.length == 2) return;

      flip(e);
      OPENED_CARDS.push(e.currentTarget);
      console.log('masCardsOpened: ', OPENED_CARDS);

      if (OPENED_CARDS.length == 2) {
        if ((OPENED_CARDS[0].innerText == OPENED_CARDS[1].innerText)) {
          OPENED_CARDS.pop().classList.add('done');
          OPENED_CARDS.pop().classList.add('done');
          progress += 2;
        }
        else {
          setTimeout(flop, DELAY);
        }
      }

      if (progress == cardsNumber) {
        finishTheGame('Вы выиграли!');
      }
    }

    function finishTheGame(isVictory) {
      clearInterval(timerId);
      if (isVictory) {
        setTimeout(function () {
          RESTART_BTN.style.display = 'block';
          MODAL.style.display = 'flex';
          MODAL.innerText = 'Вы выиграли!';
        }, DELAY * 1.2);
      }
      else {
        RESTART_BTN.style.display = 'block';
        MODAL.style.display = 'flex';
        MODAL.innerText = 'Вы проиграли!';
      }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  });

})();