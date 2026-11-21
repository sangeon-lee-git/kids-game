'use strict';
let memoryCards = [],
  memorySelected = [],
  memoryLock = false,
  memoryPairs = 0,
  memoryTimer = null;
function clearMemory() {
  clearTimeout(memoryTimer);
  memoryTimer = null;
  memorySelected = [];
  memoryLock = false;
}
function memorySpeech(card) {
  say(card.word + '. ' + card.s + '. 첫 글자를 찾아 줘.');
}
function begin() {
  clearMemory();
  stopVoice();
  phase = 'memory';
  memoryPairs = 0;
  const chosen = shuffle(
    bank.filter((q) =>
      ['사', '나', '바', '토', '포', '가', '자', '하'].includes(q.s)
    )
  ).slice(0, optionCount === 2 ? 2 : 3);
  deck = chosen;
  memoryCards = shuffle(
    chosen.flatMap((q, i) => [
      { ...q, pair: i, kind: 'letter', open: false, matched: false },
      { ...q, pair: i, kind: 'picture', open: false, matched: false },
    ])
  );
  $('memoryGrid').style.gridTemplateColumns =
    memoryCards.length === 4 ? 'repeat(2,1fr)' : 'repeat(3,1fr)';
  $('memoryGuide').textContent =
    characterName() + '와 함께! 글자와 그림의 첫 글자를 짝지어요.';
  $('memoryStatus').textContent =
    '카드 두 장을 뒤집어 보세요. 헷갈리면 모두 보기를 눌러요.';
  renderMemory();
  $('memoryHint').focus();
}
function renderMemory() {
  $('settings').disabled = memoryLock;
  $('memoryGrid').replaceChildren();
  $('memoryProgress').textContent =
    memoryPairs + ' / ' + memoryCards.length / 2 + ' 쌍';
  $('roundLabel').textContent =
    '짝꿍 ' + memoryPairs + ' / ' + memoryCards.length / 2;
  memoryCards.forEach((c, i) => {
    const b = document.createElement('button');
    const visible = c.open || c.matched;
    b.className =
      'memory-card' + (visible ? ' open' : '') + (c.matched ? ' matched' : '');
    b.disabled = c.matched || memoryLock;
    b.setAttribute(
      'aria-label',
      visible
        ? (c.kind === 'letter' ? c.s + ' 글자' : c.word + ' 그림') +
            (c.matched ? ' 짝꿍 찾음' : '')
        : i + 1 + '번째 뒤집힌 카드'
    );
    if (visible) {
      b.textContent = c.kind === 'letter' ? c.s : c.emoji;
      if (c.kind === 'picture') {
        const s = document.createElement('small');
        s.textContent = c.word;
        b.append(s);
      }
    } else b.textContent = '✦';
    b.onclick = () => flipMemory(i);
    $('memoryGrid').append(b);
  });
  $('memoryHint').disabled = memoryLock;
}
function flipMemory(i) {
  if (phase !== 'memory' || memoryLock) return;
  const card = memoryCards[i];
  if (!card || card.matched || card.open) return;
  card.open = true;
  memorySelected.push(i);
  sfx('whoosh');
  memorySpeech(card);
  if (memorySelected.length === 1) {
    $('memoryStatus').textContent = '이 카드의 짝꿍을 찾아볼까요?';
    renderMemory();
    return;
  }
  const a = memoryCards[memorySelected[0]],
    b = memoryCards[memorySelected[1]];
  if (a.pair === b.pair) {
    a.matched = b.matched = true;
    memoryPairs++;
    rewardBurst('짝꿍 발견!');
    uiTone('pair');
    memorySelected = [];
    $('memoryStatus').textContent = a.s + '와 ' + a.word + '! 짝꿍을 찾았어요!';
    sfx('block');
    renderMemory();
    if (memoryPairs === memoryCards.length / 2) {
      memoryLock = true;
      renderMemory();
      memoryTimer = setTimeout(() => {
        if (phase !== 'memory') return;
        phase = 'memory-result';
        $('resultBadge').textContent = '짝꿍 모두 찾기 성공';
        $('resultTitle').textContent = characterName() + ', 참 잘했어요!';
        $('resultText').textContent =
          '글자와 그림이 모두 짝꿍이 됐어요. 오늘 만난 글자를 함께 읽어 보세요!';
        $('learned').textContent = deck.map((q) => q.s).join(' ');
        $('again').hidden = false;
        $('again').textContent = '다시 섞어서 놀기 →';
        openModal('result');
        say('참 잘했어! 멋진 한글 히어로야.');
      }, 950);
    }
    return;
  }
  memoryLock = true;
  $('memoryStatus').textContent = '괜찮아! 어디 있었는지 기억하고 다시 찾아요.';
  renderMemory();
  memoryTimer = setTimeout(() => {
    memorySelected.forEach((n) => (memoryCards[n].open = false));
    memorySelected = [];
    memoryLock = false;
    renderMemory();
  }, 1250);
}
$('memoryHint').onclick = () => {
  if (phase !== 'memory' || memoryLock) return;
  memorySelected = [];
  memoryLock = true;
  memoryCards.forEach((c) => (c.open = true));
  $('memoryStatus').textContent =
    '천천히 살펴보세요. 글자와 그림은 짝꿍이에요!';
  renderMemory();
  memoryTimer = setTimeout(() => {
    memoryCards.forEach((c) => (c.open = c.matched));
    memoryLock = false;
    renderMemory();
    $('memoryStatus').textContent = '이제 짝꿍을 찾아볼까요?';
  }, 3200);
};
function rewardBurst(text = '짝꿍 발견!') {
  if (reducedMotion()) return;
  const toast = document.createElement('div');
  toast.className = 'prize-popup';
  toast.setAttribute('aria-hidden', 'true');
  toast.textContent = '★ ' + text;
  document.body.append(toast);
  uiDelay(() => toast.remove(), 1100);
  for (let i = 0; i < 7; i++) {
    const star = document.createElement('span');
    star.className = 'reward-star';
    star.setAttribute('aria-hidden', 'true');
    star.textContent = '✦';
    star.style.setProperty('--sx', 43 + Math.random() * 14 + 'vw');
    star.style.setProperty('--sy', '43vh');
    star.style.setProperty('--dx', (i - 3) * 42 + 'px');
    star.style.setProperty('--dy', -60 - Math.random() * 110 + 'px');
    document.body.append(star);
    uiDelay(() => star.remove(), 900);
  }
  {
    $('memoryHero').classList.remove('hero-cheer');
    void $('memoryHero').offsetWidth;
    $('memoryHero').classList.add('hero-cheer');
  }
}

$('memoryRestart').onclick = begin;
startHangul();
