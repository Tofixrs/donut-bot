import { commandModule, CommandType } from '@sern/handler';
import { RepeatMode } from '@jadestudios/discord-music-player';
import { ApplicationCommandOptionType } from 'discord.js';
import type DonutClient from '../client';
import { publish } from '../plugins/publish';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Set the repeat mode',
	options: [
		{
			name: 'mode',
			description: 'The repeat mode to set',
			choices: [
				{ name: 'Disable', value: 'disable' },
				{ name: 'Toggle', value: 'toggle' },
				{ name: 'Toggle queue loop', value: 'queue' },
			],
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	execute: async (ctx) => {
		const client = ctx.client as DonutClient;
		const guildQueue = client.player?.getQueue(ctx.guildId);

		if (!guildQueue) {
			ctx.reply('No queue');
			return;
		}

		let mode;

		switch (ctx.interaction.options.getString('mode', true)) {
			case 'disable':
				mode = RepeatMode.DISABLED;
				break;
			case 'toggle':
				mode = RepeatMode.SONG;
				break;
			case 'queue':
				mode = RepeatMode.QUEUE;
				break;
		}

		guildQueue?.setRepeatMode(mode as RepeatMode);

		ctx.reply('Changed repeat mode');
	},
});
