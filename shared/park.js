'use strict';

const Park = (() => {
  const base = new URL('../', document.currentScript.src);
  const url = (path) => new URL(path, base).href;
  const characters = CharacterCatalog;
  const areas = {
    hangul: { name: '한글', symbol: '가', color: '#ffabbb' },
    numbers: { name: '숫자', symbol: '3', color: '#ffcb7b' },
    inference: { name: '추론', symbol: '✦', color: '#97ded4' },
    thinking: { name: '사고력', symbol: '◆', color: '#c5b4ff' },
  };
  const games = [
    {
      id: 'battle',
      area: 'hangul',
      name: '숲속 별빛 대전',
      description: '한글을 골라 별빛 마법을 쏴요.',
      skill: '글자 익히기',
    },
    {
      id: 'pairs',
      area: 'hangul',
      name: '한글 짝꿍 카드',
      description: '그림과 첫 글자가 같은 짝을 찾아요.',
      skill: '짝 기억하기',
    },
    {
      id: 'count',
      area: 'numbers',
      name: '반짝별 세기',
      description: '별을 하나씩 톡톡 눌러 세어요.',
      skill: '수 세기',
    },
    {
      id: 'train',
      area: 'numbers',
      name: '칙칙폭폭 숫자 기차',
      description: '비어 있는 기차 칸에 숫자를 태워요.',
      skill: '수의 순서',
    },
    {
      id: 'pattern',
      area: 'inference',
      name: '알록달록 꽃길',
      description: '반복되는 꽃길의 다음 모양을 찾아요.',
      skill: '규칙 찾기',
    },
    {
      id: 'detective',
      area: 'inference',
      name: '꼬마 동물 탐정',
      description: '두 가지 단서를 듣고 동물을 찾아요.',
      skill: '단서 듣기',
    },
    {
      id: 'basket',
      area: 'thinking',
      name: '쏙쏙 바구니',
      description: '함께 담을 물건을 골라요.',
      skill: '분류하기',
    },
    {
      id: 'trail',
      area: 'thinking',
      name: '별 보물 길찾기',
      description: '발판을 따라 별까지 한 칸씩 걸어요.',
      skill: '공간 탐색',
    },
  ];
  const session = new Map();
  function read(key) {
    try {
      return localStorage.getItem('kids-park.' + key) ?? session.get(key);
    } catch {
      return session.get(key);
    }
  }
  function write(key, value) {
    session.set(key, value);
    try {
      localStorage.setItem('kids-park.' + key, value);
    } catch {}
  }
  function shuffled(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  const gameUrl = (game, hero) =>
    url('games/' + game.area + '/' + game.id + '/index.html?hero=' + hero);
  const homeUrl = (area) => url('index.html#' + area);
  const heroId = new URLSearchParams(location.search).get('hero');
  const hero = Object.hasOwn(characters, heroId) ? heroId : 'jeongwon';
  const rememberedSound = () => read('sound') !== 'off';
  let clip,
    generation = 0,
    context;
  function hush() {
    generation++;
    if (clip) {
      clip.pause();
      clip = null;
    }
    window.speechSynthesis?.cancel();
  }
  function voiceChoice() {
    const value = read('voice');
    return ['sohee', 'classic', 'device'].includes(value) ? value : 'sohee';
  }
  function narrate(lines, { voice = voiceChoice(), preview = false } = {}) {
    hush();
    if (!preview && !rememberedSound()) return;
    const token = generation;
    function play(i) {
      if (i >= lines.length || token !== generation) return;
      const [key, words, group = 'park'] = lines[i];
      const path = group + '/' + key;
      function device(onError) {
        if (token !== generation || !window.speechSynthesis) return;
        const u = new SpeechSynthesisUtterance(
          voice === 'classic' ? words : SoheeLines[path] || words
        );
        u.lang = 'ko-KR';
        u.rate = 0.96;
        const korean = window.speechSynthesis
          .getVoices()
          .filter((v) => /^ko(?:-|$)/i.test(v.lang));
        u.voice =
          korean.find((v) =>
            /Natural|Neural|Premium|Enhanced|SunHi|Google/i.test(v.name)
          ) ||
          korean[0] ||
          null;
        u.onend = () => play(i + 1);
        if (onError)
          u.onerror = () => {
            if (token === generation) onError();
          };
        window.speechSynthesis.speak(u);
      }
      function recording(prefix, fallback) {
        if (token !== generation) return;
        const audio = new Audio(url('shared/voice/' + prefix + path + '.ogg'));
        clip = audio;
        audio.onended = () => play(i + 1);
        audio.play().catch(() => {
          if (token === generation) fallback();
        });
      }
      const classic = () => recording('', () => device());
      if (voice === 'device' && window.speechSynthesis) {
        device(() => recording('', () => {}));
      } else if (voice === 'sohee' && Object.hasOwn(SoheeLines, path)) {
        recording('sohee/', classic);
      } else classic();
    }
    play(0);
  }
  function tone(notes = [523, 784]) {
    if (!rememberedSound()) return;
    try {
      context ||= new (window.AudioContext || window.webkitAudioContext)();
      if (context.state === 'suspended') context.resume().catch(() => {});
      notes.forEach((note, i) => {
        const osc = context.createOscillator(),
          gain = context.createGain();
        const t = context.currentTime + i * 0.095;
        osc.type = 'sine';
        osc.frequency.value = note;
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.1, t + 0.014);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.23);
        osc.connect(gain);
        gain.connect(context.destination);
        osc.start(t);
        osc.stop(t + 0.25);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
      });
    } catch {}
  }
  function soundButton(button, onEnable) {
    function paint() {
      button.textContent = rememberedSound() ? '♫  소리 켜짐' : '♪  소리 꺼짐';
      button.setAttribute('aria-pressed', String(rememberedSound()));
    }
    paint();
    button.onclick = () => {
      const enabled = !rememberedSound();
      write('sound', enabled ? 'on' : 'off');
      hush();
      paint();
      if (enabled) {
        tone();
        onEnable?.();
      }
    };
    window.addEventListener('pageshow', paint);
  }
  window.addEventListener('pagehide', hush);
  return {
    url,
    characters,
    areas,
    games,
    read,
    write,
    shuffled,
    gameUrl,
    homeUrl,
    hero,
    rememberedSound,
    narrate,
    voiceChoice,
    hush,
    tone,
    soundButton,
  };
})();
