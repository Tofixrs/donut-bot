import { CommandType, Service, commandModule } from "@sern/handler";
import { trackToEmbed } from "../utils";
import { publish } from "../plugins/publish";

export default commandModule({
  description: "Get info about current song",
  type: CommandType.Slash,
  plugins: [publish()],
  execute: async (ctx) => {
    const playerManager = Service("playerManager");
    const player = playerManager.find(ctx.guildId!);
    const currentTrack = player?.getCurrentTrack();

    if (!player || !currentTrack) return ctx.reply("Not connected to channel");
    const embed = trackToEmbed(currentTrack);
    ctx.reply({ embeds: [embed] });
  },
});
