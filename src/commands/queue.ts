import { CommandType, Service, commandModule } from "@sern/handler";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { publish } from "../plugins/publish";
import { fmtDuration } from "../utils";

export default commandModule({
  type: CommandType.Slash,
  description: "list the queue",
  options: [
    {
      type: ApplicationCommandOptionType.Number,
      name: "page",
      description: "Page of queue",
    },
  ],
  plugins: [publish()],
  execute: async (ctx) => {
    const playerManager = Service("playerManager");
    const player = playerManager.find(ctx.guildId!);

    if (!player) return ctx.reply("Not connected to channel");

    const queue = player.getQueue().map((track, i) => {
      return `${i + 1}. [${track.title}](${track.url}): ${fmtDuration(
        track.duration,
      )}\n`;
    });
    let pages: string[] = [];
    let i = 0;
    queue.forEach((e, j) => {
      let page = pages[i] ? pages[i] : "";
      pages[i] = page += e;
      if (j % 10 == 0 && j != 0) i++;
    });

    const chosenPage = ctx.interaction.options.getNumber("page") || 1;

    const page = pages[chosenPage - 1];

    const embed = new EmbedBuilder()
      .setTitle("queue")
      .setDescription(page)
      .setFooter({ text: `Page: ${chosenPage}/${pages.length}` })
      .toJSON();

    ctx.reply({ embeds: [embed] });
  },
});
