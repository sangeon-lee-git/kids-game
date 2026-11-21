# 별빛 놀이공원 개발 인수인계

2026년 11월 21일 기준. 정원이와 도겸이가 함께하는 50개월 아이용 HTML 학습 게임 모음이다. 다음 작업은 `kids-game`의 `main`에서 시작한다.

| 항목 | 위치 |
| --- | --- |
| 게임 바로 실행 | [GitHub Pages](https://sangeon-lee-git.github.io/kids-game/) |
| 소스 저장소 | [sangeon-lee-git/kids-game](https://github.com/sangeon-lee-git/kids-game) |
| 지정한 Windows 작업 사본 | `D:\workspace\hangul-game\kids-game` |
| 배포 방식 | GitHub Pages가 `main` 브랜치의 루트 `/`를 게시한다. 빌드 단계는 없다. |
| 이전 한글 게임 | [test 저장소](https://github.com/sangeon-lee-git/test)에서 대전과 짝꿍 카드를 가져왔다. 새 기능은 위의 작업 사본에 반영한다. |

## 지금 이어받을 작업

- **게시된 기능** — [첫 게임 배포 커밋](https://github.com/sangeon-lee-git/kids-game/commit/3f36e7286ff100fd4b1550a47b6ace0864e60862)에 네 구역, 여덟 게임, 캐릭터 두 명과 애착인형이 들어 있다. 이 버전은 Supertonic F1 안내를 재생한다.
- **로컬에서 준비한 기능** — 기본 화자를 Qwen3-TTS의 한국어 소희로 바꾸고, 첫 화면에서 소희·기존 F1·기기 음성을 비교할 수 있도록 연결했다. 한국어 안내 62개를 생성했고, 그림 문제와 완료 인사의 문장을 다듬었다. 새 음성 전체는 아직 공개 게임에 반영하기 전이다.
- **다음 실행 순서** — 수정한 녹음과 대본이 일치하는지 확인한다. 음량을 맞춘 Ogg 파일과 대본 목록을 함께 반영한다. 아래 검증을 완료하고 `main`에 푸시한 뒤 Pages 성공 여부와 공개 주소의 ‘목소리’ 메뉴를 확인한다.

## 놀이 흐름과 공통 캐릭터

처음 입장하면 놀이공원 배경 위로 `아빠's make`가 잠깐 흐른다. 아이가 **구역 → 게임 입장권 → 친구**를 고르면 해당 게임이 열린다. ‘놀이 고르기’로 돌아가면 방금 선택한 구역이 다시 열린다.

| 친구 | 애착인형 | 공통 그림 파일 |
| --- | --- | --- |
| 정원이 | 토끼 | `shared/characters/jeongwon.png`, `rabbit.png` |
| 도겸이 | 강아지 | `shared/characters/dogyeom.png`, `puppy.png` |

[공통 설정](shared/park.js)의 `characters`가 이름과 두 이미지 경로를 묶는다. 게임 주소의 `?hero=jeongwon` 또는 `?hero=dogyeom`을 읽어 캐릭터와 인형을 함께 표시한다. 캐릭터를 고치면 친구 선택 화면, 게임 화면, 결과 화면을 함께 확인한다.

## 게임별 수정 위치

각 폴더의 `index.html`이 실행 진입점이고 `game.js`가 문제와 규칙을 담당한다.

| 구역 | 게임 | 아이가 하는 일 | 소스 |
| --- | --- | --- | --- |
| 한글 | 숲속 별빛 대전 | 같은 글자나 그림의 첫 글자를 골라 마법을 쏜다. | [battle](games/hangul/battle/) |
| 한글 | 한글 짝꿍 카드 | 글자 카드와 그 글자로 시작하는 그림 카드를 짝짓는다. | [pairs](games/hangul/pairs/) |
| 숫자 | 반짝별 세기 | 별을 톡톡 눌러 1부터 5까지 센다. | [count](games/numbers/count/) |
| 숫자 | 칙칙폭폭 숫자 기차 | 앞뒤 숫자를 보고 빈 칸을 채운다. | [train](games/numbers/train/) |
| 추론 | 알록달록 꽃길 | 반복되는 모양의 다음 칸을 고른다. | [pattern](games/inference/pattern/) |
| 추론 | 꼬마 동물 탐정 | 두 가지 단서를 듣고 동물을 맞힌다. | [detective](games/inference/detective/) |
| 사고력 | 쏙쏙 바구니 | 예시와 같은 무리에 속한 물건을 고른다. | [basket](games/thinking/basket/) |
| 사고력 | 별 보물 길찾기 | 방향을 눌러 발판을 따라 별까지 걷는다. | [trail](games/thinking/trail/) |

- **메인 화면** — [index.html](index.html), [shared/lobby.js](shared/lobby.js), [shared/park.css](shared/park.css)가 구역, 입장권, 캐릭터 선택을 표시한다.
- **숫자·추론·사고력 게임** — [shared/play.js](shared/play.js)가 문제 진행, 힌트, 별 다섯 개 보상, 재시작을 담당한다. 게임별 `activity`가 문제 목록과 화면 동작을 제공한다.
- **한글 게임** — [shared/hangul](shared/hangul/)에 단어 목록, 보호자 설정, 카운트다운과 공통 스타일이 있다. 타격·방어는 대전 폴더에서, 카드 뒤집기와 짝 판정은 짝꿍 카드 폴더에서 수정한다.

## 게임을 추가할 때

1. `games/<구역>/<게임 ID>/`에 `index.html`과 `game.js`를 만든다. 공통 진행 화면을 쓰는 새 게임은 [숫자 기차](games/numbers/train/game.js)의 `activity.deck()`과 `activity.show()`를 참고한다.
2. [shared/park.js](shared/park.js)의 `games` 배열에 ID, 구역, 한국어 이름, 놀이 설명과 학습 항목을 등록한다. [shared/lobby.js](shared/lobby.js)의 `artPieces`에 같은 ID로 입장권 그림을 연결한다.
3. 시간제한이나 오답 감점 없이 다시 고를 수 있게 한다. 진행·소리·완료 도장은 기존 공통 처리를 사용한다. 게임 수가 바뀌면 첫 화면의 도장 총수도 확인한다.
4. 캐릭터 두 명으로 각각 시작해 실제 게임 주소, 애착인형, 완료와 다시 시작, 놀이 선택 복귀를 확인한다.

## 음성 파일 관리

기존 F1 음성은 `shared/voice/hangul/`의 한글 46개와 `shared/voice/park/`의 공통 안내·단서 16개다. 한글 문제 문장과 파일 이름의 대응은 [shared/hangul/words.js](shared/hangul/words.js)에 있다.

소희 음성은 `shared/voice/sohee/` 아래 같은 키의 Ogg를 사용한다. `lines.js`는 실제로 읽은 한국어 대본을 담는다. 예를 들어 숫자 세기 키는 `park/count`이고 파일은 `park/count.ogg`다. 문장을 변경할 때는 대본과 녹음을 함께 갱신한다. 게임에는 생성한 음성을 넣으며 별도 API 키 없이 재생된다. [소희 모델](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice) · [F1 모델](https://huggingface.co/supertone-oss-archive/supertonic-3)

## 로컬 검증과 배포

Windows에서 아래 명령을 실행한 뒤 [로컬 첫 화면](http://localhost:8000/)을 연다. 다른 PC에서는 이 저장소를 복제한 폴더가 기준이다.

```powershell
cd D:\workspace\hangul-game\kids-game
git status -sb
python -m http.server 8000
```

| 검증 항목 | 확인할 동작 |
| --- | --- |
| 선택과 이동 | 네 구역마다 입장권 두 개가 보인다. 게임을 먼저 고른 뒤 두 친구 중 하나로 출발할 수 있다. |
| 학습 규칙 | 오답 뒤에 다시 고를 수 있다. 대전은 정답·오답에 공격·방어가 구분되고, 카드는 그림과 글자를 짝지어야 완료된다. |
| 소리 | 같은 문장으로 목소리를 비교한다. 선택을 저장하고 게임에 들어가 다시 듣기와 소리 끄기를 확인한다. |
| 저장과 복귀 | 완료 후 다시 놀 수 있다. 메인으로 돌아오면 해당 입장권에 완료 도장이 표시된다. |
| 화면 크기 | PC와 작은 세로 화면에서 선택지, 캐릭터 이름과 애착인형이 겹치지 않는지 본다. |
| 실제 배포 | `git push origin main` 후 [Actions](https://github.com/sangeon-lee-git/kids-game/actions)에서 해당 커밋의 Pages 배포 성공을 확인한다. 공개 주소에서 변경한 화면을 한 번 더 연다. |
