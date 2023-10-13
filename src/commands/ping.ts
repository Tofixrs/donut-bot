import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../plugins/publish';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'A ping command',
	//alias : [],
	execute: async (ctx, args) => {
    let msg = await ctx.reply({content: "Ładowanie..."});
    msg.edit(`🏓Pong: Ping wynosi ${msg.createdTimestamp - ctx.createdTimestamp}ms. Ping do api wynosi ${Math.round(ctx.client.ws.ping)}ms`)
	},
});
