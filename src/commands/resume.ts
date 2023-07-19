import { commandModule, CommandType } from '@sern/handler';
import type DonutClient from '../client';
import { publish } from '../plugins/publish';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Pause resumed',
	execute: async (ctx) => {
		const client = ctx.client as DonutClient;
		const guildQueue = client.player?.getQueue(ctx.guildId);

		if (!guildQueue) {
			ctx.reply('No queue');
			return;
		}

		guildQueue?.setPaused(false);

		ctx.reply('Queue resumed');
	},
});
