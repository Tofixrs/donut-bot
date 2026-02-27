import { commandModule, CommandType } from '@sern/handler';
import { autoConnectToHomeChannel } from '../utils.js';
import { useQueue } from 'discord-player';

export default commandModule({
	type: CommandType.Slash,
	description: 'Прекратить воспроизведение и покинуть голосовой канал',
	async execute(ctx) {
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Очередь пуста!");

		queue.node.stop(true);
		ctx.reply('Воспроизведение остановлено');

		autoConnectToHomeChannel();
	},
});
