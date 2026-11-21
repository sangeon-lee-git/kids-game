'use strict';
const animals = [
  ['rabbit', '🐰', '토끼', '👂', '🥕', '귀가 길고 당근을 좋아해.'],
  ['cat', '🐱', '고양이', '🐾', '〰️', '야옹 하고 울고 수염이 있어.'],
  ['duck', '🦆', '오리', '🪶', '🌊', '꽥꽥 울고 물에서 헤엄쳐.'],
  ['elephant', '🐘', '코끼리', '👃', '👂', '코가 길고 귀가 아주 커.'],
  ['cow', '🐮', '소', '🌱', '🥛', '음매 하고 울고 우유를 줘.'],
  ['bee', '🐝', '꿀벌', '🌼', '🍯', '붕붕 날며 꽃에서 꿀을 모아.'],
].map(([key, icon, label, first, second, text]) => ({
  key,
  icon,
  label,
  first,
  second,
  text,
  voice: [key, text],
}));
const activity = {
  question: '힌트를 보고 누구인지 찾아봐.',
  voice: 'clues',
  deck: () => Park.shuffled(animals),
  show(q, { board, el, choices }) {
    const clues = el('div', 'clues'),
      icons = el('div', 'clue-icons');
    icons.setAttribute('aria-hidden', 'true');
    icons.append(
      el('span', 'clue-tile', q.first),
      el('span', 'clue-tile', q.second)
    );
    clues.append(icons, el('p', 'clue-words', q.text));
    board.append(clues);
    choices(
      Park.shuffled([
        q,
        ...Park.shuffled(animals.filter((a) => a.key !== q.key)).slice(0, 2),
      ]),
      q.key
    );
  },
};
