import { commandModule, CommandType } from '@sern/handler';
import type DonutClient from '../client';
import { publish } from '../plugins/publish';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Clears queue',
	execute: async (ctx) => {
		const client = ctx.client as DonutClient;
		const guildQueue = client.player?.getQueue(ctx.guildId);

		guildQueue?.clearQueue();

		ctx.reply('Queue cleared');
	},
});
