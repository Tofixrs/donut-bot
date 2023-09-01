"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("@sern/handler");
const discord_js_1 = require("discord.js");
const player_1 = require("../player");
const discord_player_plus_1 = require("discord-player-plus");
const publish_1 = require("../plugins/publish");
exports.default = (0, handler_1.commandModule)({
    type: handler_1.CommandType.Slash,
    options: [
        {
            name: "query",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            description: "dodaj piosenke do kolejki"
        }
    ],
    plugins: [(0, publish_1.publish)()],
    description: "Dodaj piosenke do kolejki",
    execute: async (ctx, [, args]) => {
        const member = await ctx.guild?.members.fetch(ctx.user.id);
        if (!member)
            return;
        if (!member.voice.channel) {
            return await ctx.reply("Nie jesteś w głosówce");
        }
        const player = player_1.playerManager.get(ctx.interaction.guildId);
        const query = args.getString("query", true);
        await ctx.interaction.deferReply();
        const searchResult = await player.search(query);
        if (!searchResult?.tracks.length || !searchResult) {
            return await ctx.interaction.followUp({
                content: "nie znaleziono piosenki"
            });
        }
        const tracks = searchResult.playlist
            ? searchResult.tracks
            : searchResult.tracks.slice(0, 1);
        const playOptions = {
            tracks: tracks,
            channel: member.voice.channel,
        };
        await player.play(playOptions);
        if (!searchResult.playlist) {
            const track = tracks[0];
            const embed = new discord_js_1.EmbedBuilder().setTitle(track.title).setURL(track.url).setImage(track.thumbnailUrl).setFooter({ text: `Długość: ${(0, discord_player_plus_1.formatDuration)(track.duration)}` });
            ctx.interaction.followUp({ embeds: [embed] });
        }
        else {
            const embed = new discord_js_1.EmbedBuilder().setTitle(searchResult.playlist.title).setURL(searchResult.playlist.url).setImage(searchResult.playlist.thumbnailUrl);
            ctx.interaction.followUp({ embeds: [embed] });
        }
    }
});
