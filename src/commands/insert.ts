import { CommandType, Service, commandModule } from "@sern/handler";
import { ApplicationCommandOptionType } from "discord.js";
import { publish } from "../plugins/publish";
import { trackToEmbed } from "../utils";

export default commandModule({
  type: CommandType.Slash,
  description: "Insert song at specified pos",
  plugins: [publish()],
  options: [
    {
      name: "query",
      type: ApplicationCommandOptionType.String,
      required: true,
      description: "eee",
    },
    {
      name: "position",
      type: ApplicationCommandOptionType.Number,
      min_value: 1,
      required: true,
      description: "eee",
    },
  ],
  execute: async (ctx, [, args]) => {
    const playerManager = Service("playerManager");
    const player = playerManager.find(ctx.guildId!);

    if (!player) return ctx.reply("Not in vc");

    const query = args.getString("query", true);
    const pos = args.getNumber("position", true);
    await ctx.interaction.deferReply();

    const queue = player.getQueue();
    const searchResult = await player.search(query);

    if (!searchResult?.tracks.length || !searchResult) {
      return await ctx.interaction.followUp({
        content: "Song not found",
      });
    }
    const track = searchResult.tracks[0];
    player.insert(track, pos);
    const insertedPosition = pos >= queue.length ? queue.length + 1 : pos + 1;

    const embed = trackToEmbed(track);
    ctx.interaction.followUp({
      content: `Added song to queue at pos ${insertedPosition}`,
      embeds: [embed],
    });
  },
});
