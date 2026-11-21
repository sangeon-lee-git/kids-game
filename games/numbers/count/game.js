'use strict';
const activity = {
  question: '별이 몇 개인지 세어 봐.',
  voice: 'count',
  deck: () => Park.shuffled([1, 2, 3, 4, 5]),
  show(count, { board, feedback, el, choices, numbers }) {
    let touched = 0;
    for (let i = 0; i < count; i++) {
      const star = el('button', 'count-star', '★');
      star.setAttribute('aria-label', i + 1 + '번째 별 세기');
      star.setAttribute('aria-pressed', 'false');
      star.onclick = () => {
        if (star.classList.contains('counted')) return;
        touched++;
        star.classList.add('counted');
        star.setAttribute('aria-pressed', 'true');
        star.append(el('small', '', String(touched)));
        Park.tone([392 * Math.pow(1.122, touched)]);
        feedback.textContent = ['', '하나!', '둘!', '셋!', '넷!', '다섯!'][
          touched
        ];
      };
      board.append(star);
    }
    choices(numbers(count, 5), count);
  },
};
