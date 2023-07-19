import { commandModule, CommandType } from '@sern/handler';
import type DonutClient from '../client';
import { publish } from '../plugins/publish';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Shows progress of the song',
	execute: async (ctx) => {
		const client = ctx.client as DonutClient;
		const guildQueue = client.player?.getQueue(ctx.guildId);

		if (!guildQueue) {
			ctx.reply('No queue');
			return;
		}

		const progressBar = guildQueue?.createProgressBar();

		ctx.reply(progressBar?.prettier as string);
	},
});
