import { CommandType, Service, commandModule } from "@sern/handler";

export default commandModule({
  type: CommandType.Slash,
  description: "eeee",
  execute: async (ctx) => {
    const playerManager = Service("playerManager");
    const player = playerManager.find(ctx.guildId!);

    if(!player) return ctx.reply("Nie jestem połączony z kanałem");

    const clearedTracks = player.clear();

    ctx.reply(`Wyczyszczono ${clearedTracks} piosenek`)

  }
})
