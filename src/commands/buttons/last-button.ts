import { commandModule, CommandType } from '@sern/handler';
import { last } from '../../utils.js';

export default commandModule({
	type: CommandType.Button,
	async execute(ctx) {
		await ctx.deferReply();
		await last((content) => ctx.followUp(content), ctx);
	},
});
