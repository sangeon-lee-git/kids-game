'use strict';

// Load this file before park.js. Paths stay relative to this folder so the
// character collection can be reused from pages at any directory depth.
const CharacterCatalog = (() => {
  const base = new URL('./', document.currentScript.src);
  const image = (file) => new URL(file, base).href;

  return {
    jeongwon: {
      name: '정원이',
      image: image('jeongwon.png'),
      pet: '토끼',
      petImage: image('rabbit.png'),
      colors: {
        border: '#bce6f3',
        backgroundLight: '#d3eff4',
        backgroundDark: '#95c0d4',
        text: '#273452',
      },
    },
    dogyeom: {
      name: '도겸이',
      image: image('dogyeom.png'),
      pet: '강아지',
      petImage: image('puppy.png'),
      colors: {
        border: '#ffddb3',
        backgroundLight: '#fff0d5',
        backgroundDark: '#f3bb91',
        text: '#593743',
      },
    },
  };
})();
