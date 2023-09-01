import {
  PlayerManager,
} from "discord-player-plus";

export const playerManager = new PlayerManager({
  playerDefault: {
    initialVolume: 100
  }
});
