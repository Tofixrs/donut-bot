"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerManager = void 0;
const discord_player_plus_1 = require("discord-player-plus");
exports.playerManager = new discord_player_plus_1.PlayerManager({
    playerDefault: {
        initialVolume: 100
    }
});
