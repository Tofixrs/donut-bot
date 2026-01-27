import { commandModule, CommandType } from '@sern/handler';
import { loop } from '../../utils.js';

export default commandModule({
	type: CommandType.Button,
	async execute(ctx) {
		await ctx.deferReply();
		await loop((c) => ctx.followUp(c), ctx);
	},
});
