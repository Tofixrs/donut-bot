import { commandModule, CommandType } from '@sern/handler';
import { QueueRepeatMode } from 'discord-player';
import { ApplicationCommandOptionType } from 'discord.js';
import { loop } from '../../utils.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Установить режим повтора',
	options: [
		{
			name: 'Режим',
			description: 'Выбор режима повтора',
			type: ApplicationCommandOptionType.Number,
			choices: [
				{ name: 'ВЫКЛ.', value: QueueRepeatMode.OFF },
				{ name: 'Повтор всей очереди', value: QueueRepeatMode.QUEUE },
				{ name: 'Повтор трека', value: QueueRepeatMode.TRACK },
				{ name: 'Автовоспроизведение', value: QueueRepeatMode.AUTOPLAY },
			],
		},
	],
	async execute(ctx) {
		const loopmode = ctx.options.getNumber('Режим') as QueueRepeatMode | undefined;

		await ctx.interaction.deferReply();
		loop((c) => ctx.interaction.followUp(c), ctx, loopmode);
	},
});
