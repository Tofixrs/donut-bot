import { CommandType, Service, commandModule } from "@sern/handler";
import { publish } from "../plugins/publish";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Stop all music from playing and disconnect bot from channel",
  execute: async (ctx) => {
    const playerManager = Service("playerManager");
    const player = playerManager.find(ctx.guildId!);

    if (!player) return ctx.reply("Not connected to channel");

    player.stop();

    ctx.reply("Music stopped");
  },
});
