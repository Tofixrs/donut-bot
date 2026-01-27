import { commandModule, CommandType } from '@sern/handler';
import { last } from '../../utils.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Plays last song',
	async execute(ctx, args) {
		await ctx.interaction.deferReply();
		last((c) => ctx.interaction.followUp(c), ctx);
	},
});
