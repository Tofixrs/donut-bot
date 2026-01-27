import { commandModule, CommandType } from '@sern/handler';
import { useQueue } from 'discord-player';
import { ApplicationCommandOptionType } from 'discord.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Set volume of music',
	options: [
		{
			name: 'value',
			description: 'Volume value',
			type: ApplicationCommandOptionType.Number,
			required: true,
			min_value: 1,
		},
	],
	async execute(ctx) {
		const volume = ctx.options.getNumber('value', true);
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Nothin' playin' yo");

		await ctx.interaction.deferReply();
		const success = queue.node.setVolume(volume);

		if (!success)
			return await ctx.interaction.followUp('Oopsie something brokie');

		await ctx.interaction.followUp(`Set volume to ${volume}%`);
	},
});
