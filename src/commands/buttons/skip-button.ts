import { commandModule, CommandType } from '@sern/handler';
import { skip } from '../../utils.js';

export default commandModule({
	type: CommandType.Button,
	description: 'Skip current song',
	async execute(ctx) {
		await ctx.deferReply();
		skip((c) => ctx.followUp(c), ctx);
	},
});
