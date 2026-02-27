import { commandModule, CommandType } from '@sern/handler';
import { useQueue } from 'discord-player';
import { ApplicationCommandOptionType } from 'discord.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Установить громкость трека',
	options: [
		{
			name: 'volume',
			description: 'Громкость в процентах',
			type: ApplicationCommandOptionType.Number,
			required: true,
			min_value: 1,
		},
	],
	async execute(ctx) {
		const volume = ctx.options.getNumber('volume', true);
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Очередь пуста!");

		await ctx.interaction.deferReply();
		const success = queue.node.setVolume(volume);

		if (!success)
			return await ctx.interaction.followUp('Капитан! Всё пошло по жопе!');

		await ctx.interaction.followUp(`Установлена громкость ${volume}%`);
	},
});
