import { CommandType, Service, commandModule } from "@sern/handler";
import { publish } from "../plugins/publish";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "eee",
  execute: async (ctx) => {
    const playerManager = Service("playerManager");
    const player = playerManager.find(ctx.guildId!);

    if(!player) return ctx.reply("Nie jestem połączony z kanałem");
  
    player.stop()

    ctx.reply("Zastopowano muzyke");
  }
})
