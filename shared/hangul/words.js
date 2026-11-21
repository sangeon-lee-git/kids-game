'use strict';
const bank = [
  { s: '가', word: '가방', emoji: '🎒' },
  { s: '나', word: '나비', emoji: '🦋' },
  { s: '다', word: '다리', emoji: '🦵' },
  { s: '라', word: '라디오', emoji: '📻' },
  { s: '마', word: '마차', emoji: '🐴' },
  { s: '바', word: '바나나', emoji: '🍌' },
  { s: '사', word: '사과', emoji: '🍎' },
  { s: '아', word: '아기', emoji: '👶' },
  { s: '자', word: '자동차', emoji: '🚗' },
  { s: '차', word: '차', emoji: '🍵' },
  { s: '코', word: '코', emoji: '👃' },
  { s: '토', word: '토끼', emoji: '🐰' },
  { s: '포', word: '포도', emoji: '🍇' },
  { s: '하', word: '하마', emoji: '🦛' },
];
const clips = {
  '가. 같은 글자를 찾아 줘.': '83f04a6838c78fab.ogg',
  '가방. 가. 첫 글자를 찾아 줘.': '9aea33d205092786.ogg',
  '맞았어! 가! 멋지다!': '8858e23d1a995e36.ogg',
  '나. 같은 글자를 찾아 줘.': '646b974c4141f305.ogg',
  '나비. 나. 첫 글자를 찾아 줘.': '105abe40a0b6e452.ogg',
  '맞았어! 나! 멋지다!': 'a08fa76d83fe1e1f.ogg',
  '다. 같은 글자를 찾아 줘.': 'fd0945e789170ddf.ogg',
  '다리. 다. 첫 글자를 찾아 줘.': 'b310bfd9f0cbbaca.ogg',
  '맞았어! 다! 멋지다!': '1d9bdc8c0550cbb7.ogg',
  '라. 같은 글자를 찾아 줘.': '58c197d86d354010.ogg',
  '라디오. 라. 첫 글자를 찾아 줘.': 'c6aa703343c81bda.ogg',
  '맞았어! 라! 멋지다!': '258aa9685b1e1e30.ogg',
  '마. 같은 글자를 찾아 줘.': '7ea8206fa2a01649.ogg',
  '마차. 마. 첫 글자를 찾아 줘.': '313bb29920686e7d.ogg',
  '맞았어! 마! 멋지다!': '6e3014211357cfc7.ogg',
  '바. 같은 글자를 찾아 줘.': 'd856a39af2f3d313.ogg',
  '바나나. 바. 첫 글자를 찾아 줘.': '67a4f82a25da43b3.ogg',
  '맞았어! 바! 멋지다!': '4964d070c4030a76.ogg',
  '사. 같은 글자를 찾아 줘.': '86059f15780d82fb.ogg',
  '사과. 사. 첫 글자를 찾아 줘.': '3e921960d510f7eb.ogg',
  '맞았어! 사! 멋지다!': '87eb3db77d064e5d.ogg',
  '아. 같은 글자를 찾아 줘.': '22f0c89d369d910c.ogg',
  '아기. 아. 첫 글자를 찾아 줘.': 'e45a717eae17cc3a.ogg',
  '맞았어! 아! 멋지다!': '7fe513bb39978a8a.ogg',
  '자. 같은 글자를 찾아 줘.': 'a8457b4ac43f00bf.ogg',
  '자동차. 자. 첫 글자를 찾아 줘.': 'f1bb14cf89b7d7fa.ogg',
  '맞았어! 자! 멋지다!': '6a33a795b604190d.ogg',
  '차. 같은 글자를 찾아 줘.': '88b8ef86d5d6b87d.ogg',
  '차. 차. 첫 글자를 찾아 줘.': '1620bc39c936448a.ogg',
  '맞았어! 차! 멋지다!': 'e7f8b87134711f20.ogg',
  '코. 같은 글자를 찾아 줘.': 'a62c24d7e6291b8d.ogg',
  '코. 코. 첫 글자를 찾아 줘.': 'e1e364427abf0001.ogg',
  '맞았어! 코! 멋지다!': 'a5246a614fff0750.ogg',
  '토. 같은 글자를 찾아 줘.': 'a6c598623efb08da.ogg',
  '토끼. 토. 첫 글자를 찾아 줘.': '5737d479a219daad.ogg',
  '맞았어! 토! 멋지다!': '6e17819826c2dc06.ogg',
  '포. 같은 글자를 찾아 줘.': '0f2c1b5cbfde1f1c.ogg',
  '포도. 포. 첫 글자를 찾아 줘.': '2ed3cd6c8590ef1b.ogg',
  '맞았어! 포! 멋지다!': 'c2e0168b0fd58826.ogg',
  '하. 같은 글자를 찾아 줘.': '75afed38ee7610d1.ogg',
  '하마. 하. 첫 글자를 찾아 줘.': 'bec2b4e8ed38fbc0.ogg',
  '맞았어! 하! 멋지다!': '66a11e00b4dc9f35.ogg',
  '참 잘했어! 이제 잠깐 쉬자.': '510ebb1971b9d96c.ogg',
  '참 잘했어! 멋진 한글 히어로야.': '6443d8333af7eddd.ogg',
  '소리를 켰어요.': 'acb4b8e88797f9db.ogg',
  '토리와 함께 한글 마법을 시작해 볼까요?': 'dc8df76a90771a48.ogg',
};
function sfx(kind) {
  if (!sound) return;
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    audioContext = audioContext || new C();
    if (audioContext.state === 'suspended')
      audioContext.resume().catch(() => {});
    const t = audioContext.currentTime;
    const o = audioContext.createOscillator(),
      g = audioContext.createGain();
    o.connect(g);
    g.connect(audioContext.destination);
    const p =
      kind === 'impact'
        ? [150, 48, 0.22, 0.13]
        : kind === 'block'
          ? [800, 360, 0.2, 0.09]
          : [260, 1000, 0.18, 0.055];
    o.type = kind === 'impact' ? 'triangle' : 'sine';
    o.frequency.setValueAtTime(p[0], t);
    o.frequency.exponentialRampToValueAtTime(p[1], t + p[2]);
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(p[3], t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, t + p[2]);
    o.start(t);
    o.stop(t + p[2] + 0.01);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
    if (kind === 'impact') {
      const b = audioContext.createBuffer(
          1,
          Math.floor(audioContext.sampleRate * 0.1),
          audioContext.sampleRate
        ),
        d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++)
        d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const n = audioContext.createBufferSource(),
        ng = audioContext.createGain();
      ng.gain.value = 0.045;
      n.buffer = b;
      n.connect(ng);
      ng.connect(audioContext.destination);
      n.start(t);
      n.onended = () => {
        n.disconnect();
        ng.disconnect();
      };
    }
  } catch (e) {
    /* Effects are optional on older browsers. */
  }
}
