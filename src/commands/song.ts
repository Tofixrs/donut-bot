import { CommandType, Service, commandModule } from "@sern/handler";
import { trackToEmbed } from "../utils";

export default commandModule({
  description: "eee",
  type: CommandType.Slash,
  execute: async (ctx) => {
    const playerManager = Service("playerManager");
    const player = playerManager.find(ctx.guildId!);
    const currentTrack = player?.getCurrentTrack();

    if(!player || !currentTrack) return ctx.reply("Nie jestem połączony z kanałem");
    const embed = trackToEmbed(currentTrack);
    ctx.reply({embeds: [embed]});

  }
})
