"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("@sern/handler");
const discord_js_1 = require("discord.js");
const player_1 = require("../player");
const publish_1 = require("../plugins/publish");
exports.default = (0, handler_1.commandModule)({
    options: [
        {
            name: "volume",
            description: "eeee",
            type: discord_js_1.ApplicationCommandOptionType.Number,
            min_value: 0,
            max_value: 200,
            required: true
        }
    ],
    description: "e",
    plugins: [(0, publish_1.publish)()],
    type: handler_1.CommandType.Slash,
    execute: async (ctx, [, args]) => {
        const player = player_1.playerManager.find(ctx.guildId);
        if (!player) {
            return await ctx.reply("Nie jestem połączony z kanałem");
        }
        const volume = args.getNumber("volume", true);
        const sucess = player.setVolume(volume);
        if (!sucess)
            return ctx.reply("ustawianie głośności nie powiodło sie");
        ctx.reply(`Głośność ustawiona na ${volume}`);
    }
});
