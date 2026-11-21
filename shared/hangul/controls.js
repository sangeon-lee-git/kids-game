'use strict';
const $ = (id) => document.getElementById(id);
const hero = Park.characters[Park.hero];
const isBattle = document.body.dataset.game === 'battle';
const characterName = () => hero.name;
const shuffle = Park.shuffled;
let mode = 'match',
  optionCount = 3,
  round = 1,
  deck = [],
  index = 0,
  mistakes = 0,
  phase = 'starting';
let sound = Park.rememberedSound(),
  voiceMode = 'natural',
  voiceAudio,
  voiceGeneration = 0;
let audioContext,
  nextTimer,
  effectTimers = [],
  sceneTimers = [],
  lastFocus;
function later(fn, ms) {
  const id = setTimeout(fn, ms);
  effectTimers.push(id);
  return id;
}
function uiDelay(fn, ms) {
  const id = setTimeout(fn, ms);
  sceneTimers.push(id);
  return id;
}
const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function uiTone(kind) {
  Park.tone(
    kind === 'win'
      ? [523, 659, 784, 1046]
      : kind === 'tick'
        ? [392]
        : [659, 880]
  );
}
function stopVoice() {
  voiceGeneration++;
  if (voiceAudio) {
    voiceAudio.pause();
    voiceAudio = null;
  }
  window.speechSynthesis?.cancel();
}
function deviceVoice(text) {
  if (!sound || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = 0.94;
  const voices = window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.startsWith('ko'));
  u.voice =
    voices.find((v) => /Natural|Online|SunHi|Sun-Hi|Google/i.test(v.name)) ||
    voices[0] ||
    null;
  window.speechSynthesis.speak(u);
}
function say(text, selectedMode = voiceMode) {
  stopVoice();
  if (!sound) return;
  const token = voiceGeneration;
  if (selectedMode === 'natural' && Object.hasOwn(clips, text)) {
    voiceAudio = new Audio(Park.url('shared/voice/hangul/' + clips[text]));
    voiceAudio.play().catch(() => {
      if (token === voiceGeneration) deviceVoice(text);
    });
  } else deviceVoice(text);
}
function lockScene() {
  document.querySelector('main').inert = [
    'sceneCurtain',
    'result',
    'parent',
  ].some((id) => !$(id).hidden);
}
function openModal(id) {
  lastFocus = document.activeElement;
  if (id === 'result') {
    Park.write('clear.' + document.body.dataset.game, '1');
    $('victoryPortrait').src = hero.image;
    $('victoryPortrait').alt = hero.name;
    uiTone('win');
  }
  $(id).hidden = false;
  lockScene();
  [...$(id).querySelectorAll('button,select')]
    .find((b) => !b.hidden && !b.disabled)
    ?.focus();
}
function closeSettings() {
  stopVoice();
  $('parent').hidden = true;
  lockScene();
  if (lastFocus?.isConnected) lastFocus.focus();
}
function home() {
  location.assign(Park.homeUrl('hangul'));
}
function cancelTimers() {
  clearTimeout(nextTimer);
  sceneTimers.forEach(clearTimeout);
  sceneTimers = [];
  effectTimers.forEach(clearTimeout);
  effectTimers = [];
  if (!isBattle) clearMemory();
  stopVoice();
}
function launch(action) {
  cancelTimers();
  $('parent').hidden = true;
  $('result').hidden = true;
  const curtain = $('sceneCurtain');
  curtain.hidden = false;
  $('sceneAvatar').src = hero.image;
  $('sceneAvatar').alt = hero.name;
  $('sceneStage').textContent = isBattle ? 'MAGIC ARENA' : 'LETTER PAIRS';
  $('sceneLabel').textContent = isBattle ? '숲속 별빛 대전' : '한글 짝꿍 카드';
  $('sceneCount').textContent = reducedMotion() ? '출발!' : '3';
  lockScene();
  $('sceneCancel').focus();
  const counts = reducedMotion() ? [] : ['2', '1', '출발!'];
  counts.forEach((v, i) =>
    uiDelay(
      () => {
        $('sceneCount').textContent = v;
        uiTone('tick');
      },
      (i + 1) * 330
    )
  );
  uiDelay(
    () => {
      curtain.hidden = true;
      lockScene();
      action();
      const scene = $(isBattle ? 'arena' : 'memoryGrid');
      const effect = isBattle ? 'arrival' : 'dealing';
      scene.classList.remove(effect);
      void scene.offsetWidth;
      scene.classList.add(effect);
      uiDelay(() => scene.classList.remove(effect), 850);
    },
    reducedMotion() ? 60 : 1280
  );
}
function syncSound() {
  sound = Park.rememberedSound();
  $('sound').textContent = sound ? '♫ 소리 켜짐' : '♪ 소리 꺼짐';
  $('sound').setAttribute('aria-pressed', String(sound));
}
function startHangul() {
  const photo = $(isBattle ? 'heroSprite' : 'memoryHero');
  photo.src = hero.image;
  photo.alt = hero.name;
  $('petPortrait').src = hero.petImage;
  $('petPortrait').alt = hero.name + '의 ' + hero.pet + ' 애착인형';
  $('petLabel').title = $('petPortrait').alt;
  if (isBattle) $('heroName').textContent = hero.name;
  syncSound();
  $('sound').onclick = () => {
    Park.write('sound', sound ? 'off' : 'on');
    syncSound();
    if (sound) say('소리를 켰어요.');
    else stopVoice();
  };
  $('menuButton').onclick = $('sceneCancel').onclick = $('home').onclick = home;
  $('again').onclick = () =>
    launch(() => {
      if (isBattle) round++;
      begin();
    });
  $('settings').onclick = () => {
    stopVoice();
    $('voiceSelect').value = voiceMode;
    $('countSelect').value = String(optionCount);
    if (isBattle) {
      $('modeSelect').value = mode;
      $('motionSelect').value = $('arena').classList.contains('gentle')
        ? 'gentle'
        : 'strong';
    }
    openModal('parent');
  };
  $('parentClose').onclick = closeSettings;
  $('voicePreview').onclick = () => {
    if (sound)
      say('토리와 함께 한글 마법을 시작해 볼까요?', $('voiceSelect').value);
    else $('voicePreview').textContent = '상단에서 소리를 먼저 켜 주세요';
  };
  $('apply').onclick = () => {
    voiceMode = $('voiceSelect').value;
    optionCount = Number($('countSelect').value);
    round = 1;
    if (isBattle) {
      mode = $('modeSelect').value;
      $('arena').classList.toggle(
        'gentle',
        $('motionSelect').value === 'gentle'
      );
    }
    launch(begin);
  };
  document.addEventListener('keydown', (e) => {
    const dialog = ['sceneCurtain', 'result', 'parent']
      .map($)
      .find((d) => !d.hidden);
    if (!dialog) return;
    if (e.key === 'Escape' && dialog.id === 'parent') {
      closeSettings();
      return;
    }
    if (e.key !== 'Tab') return;
    const buttons = [...dialog.querySelectorAll('button,select')].filter(
      (b) => !b.disabled && !b.hidden
    );
    const first = buttons[0],
      last = buttons.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  window.addEventListener('pagehide', cancelTimers);
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      syncSound();
      launch(begin);
    }
  });
  launch(begin);
}
