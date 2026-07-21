import { create } from 'zustand';

interface PlayerState {
  id: string;
  nickname: string;
  position: [number, number, number];
}

interface GameStore {
  nickname: string;
  placeId: string;
  viewMode: '2D' | '3D';
  players: Record<string, PlayerState>;
  joystickInput: { x: number; y: number }; // 👈 조이스틱 입력값 추가 (x: -1~1, y: -1~1)
  setNickname: (nickname: string) => void;
  setPlaceId: (placeId: string) => void;
  setViewMode: (mode: '2D' | '3D') => void;
  setJoystickInput: (input: { x: number; y: number }) => void; // 👈 함수 추가
  updatePlayerPosition: (id: string, pos: [number, number, number]) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  nickname: '',
  placeId: '',
  viewMode: '3D',
  players: {},
  joystickInput: { x: 0, y: 0 },
  setNickname: (nickname) => set({ nickname }),
  setPlaceId: (placeId) => set({ placeId }),
  setViewMode: (viewMode) => set({ viewMode }),
  setJoystickInput: (joystickInput) => set({ joystickInput }),
  updatePlayerPosition: (id, pos) =>
    set((state) => ({
      players: {
        ...state.players,
        [id]: { ...state.players[id], position: pos },
      },
    })),
}));
