# 공통 캐릭터

이 폴더는 정원이와 도겸이의 그림, 애착인형 그림, 이름, 친구 선택 화면 색상을 관리한다. 캐릭터 정보는 [catalog.js](catalog.js)에 있다. 게임별 코드는 `Park.characters`에서 같은 정보를 읽는다.

| ID | 이름 | 캐릭터 그림 | 인형 그림 |
| --- | --- | --- | --- |
| `jeongwon` | 정원이 | `jeongwon-3d-hugging-rabbit.png` | `rabbit.png` |
| `dogyeom` | 도겸이 | `dogyeom-3d-hugging-puppy.png` | `puppy.png` |

현재 캐릭터 그림은 인형을 안은 3D 전신 이미지다. 기존 2D 그림 `jeongwon.png`, `dogyeom.png`는 이 폴더에 보존했다. 별도 인형 그림은 게임의 작은 표시 등에 사용한다.

## 그림이나 설정 바꾸기

- 그림을 교체할 때는 파일 이름을 유지하거나 `catalog.js`의 해당 경로를 함께 수정한다.
- 이름, 인형 이름, 친구 선택 화면의 색상은 `catalog.js`에서 수정한다.
- 새 캐릭터는 고유한 영문 ID를 키로 추가한다. `name`, `image`, `pet`, `petImage`, `colors`를 모두 지정하고, 첫 화면과 게임 화면을 확인한다.
- 기본 캐릭터는 `shared/park.js`의 `hero` 설정에서 정한다. 게임 링크는 `?hero=<ID>` 형식을 사용한다.

## 다른 게임에서 사용하기

`catalog.js`와 필요한 PNG 파일을 함께 복사한다. HTML에서 `catalog.js`를 사용하는 스크립트보다 먼저 불러오면 `CharacterCatalog`를 읽을 수 있다. 이미지 URL은 `catalog.js`의 위치를 기준으로 계산되므로, HTML의 폴더 깊이와 무관하다.

```html
<script defer src="shared/characters/catalog.js"></script>
<script defer src="shared/park.js"></script>
```
