import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
	type: CommandType.Both,
	plugins: [],
	description: 'Проверить пинг бота',
	//alias : [],
	execute: async (ctx, args) => {
		let msg = await ctx.reply({ content: 'Пингуем...' });
		msg.edit(
			`🏓 Понг! Мой пинг: **${msg.createdTimestamp - ctx.createdTimestamp}** мсек.`
		);
	},
});
