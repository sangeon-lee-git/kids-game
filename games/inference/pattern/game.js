'use strict';
const flowers = {
  '🌷': '튤립',
  '🌻': '해바라기',
  '🍀': '클로버',
  '🍓': '딸기',
  '🍄': '버섯',
  '🦋': '나비',
  '🌼': '들꽃',
};
const activity = {
  question: '다음에는 무엇이 올까?',
  voice: 'pattern',
  deck() {
    return Park.shuffled([
      ['🌷', '🌻'],
      ['🍓', '🍀'],
      ['🍄', '🌼'],
      ['🌷', '🦋'],
      ['🦋', '🍀'],
      ['🌼', '🍓'],
    ]).map(([a, b], i) =>
      i < 3
        ? { row: [a, b, a, b], answer: a }
        : { row: [a, a, b, a, a], answer: b }
    );
  },
  show(q, { board, el, choices, success }) {
    for (const icon of q.row) {
      const tile = el('span', 'tile', icon);
      tile.setAttribute('aria-label', flowers[icon]);
      board.append(tile);
    }
    const empty = el('span', 'tile empty', '?');
    board.append(empty);
    const options = Park.shuffled([...new Set(q.row)]).map((icon) => ({
      key: icon,
      icon,
      label: flowers[icon],
    }));
    choices(options, q.answer, (selected) => {
      empty.textContent = selected.icon;
      empty.classList.remove('empty');
      success();
    });
  },
};
