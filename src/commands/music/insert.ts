import { commandModule, CommandType } from '@sern/handler';
import { useMainPlayer, useQueue } from 'discord-player';
import { ApplicationCommandOptionType, ChannelType } from 'discord.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Вставить трек в любое место в очереди',
	options: [
		{
			name: 'position',
			description: 'Позиция в очереди где будет вставлен трек',
			type: ApplicationCommandOptionType.Integer,
			min_value: 2,
			required: true,
		},
		{
			name: 'query',
			description: 'Ссылка',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	async execute(ctx) {
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Очередь пуста!");

		const player = useMainPlayer();
		await ctx.interaction.deferReply();
		try {
			const { tracks } = await player.search(ctx.options.getString('query', true));
			if (tracks.length < 0) return await ctx.interaction.followUp('Трек не найден!');

			queue.insertTrack(tracks[0], ctx.options.getInteger('position', true) - 2);
			await ctx.interaction.followUp({
				content: `Трек **${tracks[0].title}** добавлен в очередь`,
			});
		} catch (e) {
			await ctx.interaction.followUp(`Капитан! Всё пошло по жопе! ${e}`);
		}
	},
});
