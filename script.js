window.addEventListener('DOMContentLoaded', function () {

  const GRID = document.getElementById('square');
  const RESTART_BTN = document.getElementById('restart-btn');
  const START_BTN = document.getElementById('start-btn');
  const FORM = document.getElementById('form');
  const TIMER_OUTPUT = document.getElementById('timer-output');
  const MODAL = document.getElementById('modal-end');
  const cardElements = [];
  const openedCardElements = [];
  let gameNumber = [];
  const ANIMATION_DURATION = 500;
  const TIMER_CONST = 59;

  let cardsNumber = 0;
  let gridSide = 0;
  let progress = 0;
  let timer;
  let timerId;

  GRID.style.setProperty('--duration', ANIMATION_DURATION + 'ms');

  FORM.addEventListener('submit', e => e.preventDefault());

  START_BTN.addEventListener('click', function () {
    gridSide = document.getElementById('cards').value;
    cardsNumber = Math.pow(validateGridSide(gridSide), 2);
    GRID.style.gridTemplate = `repeat(${gridSide}, 1fr) / repeat(${gridSide}, 1fr)`;

    startTheGame();

    FORM.style.display = 'none';
  });

  RESTART_BTN.addEventListener('click', startTheGame);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function startTheGame() {

    RESTART_BTN.style.display = 'none';
    GRID.style.display = 'grid';
    MODAL.style.display = 'none';
    cardElements.length = 0;
    gameNumber.length = 0;
    progress = 0;
    document.querySelectorAll('.scene').forEach(el => el.remove());

    addCards();
    shuffleNumbers();
    markCards();

    timer = TIMER_CONST;
    TIMER_OUTPUT.style.display = 'block';
    // TIMER_OUTPUT.innerText = `00:00:${timer--}`;
    updateTimer();

    timerId = setInterval(updateTimer, 1000);

  }

  function updateTimer() {
    if (timer < 10) TIMER_OUTPUT.innerText = `00:00:0${timer--}`;
    else TIMER_OUTPUT.innerText = `00:00:${timer--}`;

    if (timer === -1)
      finishTheGame(false);
  }

  function addCards() {
    for (let i = 1; i <= cardsNumber; i++) {
      const scene = document.createElement('div');
      scene.classList.add(`scene`);
      GRID.append(scene);
      cardElements.push(scene);

      const card = document.createElement('div');
      card.classList.add(`card`);
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

  function shuffleNumbers() {
    for (let i = 1; i <= cardsNumber / 2; i++) {
      gameNumber = [...gameNumber, i, i];
    }
    gameNumber.sort(() => Math.random() - 0.5);
  }

  function markCards() {
    for (let i = 0; i < cardElements.length; i++) {
      cardElements[i].querySelector('.face').innerText = `${gameNumber[i]}`;
    }

    // Красим одинаковые карты в одинакове цвета
    for (let i = 0; i < cardElements.length - 1; i++) {
      for (let j = i + 1; j < cardElements.length; j++) {
        if (gameNumber[i] === gameNumber[j]) {
          cardElements[i].querySelector('.face').style.backgroundColor = cardElements[j].querySelector('.face').style.backgroundColor = getRandomColor();
        }
      }
    }

  }

  function getRandomIntA_B(a, b) {
    return Math.floor(Math.random() * (b + 1 - a) + a);
  }

  function getRandomColor() {
    return `rgb(${getRandomIntA_B(0, 255)},${getRandomIntA_B(0, 255)},${getRandomIntA_B(0, 255)})`;
  }

  function validateGridSide(n) {
    if (n % 2 === 0 && n >= 2 && n <= 10) return n;
    return 4;
  }

  function flip(element) {
    element.style.transform = 'rotateY(180deg)';
  }

  function flop() {
    openedCardElements.pop().style.transform = 'rotateY(0deg)';
    openedCardElements.pop().style.transform = 'rotateY(0deg)';
  }

  function cardClick(event) {
    if (event.currentTarget.classList.contains('done')) return;
    if (openedCardElements.length === 1 && openedCardElements[0] === event.currentTarget) return;
    if (openedCardElements.length === 2) return;

    flip(event.currentTarget);

    openedCardElements.push(event.currentTarget);
    if (openedCardElements.length === 2) {
      if ((openedCardElements[0].innerText === openedCardElements[1].innerText)) {
        openedCardElements.pop().classList.add('done');
        openedCardElements.pop().classList.add('done');
        progress += 2;
      }
      else {
        setTimeout(flop, ANIMATION_DURATION);
      }
    }

    if (progress === cardsNumber) {
      finishTheGame(true);
    }
  }

  function finishTheGame(isVictory) {
    clearInterval(timerId);
    if (isVictory) {
      setTimeout(function () {
        RESTART_BTN.style.display = 'block';
        MODAL.style.display = 'flex';
        MODAL.innerText = 'Вы выиграли!';
      }, ANIMATION_DURATION * 1.2);
    }
    else {
      RESTART_BTN.style.display = 'block';
      MODAL.style.display = 'flex';
      MODAL.innerText = 'Вы проиграли!';
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

});