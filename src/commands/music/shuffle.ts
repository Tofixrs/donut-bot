import { commandModule, CommandType } from '@sern/handler';
import { useQueue } from 'discord-player';

export default commandModule({
	type: CommandType.Slash,
	description: 'Перемешать порядок очереди',
	async execute(ctx, args) {
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Очередь пуста!");
		if (!queue.tracks.toArray()[0])
			return ctx.reply("В очереди не достаточно треков!");

		await ctx.interaction.deferReply();
		queue.tracks.shuffle();

		await ctx.interaction.followUp('Очередь перемешана');
	},
});
