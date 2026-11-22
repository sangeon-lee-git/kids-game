# 정원이와 도겸이의 별빛 놀이공원

[놀이터 입장](https://sangeon-lee-git.github.io/kids-game/)

[다음 작업을 위한 개발 인수인계](HANDOFF.md)

50개월 아이가 게임을 고르고 정원이 또는 도겸이와 함께 노는 한국어 놀이공원입니다. 첫 입장 때 `아빠's make`가 잠깐 흘러갑니다. 동작 줄이기를 켠 기기에서는 이동 효과를 생략합니다.

## Git 작업 절차

새 변경은 `main`에서 바로 수정하지 않고 작업별 브랜치에서 진행합니다. 시작 전에 `git status -sb`로 기존 수정을 확인하세요. 공유 작업 사본에 다른 작업의 미커밋 변경이 있으면 별도 worktree를 사용해 그대로 보존합니다.

```powershell
$taskName = 'character-animation' # 작업에 맞게 변경
git fetch origin main
git worktree add -b "work/$taskName" "../kids-game-$taskName" origin/main
cd "../kids-game-$taskName"
git status -sb
```

작업 브랜치에서 기획 검토, 구현, 검증, 커밋을 마친 뒤 브랜치를 푸시하고 PR 또는 검토된 병합으로 `main`에 반영합니다. GitHub Pages는 `main`을 게시하므로 병합 후 [Actions](https://github.com/sangeon-lee-git/kids-game/actions)에서 배포 결과를 확인합니다. 다른 작업의 변경은 함께 커밋하지 않습니다. Codex 작업 규칙은 [AGENTS.md](AGENTS.md)에 있습니다.

## 게임별 기획서

게임 이름을 누르면 놀이 목표, 실제 문제 예시, 힌트와 완료 조건, 검토할 장면을 볼 수 있습니다. 새 기능과 규칙 변경은 해당 기획서를 먼저 수정하고 사용자 검토 후 구현합니다. [기획 검토와 구현 순서](HANDOFF.md#기획-검토와-구현-순서)

| 구역 | 기획서 | 게임 폴더 |
| --- | --- | --- |
| 한글 | [숲속 별빛 대전](games/hangul/battle/DESIGN.md) | [battle](games/hangul/battle/) |
| 한글 | [한글 짝꿍 카드](games/hangul/pairs/DESIGN.md) | [pairs](games/hangul/pairs/) |
| 숫자 | [반짝별 세기](games/numbers/count/DESIGN.md) | [count](games/numbers/count/) |
| 숫자 | [칙칙폭폭 숫자 기차](games/numbers/train/DESIGN.md) | [train](games/numbers/train/) |
| 추론 | [알록달록 꽃길](games/inference/pattern/DESIGN.md) | [pattern](games/inference/pattern/) |
| 추론 | [꼬마 동물 탐정](games/inference/detective/DESIGN.md) | [detective](games/inference/detective/) |
| 사고력 | [쏙쏙 바구니](games/thinking/basket/DESIGN.md) | [basket](games/thinking/basket/) |
| 사고력 | [별 보물 길찾기](games/thinking/trail/DESIGN.md) | [trail](games/thinking/trail/) |

## 공통 캐릭터와 게임 관리

[shared/park.js](shared/park.js)에서 캐릭터, 각자의 애착인형, 놀이 목록과 경로를 관리합니다. 정원이는 토끼 인형, 도겸이는 강아지 인형을 데리고 갑니다. 모든 그림은 [shared/characters](shared/characters/)에 한 번씩 저장합니다.

각 게임 폴더에는 바로 열 수 있는 `index.html`과 해당 게임의 문제·규칙을 담은 `game.js`가 있습니다. 여섯 새 게임은 [공통 진행 화면](shared/play.js)을 사용합니다. 이전 [한글 놀이터](https://github.com/sangeon-lee-git/test)에서 옮겨온 두 한글 게임은 전투·카드 규칙을 각각 관리하고 음성, 보호자 설정과 장면 전환을 공유합니다.

## 실행과 배포

루트의 `index.html`에서 시작합니다. 전체 저장소를 내려받아 같은 폴더 구조로 보관하면 로컬에서도 열 수 있습니다. 로컬 서버로 확인하려면 저장소 루트에서 `python -m http.server 8000`을 실행하고 브라우저에서 `http://localhost:8000/`을 여세요. GitHub Pages 배포 대상은 `main` 브랜치의 루트입니다.

시간제한과 오답 감점은 없습니다. 소리 설정과 완료한 놀이 도장은 브라우저의 로컬 저장소에 기록합니다.

## 음성과 글꼴

첫 화면의 **목소리**에서 같은 문장을 미리 듣고 여덟 게임에 쓸 목소리를 고릅니다. 기본값은 Qwen3-TTS 1.7B의 한국어 화자 소희이며, 기존 녹음보다 2반음 높였습니다. 같은 모델의 Vivian도 선택할 수 있습니다. Vivian은 한국어 대사를 경쾌하게 생성하고 1반음과 약한 고음역 보정을 더했습니다. 한글 안내와 칭찬은 아이에게 건네는 문장으로 다시 썼습니다. 게임은 미리 생성한 Ogg 파일을 재생하며, 두 화자의 실제 대사는 [음성 대본](shared/voice/sohee/lines.js)을 공유합니다. [Qwen3-TTS 모델 · Apache 2.0](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice)

기존 목소리 F1도 선택할 수 있습니다. 한글 안내 46개와 새 놀이·동물 단서 16개를 Supertonic 3 F1으로 생성했습니다. 모델 revision은 `aafc6e32416a594460b32413efc49d7fe4ce6d46`입니다. 기기 한국어 음성을 선택하면 운영체제 또는 브라우저의 음성 서비스를 사용합니다. [Supertonic 공식 코드 · MIT](https://github.com/supertone-oss-archive/supertonic) · [F1 모델 · OpenRAIL-M](https://huggingface.co/supertone-oss-archive/supertonic-3)

놀이공원 제목과 버튼은 주아체를 사용합니다. [글꼴 라이선스](shared/font/OFL.txt)
