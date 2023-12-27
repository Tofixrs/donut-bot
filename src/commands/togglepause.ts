import { CommandType, Service, commandModule } from "@sern/handler";
import { publish } from "../plugins/publish";

export default commandModule({
  type: CommandType.Slash,
  description: "Toggle the pause state",
  plugins: [publish()],
  execute: async (ctx) => {
    const playerManager = Service("playerManager");

    const player = playerManager.find(ctx.guildId!);

    if (!player) return ctx.reply("Not connected to channel");

    const sucess = player.setPause(!player.isPaused());

    const state = player.isPaused() ? "pause" : "unpause";
    const msg = sucess
      ? `Succesfully ${state}d the music`
      : `Couldnt ${state} the music`;

    ctx.reply(msg);
  },
});
