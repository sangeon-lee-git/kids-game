'use strict';
const byId = (id) => document.getElementById(id);
const areaNav = byId('areas'),
  tickets = byId('tickets'),
  heroes = byId('heroes');
const artPieces = {
  battle: '<span class="wand">★</span><i>✧</i><b>✦</b>',
  pairs: '<span class="card-one">가</span><span class="card-two">★</span>',
  count: '<span class="big-symbol">🌟</span><i>✦</i><b>✧</b>',
  train: '<span class="big-symbol">🚂</span><i>✦</i>',
  pattern: '<span class="big-symbol">🌷</span><i>✽</i>',
  detective: '<span class="big-symbol">🔎</span><i>✦</i>',
  basket: '<span class="big-symbol">🧺</span><i>✧</i>',
  trail: '<span class="big-symbol">🧭</span><i>✦</i>',
};
let activeGame;
function showTickets(area) {
  areaNav.replaceChildren();
  for (const [key, info] of Object.entries(Park.areas)) {
    const tab = document.createElement('button');
    tab.className = 'area';
    tab.type = 'button';
    tab.style.setProperty('--tab-color', info.color);
    tab.setAttribute('aria-pressed', String(area === key));
    tab.innerHTML =
      '<span aria-hidden="true">' + info.symbol + '</span>' + info.name;
    tab.onclick = () => {
      Park.tone([494, 659]);
      history.replaceState(null, '', '#' + key);
      showTickets(key);
      areaNav
        .querySelector('[aria-pressed="true"]')
        .focus({ preventScroll: true });
    };
    areaNav.append(tab);
  }
  tickets.replaceChildren();
  for (const game of Park.games.filter((game) => game.area === area)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ticket';
    button.dataset.game = game.id;
    const cleared = Park.read('clear.' + game.id) === '1';
    button.innerHTML =
      '<span class="ticket-art" aria-hidden="true">' +
      artPieces[game.id] +
      '</span>' +
      '<span class="ticket-copy"><small>' +
      game.skill +
      '</small><strong>' +
      game.name +
      '</strong><span>' +
      game.description +
      '</span></span><span class="ticket-stub" aria-hidden="true">' +
      (cleared ? '★' : '▶') +
      '</span>';
    button.setAttribute(
      'aria-label',
      game.name + '. ' + game.description + (cleared ? ' 완료한 놀이' : '')
    );
    button.onclick = () => {
      Park.tone();
      location.hash = 'friend/' + game.id;
    };
    tickets.append(button);
  }
  byId('badgeCount').textContent =
    '★ ' +
    Park.games.filter((g) => Park.read('clear.' + g.id) === '1').length +
    ' / ' +
    Park.games.length;
  byId('badgeCount').setAttribute(
    'aria-label',
    '완료한 놀이 ' + byId('badgeCount').textContent.slice(2)
  );
}
function showFriends(game) {
  activeGame = game;
  byId('lobby').hidden = true;
  byId('characterScreen').hidden = false;
  byId('chosenGame').textContent =
    Park.areas[game.area].name + '  /  ' + game.name;
  heroes.replaceChildren();
  for (const [key, hero] of Object.entries(Park.characters)) {
    const a = document.createElement('a');
    a.className = 'hero-choice ' + key;
    a.style.setProperty('--hero-border', hero.colors.border);
    a.style.setProperty('--hero-background-light', hero.colors.backgroundLight);
    a.style.setProperty('--hero-background-dark', hero.colors.backgroundDark);
    a.style.setProperty('--hero-text', hero.colors.text);
    a.href = Park.gameUrl(game, key);
    a.setAttribute(
      'aria-label',
      hero.name + '와 ' + game.name + ' 시작. 애착인형은 ' + hero.pet
    );
    a.innerHTML =
      '<div class="pedestal"><img alt="" src="' +
      hero.image +
      '"></div><strong>' +
      hero.name +
      '</strong><small class="pet-name">' +
      hero.pet +
      ' 인형과 함께</small><span class="hero-start">함께 출발 ▶</span>';
    a.onclick = () => Park.tone([523, 659, 784]);
    heroes.append(a);
  }
  byId('chooseTitle').focus({ preventScroll: true });
  window.scrollTo(0, 0);
  Park.narrate([['choose', '함께 놀 친구를 골라 줘.']]);
}
function route() {
  const hash = location.hash.slice(1);
  const game = Park.games.find((g) => hash === 'friend/' + g.id);
  if (game) {
    showTickets(game.area);
    showFriends(game);
    return;
  }
  const returning = activeGame;
  activeGame = null;
  Park.hush();
  byId('lobby').hidden = false;
  byId('characterScreen').hidden = true;
  showTickets(Object.hasOwn(Park.areas, hash) ? hash : 'hangul');
  if (returning)
    tickets
      .querySelector('[data-game="' + returning.id + '"]')
      ?.focus({ preventScroll: true });
}
byId('back').onclick = () => {
  location.hash = activeGame.area;
};
Park.soundButton(byId('sound'));
const voiceDialog = byId('voiceDialog'),
  voiceList = byId('voiceList');
function audition() {
  Park.narrate([['count', '별이 몇 개인지 세어 봐.']], {
    voice: voiceList.value,
    preview: true,
  });
}
byId('voiceOpen').onclick = () => {
  Park.hush();
  voiceList.value = Park.voiceChoice();
  voiceDialog.showModal();
};
voiceList.onchange = audition;
byId('voiceListen').onclick = audition;
byId('voiceClose').onclick = () => voiceDialog.close();
byId('voiceSave').onclick = () => {
  Park.write('voice', voiceList.value);
  voiceDialog.close();
};
voiceDialog.addEventListener('close', () => {
  Park.hush();
  byId('voiceOpen').focus();
});
window.addEventListener('hashchange', route);
window.addEventListener('pageshow', (event) => {
  if (event.persisted) route();
});
route();
if (
  location.hash ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
)
  byId('signature').hidden = true;
