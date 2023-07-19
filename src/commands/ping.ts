import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../plugins/publish';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'A ping command',
	execute: async (ctx) => {
		let msg = await ctx.interaction.reply({content: "Pinging..", fetchReply: true});

		msg.edit(`🏓Latency is ${msg.createdTimestamp - ctx.createdTimestamp}ms | Api ping ${ctx.client.ws.ping}ms`)
	},
});
