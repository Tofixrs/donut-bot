import { commandModule, CommandType } from '@sern/handler';
import { useQueue } from 'discord-player';

export default commandModule({
	type: CommandType.Slash,
	description: 'Stop playing and leave voice',
	async execute(ctx) {
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Nothin' playin' yo");

		queue.node.stop(true);
		ctx.reply('Stopped music');
	},
});
