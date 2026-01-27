import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
	type: CommandType.Both,
	plugins: [],
	description: 'A ping command',
	//alias : [],
	execute: async (ctx, args) => {
		let msg = await ctx.reply({ content: 'Pinging...' });
		msg.edit(
			`🏓 Pong: My ping: **${msg.createdTimestamp - ctx.createdTimestamp}**ms`
		);
	},
});
