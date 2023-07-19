import { commandModule, CommandType } from '@sern/handler';
import { ApplicationCommandOptionType } from 'discord.js';
import type DonutClient from '../client';
import { publish } from '../plugins/publish';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Change volume',
	options: [
		{
			name: 'volume',
			description: 'The volume to set',
			type: ApplicationCommandOptionType.Integer,
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

		const volume = ctx.interaction.options.getInteger('volume', true);

		guildQueue?.setVolume(volume);

		ctx.reply(`Volume ${volume}`);
	},
});
