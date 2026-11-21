'use strict';
function combat(kind, turn = 0) {
  resetEffects();
  void $('arena').offsetWidth;
  if (kind === 'guard') {
    $('rival').classList.add('countering');
    $('hero').classList.add('guarding');
    $('counterShot').classList.add('active');
    $('shield').classList.add('active');
    $('combatLabel').textContent = '반짝 방패!';
    $('combatLabel').classList.add('active');
    sfx('whoosh');
    later(() => sfx('block'), 370);
    later(() => resetEffects(), 920);
    return;
  }
  const move = turn % 3,
    final = turn === 4;
  $('hero').classList.add('attack');
  if (move === 1) $('hero').classList.add('kick');
  if (move === 2 || final) {
    $('hero').classList.add('beam');
    $('arena').classList.add('beam');
  }
  if (final) $('arena').classList.add('finisher');
  $('rival').classList.add('hit');
  $('energy').classList.add('fire');
  $('impact').classList.add('burst');
  $('impactText').textContent = final ? '콰앙!' : move === 1 ? '파앗!' : '팡!';
  $('slash').classList.add('active');
  $('arena').classList.add('shaking');
  $('combatLabel').textContent = final
    ? '필살! 별빛 파동!'
    : ['반짝 돌진 펀치!', '빙글 별빛 킥!', '무지개 에너지파!'][move];
  $('combatLabel').classList.add('active');
  $('combo').textContent = '★ ' + (turn + 1) + ' HIT';
  $('combo').classList.add('pulse');
  sfx('whoosh');
  later(() => sfx('impact'), 350);
  if (final) later(() => sfx('block'), 500);
}
function prompt() {
  const q = deck[Math.min(index, deck.length - 1)];
  return mode === 'match'
    ? q.s + '. 같은 글자를 찾아 줘.'
    : q.word + '. ' + q.s + '. 첫 글자를 찾아 줘.';
}
function resetEffects() {
  clearTimeout(nextTimer);
  effectTimers.forEach(clearTimeout);
  effectTimers = [];
  for (const [id, classes] of Object.entries({
    hero: ['attack', 'kick', 'beam', 'guarding'],
    rival: ['hit', 'countering'],
    energy: ['fire'],
    arena: ['beam', 'finisher', 'shaking'],
    impact: ['burst'],
    slash: ['active'],
    shield: ['active'],
    counterShot: ['active'],
    combatLabel: ['active'],
    combo: ['pulse'],
  }))
    $(id).classList.remove(...classes);
}
function render() {
  $('battleLesson').classList.remove('waiting-next');
  mistakes = 0;
  const q = deck[index];
  $('step').textContent =
    mode === 'match'
      ? '첫걸음 · 같은 글자 찾기'
      : '한 걸음 더 · 그림 첫 글자 찾기';
  $('roundLabel').textContent = '연습 대전 · ' + round + ' / 3';
  $('target').textContent = mode === 'match' ? q.s : q.emoji;
  $('target').setAttribute('aria-label', mode === 'match' ? q.s : q.word);
  $('question').textContent =
    mode === 'match' ? '같은 글자를 찾아줘!' : q.word + '의 첫 글자는?';
  $('feedback').textContent = '글자 버튼을 누르면 마법이 나가요.';
  $('bubble').textContent = '글자 마법, 준비됐나요?';
  updateMeter();
  $('dots').replaceChildren();
  for (let n = 0; n < 5; n++) {
    const d = document.createElement('span');
    d.className =
      'dot' + (n < index ? ' done' : '') + (n === index ? ' current' : '');
    $('dots').append(d);
  }
  $('dots').setAttribute('aria-label', `5문제 중 ${index + 1}번째`);
  const options = shuffle([
    q,
    ...shuffle(bank.filter((x) => x.s !== q.s)).slice(0, optionCount - 1),
  ]);
  $('choices').style.gridTemplateColumns = `repeat(${optionCount},1fr)`;
  $('choices').replaceChildren();
  options.forEach((item) => {
    const b = document.createElement('button');
    b.className = 'choice';
    b.textContent = item.s;
    b.setAttribute('aria-label', item.s + ' 선택');
    b.onclick = () => choose(item.s, b);
    $('choices').append(b);
  });
  const old = $('next');
  if (old) old.remove();
}
function updateMeter() {
  const left = 5 - index;
  $('rivalFill').style.width = left * 20 + '%';
  $('rivalMeter').setAttribute('aria-valuenow', left * 20);
  $('energyNote').textContent = '구름 에너지 ' + left + ' / 5';
}
function choose(letter, button) {
  if (phase !== 'playing') return;
  const q = deck[index];
  if (letter !== q.s) {
    mistakes++;
    combat('guard');
    button.classList.remove('wrong');
    void button.offsetWidth;
    button.classList.add('wrong');
    $('feedback').textContent =
      mistakes >= 2
        ? '초록 테두리 글자를 함께 눌러 볼까요?'
        : '괜찮아! 다시 듣고 골라 보자.';
    say(prompt());
    if (mistakes >= 2)
      [...$('choices').children]
        .find((b) => b.textContent === q.s)
        .classList.add('hint');
    return;
  }
  phase = 'animating';
  button.classList.add('correct');
  [...$('choices').children].forEach((b) => (b.disabled = true));
  combat('strike', index);
  $('bubble').textContent = [
    '반짝 펀치! ✦',
    '별빛 발차기! ✦',
    '무지개 마법! ✦',
  ][index % 3];
  $('feedback').textContent = '맞았어! ' + q.s + '! 멋진 한글 마법이야.';
  say('맞았어! ' + q.s + '! 멋지다!');
  index++;
  updateMeter();
  $('dots').children[index - 1].classList.add('done');
  nextTimer = setTimeout(() => {
    resetEffects();
    phase = 'between';
    const b = document.createElement('button');
    b.id = 'next';
    b.className = 'primary';
    b.style.cssText =
      'display:block;max-width:360px;margin:17px auto 0;font-size:17px;padding:14px';
    b.textContent = index === 5 ? '대전 결과 보기 ★' : '다음 문제 →';
    b.onclick = () => {
      if (phase !== 'between') return;
      if (index === 5) finish();
      else {
        phase = 'playing';
        render();
        $('listen').focus();
        say(prompt());
      }
    };
    $('feedback').after(b);
    $('battleLesson').classList.add('waiting-next');
    if ($('parent').hidden) b.focus();
  }, 1150);
}
function finish() {
  phase = 'result';
  $('resultBadge').textContent = round + '번째 대전 완료';
  $('resultTitle').textContent =
    round >= 3 ? '이제 잠깐 쉬어 가요!' : '멋진 한글 히어로!';
  $('resultText').textContent =
    round >= 3
      ? '세 판이나 연습했어요! 몸을 쭉 펴고, 오늘 만난 글자를 함께 읽어 보세요.'
      : '구름이와 다섯 번의 마법을 주고받았어요. 오늘 만난 글자를 함께 읽어 보세요!';
  $('learned').textContent = deck.map((x) => x.s).join(' ');
  $('again').hidden = round >= 3;
  openModal('result');
  say(
    round >= 3 ? '참 잘했어! 이제 잠깐 쉬자.' : '참 잘했어! 멋진 한글 히어로야.'
  );
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      s.textContent = ['✦', '★', '●'][i % 3];
      s.style.left = Math.random() * 95 + '%';
      s.style.color = ['#e8ba5e', '#d0e888', '#b9ade5'][i % 3];
      s.style.animationDelay = Math.random() * 0.5 + 's';
      $('result').append(s);
      setTimeout(() => s.remove(), 2600);
    }
}
const arenaPointer = (e) => {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    $('arena').classList.contains('gentle')
  )
    return;
  const box = $('arena').getBoundingClientRect();
  const x = ((e.clientX - box.left) / box.width - 0.5) * 10,
    y = ((e.clientY - box.top) / box.height - 0.5) * 7;
  $('arena').style.setProperty('--view-x', x + 'px');
  $('arena').style.setProperty('--view-y', y + 'px');
};
$('arena').addEventListener('pointermove', arenaPointer);
$('arena').addEventListener('pointerleave', () => {
  $('arena').style.setProperty('--view-x', '0px');
  $('arena').style.setProperty('--view-y', '0px');
});
function begin() {
  resetEffects();
  stopVoice();
  deck = shuffle(bank).slice(0, 5);
  index = 0;
  phase = 'playing';
  $('again').textContent = '다음 모험으로!';
  $('combo').textContent = '★ 0 HIT';
  render();
  $('listen').focus();
  say(prompt());
}
$('listen').onclick = () => {
  if (deck.length) say(prompt());
};
startHangul();
