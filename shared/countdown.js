'use strict';

const ParkCountdown = (() => {
  const game = Park.games.find(
    (item) => item.id === document.body.dataset.game
  );
  const hero = Park.characters[Park.hero];
  const curtain = document.createElement('dialog');
  curtain.className = 'scene-curtain';
  curtain.setAttribute('aria-labelledby', 'sceneLabel');
  curtain.innerHTML =
    '<button type="button" id="sceneCancel" autofocus>← 돌아가기</button>' +
    '<div class="scene-load"><img id="sceneAvatar" alt="">' +
    '<p class="stage-tag" id="sceneStage"></p>' +
    '<div class="scene-count" id="sceneCount" role="status" aria-live="polite"></div>' +
    '<div class="scene-label" id="sceneLabel"></div></div>';
  document.body.append(curtain);
  const avatar = document.getElementById('sceneAvatar');
  avatar.src = hero.image;
  avatar.alt = hero.name;
  document.getElementById('sceneLabel').textContent = game.name;
  const stageTag = document.getElementById('sceneStage');
  const count = document.getElementById('sceneCount');

  const stepMs = 1000;
  const goMs = 800;
  const steps = ['2', '1', '출발!'];
  let timers = [];
  function stopTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }
  function leave() {
    stopTimers();
    location.assign(Park.homeUrl(game.area));
  }
  document.getElementById('sceneCancel').onclick = leave;
  curtain.addEventListener('cancel', (event) => {
    event.preventDefault();
    leave();
  });
  window.addEventListener('pagehide', stopTimers);

  function show(stage, onReady) {
    stopTimers();
    Park.hush();
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    stageTag.textContent = stage;
    count.textContent = reduced ? '출발!' : '3';
    if (!curtain.open) curtain.showModal();
    if (!reduced) {
      steps.forEach((label, index) => {
        timers.push(
          setTimeout(
            () => {
              count.textContent = label;
              Park.tone([392]);
            },
            (index + 1) * stepMs
          )
        );
      });
    }
    timers.push(
      setTimeout(
        () => {
          stopTimers();
          curtain.close();
          onReady();
        },
        reduced ? goMs : steps.length * stepMs + goMs
      )
    );
  }
  return {
    show,
    get showing() {
      return curtain.open;
    },
  };
})();
