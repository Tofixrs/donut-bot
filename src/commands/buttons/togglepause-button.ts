import { commandModule, CommandType } from '@sern/handler';
import { togglePause } from '../../utils.js';

export default commandModule({
	type: CommandType.Button,
	async execute(ctx) {
		await ctx.deferReply();
		await togglePause((c) => ctx.followUp(c), ctx);
	},
});
