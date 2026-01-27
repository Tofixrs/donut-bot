import { commandModule, CommandType } from '@sern/handler';
import { useMainPlayer, useQueue } from 'discord-player';
import { ApplicationCommandOptionType, ChannelType } from 'discord.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Insert song anywhere into queue',
	options: [
		{
			name: 'pos',
			description: 'Where to insert song',
			type: ApplicationCommandOptionType.Integer,
			min_value: 2,
			required: true,
		},
		{
			name: 'query',
			description: 'query',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	async execute(ctx) {
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Nothin' playin' yo");

		const player = useMainPlayer();
		await ctx.interaction.deferReply();
		try {
			const { tracks } = await player.search(ctx.options.getString('query', true));
			if (tracks.length < 0) return await ctx.interaction.followUp('Not found');

			queue.insertTrack(tracks[0], ctx.options.getInteger('pos', true) - 2);
			await ctx.interaction.followUp({
				content: `Addin' **${tracks[0].title}** to queue`,
			});
		} catch (e) {
			await ctx.interaction.followUp(`Somethin' failed yo ${e}`);
		}
	},
});
