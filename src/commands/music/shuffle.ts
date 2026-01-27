import { commandModule, CommandType } from '@sern/handler';
import { useQueue } from 'discord-player';

export default commandModule({
	type: CommandType.Slash,
	description: 'Shuffle the queue',
	async execute(ctx, args) {
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Nothin' playin' yo");
		if (!queue.tracks.toArray()[0])
			return ctx.reply("Nothin' more in the queue");

		await ctx.interaction.deferReply();
		queue.tracks.shuffle();

		await ctx.interaction.followUp('Shuffled the queue');
	},
});
