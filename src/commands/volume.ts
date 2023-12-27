import { CommandType, Service, commandModule } from "@sern/handler";
import { ApplicationCommandOptionType } from "discord.js";
import { publish } from "../plugins/publish";

export default commandModule({
  options: [
    {
      name: "volume",
      description: "volume to set",
      type: ApplicationCommandOptionType.Number,
      min_value: 0,
      max_value: 200,
      required: true,
    },
  ],
  description: "chnage volume",
  plugins: [publish()],
  type: CommandType.Slash,
  execute: async (ctx, [, args]) => {
    const playerManager = Service("playerManager");
    const player = playerManager.find(ctx.guildId!);

    if (!player) return ctx.reply("Not connected to channel");

    const volume = args.getNumber("volume", true);
    const sucess = player.setVolume(volume);

    if (!sucess) return ctx.reply("Couldnt set the volume");

    ctx.reply(`Changed volume to ${volume}`);
  },
});
