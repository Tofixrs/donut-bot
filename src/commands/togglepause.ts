import { CommandType, Service, commandModule } from "@sern/handler";
import { publish } from "../plugins/publish";

export default commandModule({
  type: CommandType.Slash,
  description: "eeee",
  plugins: [publish()],
  execute: async (ctx) => {
    const playerManager = Service("playerManager");

    const player = playerManager.find(ctx.guildId!);

    if(!player) return ctx.reply("Nie jestem połączony z kanałem");
    
    const sucess = player.setPause(!player.isPaused())
    
    const state = player.isPaused() ? "zapauzowano" : "odpauzowano";
    const notState = player.isPaused() ? "odpauzować" : "zapauzować";
    const msg = sucess ? `Pomyślnie ${state} muzyke` : `Nieudało sie ${notState}`;

    ctx.reply(msg);
  } 
})
