import { CommandType, Service, commandModule } from "@sern/handler";

export default commandModule({
  type: CommandType.Slash,
  description: "Clear the queue",
  execute: async (ctx) => {
    const playerManager = Service("playerManager");
    const player = playerManager.find(ctx.guildId!);

    if (!player) return ctx.reply("Not in voice channel");

    const clearedTracks = player.clear();

    ctx.reply(`Cleared ${clearedTracks} from queue`);
  },
});
