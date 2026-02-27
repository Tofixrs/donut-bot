import { commandModule, CommandType } from '@sern/handler';
import { skip } from '../../utils.js';

export default commandModule({
	type: CommandType.Button,
	async execute(ctx) {
		await ctx.deferReply();
		skip((c) => ctx.followUp(c), ctx);
	},
});
