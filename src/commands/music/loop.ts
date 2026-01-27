import { commandModule, CommandType } from '@sern/handler';
import { QueueRepeatMode } from 'discord-player';
import { ApplicationCommandOptionType } from 'discord.js';
import { loop } from '../../utils.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Sets loop mode',
	options: [
		{
			name: 'mode',
			description: 'Loop mode to set',
			type: ApplicationCommandOptionType.Number,
			choices: [
				{ name: 'OFF', value: QueueRepeatMode.OFF },
				{ name: 'Queue', value: QueueRepeatMode.QUEUE },
				{ name: 'Track', value: QueueRepeatMode.TRACK },
				{ name: 'Autoplay', value: QueueRepeatMode.AUTOPLAY },
			],
		},
	],
	async execute(ctx) {
		const loopmode = ctx.options.getNumber('mode') as QueueRepeatMode | undefined;

		await ctx.interaction.deferReply();
		loop((c) => ctx.interaction.followUp(c), ctx, loopmode);
	},
});
