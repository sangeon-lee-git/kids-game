'use strict';
const baskets = [
  [
    '과일',
    [
      ['🍎', '사과'],
      ['🍐', '배'],
      ['🍌', '바나나'],
      ['🍇', '포도'],
    ],
  ],
  [
    '탈것',
    [
      ['🚗', '자동차'],
      ['🚂', '기차'],
      ['🚌', '버스'],
      ['🚲', '자전거'],
    ],
  ],
  [
    '옷',
    [
      ['👕', '티셔츠'],
      ['👖', '바지'],
      ['🧥', '외투'],
      ['👗', '원피스'],
    ],
  ],
  [
    '악기',
    [
      ['🥁', '북'],
      ['🎹', '피아노'],
      ['🎸', '기타'],
      ['🎺', '나팔'],
    ],
  ],
  [
    '동물',
    [
      ['🐰', '토끼'],
      ['🐶', '강아지'],
      ['🐯', '호랑이'],
      ['🐘', '코끼리'],
    ],
  ],
];
const activity = {
  question: '같은 무리의 친구를 찾아봐.',
  voice: 'basket',
  deck: () => Park.shuffled(baskets),
  show([group, items], { board, el, choices, success }) {
    const [a, b, target] = Park.shuffled(items);
    const samples = el('div', 'sample-row');
    for (const [icon, label] of [a, b]) {
      const tile = el('span', 'sample-tile', icon);
      tile.setAttribute('aria-label', label);
      samples.append(tile);
    }
    board.append(
      el('div', 'basket-caption', '🧺 ' + group + ' 바구니'),
      samples
    );
    const others = Park.shuffled(baskets.filter(([name]) => name !== group))
      .slice(0, 2)
      .map(([, list]) => Park.shuffled(list)[0]);
    const options = Park.shuffled([target, ...others]).map(([icon, label]) => ({
      key: label,
      icon,
      label,
    }));
    choices(options, target[1], (opt) => {
      samples.append(el('span', 'sample-tile', opt.icon));
      success();
    });
  },
};
