'use strict';
const routes = [
  [0, 1, 4],
  [3, 4, 5],
  [6, 3, 4, 5],
  [2, 5, 4, 7],
  [8, 7, 4, 3],
  [0, 3, 6, 7],
  [7, 4, 1, 2],
];
const directions = [
  { key: -3, icon: '⬆', label: '위' },
  { key: 3, icon: '⬇', label: '아래' },
  { key: -1, icon: '⬅', label: '왼쪽' },
  { key: 1, icon: '➡', label: '오른쪽' },
];
const activity = {
  question: '별까지 가려면 어느 쪽으로 갈까?',
  voice: 'path',
  deck: () => Park.shuffled(routes),
  show(route, { board, feedback, el, choices, success, optionalHint, hero }) {
    const grid = el('div', 'path-grid');
    let step = 0;
    board.append(grid);
    const position = (n) =>
      Math.floor(n / 3) + 1 + '행 ' + ((n % 3) + 1) + '열';
    function paint() {
      grid.replaceChildren();
      for (let n = 0; n < 9; n++) {
        const cell = el('div', 'path-cell');
        if (route.includes(n)) cell.classList.add('road');
        if (n === route[step]) {
          const img = el('img');
          img.src = hero.image;
          img.alt = hero.name;
          cell.append(img);
        } else if (n === route.at(-1)) {
          cell.classList.add('goal');
          cell.textContent = '★';
        } else
          cell.textContent = route.includes(n)
            ? route.indexOf(n) < step
              ? '·'
              : '◆'
            : '✿';
        grid.append(cell);
      }
      grid.setAttribute('role', 'img');
      grid.setAttribute(
        'aria-label',
        hero.name +
          '의 위치 ' +
          position(route[step]) +
          '. 남은 길 ' +
          route
            .slice(step + 1)
            .map(position)
            .join(', ')
      );
    }
    paint();
    choices(directions, route[1] - route[0], () => {
      step++;
      paint();
      Park.tone([523 + step * 50]);
      if (step === route.length - 1) {
        success();
        return;
      }
      optionalHint(route[step + 1] - route[step]);
      feedback.textContent = '한 칸 왔어! 다음 발판으로 가자.';
    });
  },
};
