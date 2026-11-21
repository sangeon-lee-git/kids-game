'use strict';
const activity = {
  question: '빈 기차 칸에 들어갈 숫자는 뭘까?',
  voice: 'number',
  deck: () =>
    Park.shuffled([
      { start: 1, missing: 2 },
      { start: 1, missing: 3 },
      { start: 2, missing: 4 },
      { start: 2, missing: 3 },
      { start: 3, missing: 5 },
      { start: 3, missing: 4 },
    ]),
  show(q, { board, el, choices, success, numbers }) {
    board.append(el('span', 'train-icon', '🚂'));
    let empty;
    for (let n = q.start; n < q.start + 3; n++) {
      const car = el('span', 'train-car', n === q.missing ? '?' : n);
      if (n === q.missing) {
        empty = car;
        car.classList.add('empty');
      }
      board.append(car);
    }
    choices(numbers(q.missing, 5), q.missing, () => {
      empty.textContent = q.missing;
      empty.classList.remove('empty');
      success();
    });
  },
};
