export type Fish = {
  id: string;
  name: string;
  image: string;
  /** 이 물고기가 나타나는 수심 구간. 클수록 깊다. */
  zone: number;
  /** 헤엄치는 기본 속도(px/s). 0이면 움직이지 않는 수집물(바위, 해초)이다. */
  speed: number;
  /** 그림과 부딪히는 범위의 가로 길이 배율. 보통 물고기가 1이다. */
  length: number;
  /** 부딪히는 범위의 세로 길이 배율. 보통 물고기가 1이다. */
  height: number;
};

export const FISH: readonly Fish[] = [
  { id: "orange", name: "주황 물고기", image: "/fish/fish_orange.png", zone: 0, speed: 30, length: 1, height: 1 },
  { id: "pink", name: "분홍 물고기", image: "/fish/fish_pink.png", zone: 0, speed: 60, length: 1, height: 1 },
  { id: "rock-a", name: "둥근 바위", image: "/fish/rock_a.png", zone: 0, speed: 0, length: 1, height: 1.2 },
  { id: "seaweed-green", name: "초록 해초", image: "/fish/seaweed_green_a.png", zone: 0, speed: 0, length: 1, height: 2 },
  { id: "blue", name: "파랑 물고기", image: "/fish/fish_blue.png", zone: 1, speed: 50, length: 1, height: 1 },
  { id: "green", name: "초록 물고기", image: "/fish/fish_green.png", zone: 1, speed: 35, length: 1, height: 1 },
  { id: "red", name: "빨강 물고기", image: "/fish/fish_red.png", zone: 1, speed: 90, length: 1, height: 1 },
  { id: "orange-long", name: "주황 긴 물고기", image: "/fish/fish_orange_long.png", zone: 1, speed: 95, length: 2, height: 1 },
  { id: "green-long", name: "초록 긴 물고기", image: "/fish/fish_green_long.png", zone: 1, speed: 80, length: 2, height: 1 },
  { id: "rock-b", name: "뾰족한 바위", image: "/fish/rock_b.png", zone: 1, speed: 0, length: 1, height: 1.2 },
  { id: "seaweed-pink", name: "분홍 해초", image: "/fish/seaweed_pink_b.png", zone: 1, speed: 0, length: 1, height: 2 },
  { id: "brown", name: "갈색 물고기", image: "/fish/fish_brown.png", zone: 2, speed: 45, length: 1, height: 1 },
  { id: "grey", name: "회색 물고기", image: "/fish/fish_grey.png", zone: 2, speed: 70, length: 1, height: 1 },
  { id: "grey-long", name: "회색 긴 물고기", image: "/fish/fish_grey_long.png", zone: 2, speed: 100, length: 2, height: 1 },
  { id: "blue-long", name: "파랑 긴 물고기", image: "/fish/fish_blue_long.png", zone: 2, speed: 110, length: 2, height: 1 },
  { id: "pink-long", name: "분홍 긴 물고기", image: "/fish/fish_pink_long.png", zone: 2, speed: 105, length: 2, height: 1 },
  { id: "red-long", name: "빨강 긴 물고기", image: "/fish/fish_red_long.png", zone: 2, speed: 130, length: 2, height: 1 },
  { id: "seaweed-orange", name: "주황 해초", image: "/fish/seaweed_orange_a.png", zone: 2, speed: 0, length: 1, height: 2 },
  { id: "orange-skeleton", name: "주황 뼈다귀", image: "/fish/fish_orange_skeleton.png", zone: 3, speed: 60, length: 1, height: 1 },
  { id: "pink-skeleton", name: "분홍 뼈다귀", image: "/fish/fish_pink_skeleton.png", zone: 3, speed: 80, length: 1, height: 1 },
  { id: "blue-skeleton", name: "파랑 뼈다귀", image: "/fish/fish_blue_skeleton.png", zone: 3, speed: 100, length: 1, height: 1 },
  { id: "green-skeleton", name: "초록 뼈다귀", image: "/fish/fish_green_skeleton.png", zone: 3, speed: 120, length: 1, height: 1 },
  { id: "red-skeleton", name: "빨강 뼈다귀", image: "/fish/fish_red_skeleton.png", zone: 3, speed: 140, length: 1, height: 1 },
];
