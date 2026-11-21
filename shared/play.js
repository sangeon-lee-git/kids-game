'use strict';

const game = Park.games.find((item) => item.id === document.body.dataset.game);
const hero = Park.characters[Park.hero];
const area = Park.areas[game.area];
const screen = document.querySelector('main');
document.title = game.name + ' · 별빛 놀이공원';
document.documentElement.style.setProperty('--area', area.color);
const el = (tag, className, text) => {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (text !== undefined) item.textContent = text;
  return item;
};
const at = (id) => document.getElementById(id);
const home = Park.homeUrl(game.area);
document.querySelector('header').innerHTML =
  '<a class="brand" href="' +
  home +
  '"><span class="brand-star">★</span> 놀이 고르기</a><button class="sound" id="sound"></button>';
screen.innerHTML =
  '<div class="play-heading"><div><p class="zone"></p><h1 class="play-title"></h1></div><div class="party-token"><img class="player" alt=""><img class="pet" alt=""><span></span></div></div>' +
  '<div class="machine"><div class="machine-top"><button class="listen" id="listen">♫ 다시 듣기</button><div id="progress"></div></div>' +
  '<h2 id="prompt" tabindex="-1"></h2><div class="board" id="board"></div><div class="answers" id="answers"></div>' +
  '<p id="feedback" class="feedback" role="status"></p><button id="next" class="action" hidden></button></div>';
document.querySelector('.zone').textContent = area.name + ' 구역';
document.querySelector('.play-title').textContent = game.name;
document.querySelector('.player').src = hero.image;
document.querySelector('.pet').src = hero.petImage;
document.querySelector('.pet').alt = hero.pet + ' 애착인형';
document.querySelector('.party-token span').textContent = hero.name;
let deck, round, locked, mistakes, hintKey, audioLines;
function promptVoice() {
  Park.narrate(audioLines);
}
Park.soundButton(at('sound'), promptVoice);
at('listen').onclick = promptVoice;
function progress() {
  at('progress').replaceChildren();
  for (let i = 0; i < deck.length; i++)
    at('progress').append(
      el('span', i < round + Number(locked) ? 'earned' : '', '★')
    );
  at('progress').setAttribute(
    'aria-label',
    '모은 별 ' + (round + Number(locked)) + '개'
  );
}
function wrong() {
  if (locked) return;
  mistakes++;
  at('feedback').textContent =
    mistakes >= 2 ? '반짝이는 테두리를 살펴봐!' : '괜찮아, 다시 해 보자!';
  Park.narrate([['retry', '괜찮아. 다시 해 보자.']]);
  if (mistakes >= 2)
    [...at('answers').children]
      .find((b) => b.dataset.key === String(hintKey))
      ?.classList.add('hint');
}
function success() {
  if (locked) return;
  locked = true;
  at('board').classList.add('reward');
  at('answers')
    .querySelectorAll('button')
    .forEach((b) => (b.disabled = true));
  at('board')
    .querySelectorAll('button')
    .forEach((b) => (b.disabled = true));
  progress();
  Park.tone([523, 659, 784]);
  Park.narrate([['right', '맞았어! 별 하나를 모았어.']]);
  at('feedback').textContent = '★ 맞았어! 별 하나를 모았어.';
  at('next').textContent =
    round === deck.length - 1 ? '별 모아 보기' : '다음 놀이 ▶';
  at('next').hidden = false;
  at('next').focus({ preventScroll: true });
}
function choices(options, correctKey, onPick) {
  hintKey = correctKey;
  const box = at('answers');
  box.replaceChildren();
  box.style.setProperty('--columns', String(options.length));
  for (const opt of options) {
    const b = el('button', 'answer');
    b.type = 'button';
    b.dataset.key = String(opt.key);
    b.setAttribute('aria-label', opt.label);
    b.append(el('span', 'answer-icon', opt.icon ?? opt.key));
    if (opt.icon !== undefined && opt.label !== opt.icon)
      b.append(el('small', '', opt.label));
    b.onclick = () => {
      if (locked) return;
      if (opt.key !== hintKey) {
        wrong();
        return;
      }
      b.classList.add('hit');
      if (onPick) onPick(opt);
      else success();
    };
    box.append(b);
  }
}
function optionalHint(key) {
  hintKey = key;
  mistakes = 0;
  at('answers')
    .querySelectorAll('.hint,.hit')
    .forEach((b) => b.classList.remove('hint', 'hit'));
}
function numbers(n, max) {
  const universe = Array.from({ length: max }, (_, i) => i + 1);
  return Park.shuffled([
    n,
    ...Park.shuffled(universe.filter((x) => x !== n)).slice(0, 2),
  ]).map((k) => ({ key: k, label: String(k) }));
}
function renderRound() {
  locked = false;
  mistakes = 0;
  at('next').hidden = true;
  at('feedback').textContent = '';
  at('board').replaceChildren();
  at('answers').replaceChildren();
  at('board').className = 'board board-' + game.id;
  const q = deck[round];
  audioLines = [
    [activity.voice, activity.question],
    ...(q.voice ? [q.voice] : []),
  ];
  at('prompt').textContent = activity.question;
  activity.show(q, {
    board: at('board'),
    feedback: at('feedback'),
    el,
    choices,
    success,
    optionalHint,
    numbers,
    hero,
  });
  progress();
  at('prompt').focus({ preventScroll: true });
  promptVoice();
}
function victory() {
  Park.write('clear.' + game.id, '1');
  Park.tone([523, 659, 784, 1046]);
  Park.narrate([['win', '해냈어! 별 다섯 개를 모았어.']]);
  const panel = document.querySelector('.machine');
  panel.hidden = true;
  at('next').hidden = true;
  const result = el('section', 'victory');
  result.id = 'victory';
  result.innerHTML =
    '<div class="victory-stars" aria-label="별 다섯 개">★★★★★</div><div class="result-portraits"><img src="' +
    hero.image +
    '" alt=""><img src="' +
    hero.petImage +
    '" alt=""></div>' +
    '<h2 tabindex="-1">' +
    hero.name +
    ', 해냈어!</h2><p>별 다섯 개를 모았어요.</p><button class="action" id="again">한 번 더 놀기</button> <a class="back" href="' +
    home +
    '">놀이 고르기</a>';
  screen.append(result);
  result.querySelector('h2').focus();
  at('again').onclick = () => {
    result.remove();
    panel.hidden = false;
    start();
  };
}
function start() {
  ParkCountdown.show(area.name + ' 구역', () => {
    deck = activity.deck().slice(0, 5);
    round = 0;
    renderRound();
  });
}
at('next').onclick = () => {
  if (!locked) return;
  if (++round === deck.length) victory();
  else renderRound();
};
window.addEventListener('pageshow', (event) => {
  if (event.persisted && ParkCountdown.showing) start();
});
start();
