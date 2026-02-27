import { commandModule, CommandType } from '@sern/handler';
import { skip } from '../../utils.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Перейти к следующему треку и пропустить текущий',
	async execute(ctx, args) {
		await ctx.interaction.deferReply();
		await skip((c) => ctx.interaction.followUp(c), ctx);
	},
});
