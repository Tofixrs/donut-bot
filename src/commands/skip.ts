import { CommandType, Service, commandModule } from "@sern/handler";
import { publish } from "../plugins/publish";
import { trackToEmbed } from "../utils";

export default commandModule({
	name: "skip",
	description: "skip song",
	plugins: [publish()],
	type: CommandType.Slash,
	execute: async (ctx) => {
		const playerManager = Service("playerManager");
		const player = playerManager.find(ctx.guildId!);

		if (!player) return ctx.reply("Not connected to channel");

		let track = player.skip();

		await ctx.reply("Succesfully skipped the track");
		if (track) {
			const embed = trackToEmbed(track);
			ctx.interaction.followUp({ embeds: [embed] });
		}
	},
});
