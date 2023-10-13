import { CommandType, Service, commandModule } from "@sern/handler";
import { ApplicationCommandOptionType, Embed, EmbedBuilder } from "discord.js";
import { PlayOptions} from "discord-player-plus";
import { publish } from "../plugins/publish";
import { fmtDuration, trackToEmbed } from "../utils";

export default commandModule({
  type: CommandType.Slash,
  options: [
    {
      name: "query",
      type: ApplicationCommandOptionType.String,
      required: true,
      description: "dodaj piosenke do kolejki"
    }
  ],
  plugins: [publish()],
  description: "Dodaj piosenke do kolejki",
  execute: async (ctx, [, args]) => {
    const member = await ctx.guild?.members.fetch(ctx.user.id);
    if (!member) return;

    if(!member.voice.channel) {
      return await ctx.reply("Nie jesteś w głosówce")
    }

    const playerManager = Service("playerManager");
    const player = playerManager.get(ctx.interaction.guildId!);

    const query = args.getString("query", true);
    await ctx.interaction.deferReply();
    
    const searchResult = await player.search(query);
    
    if (!searchResult?.tracks.length || !searchResult) {
      return await ctx.interaction.followUp({
        content: "nie znaleziono piosenki"
      })
    }
    const tracks = searchResult.playlist
      ? searchResult.tracks
      : searchResult.tracks.slice(0, 1);


    const playOptions: PlayOptions = {
      tracks: tracks,
      channel: member.voice.channel,
    };
  
    await player.play(playOptions);
    
    if (!searchResult.playlist) {
      const track = tracks[0];
      const embed = trackToEmbed(track);
      ctx.interaction.followUp({embeds: [embed]});
    } else {
      
      const embed = new EmbedBuilder().setTitle(searchResult.playlist.title).setURL(searchResult.playlist.url).setImage(searchResult.playlist.thumbnailUrl!)
      ctx.interaction.followUp({embeds: [embed]});
    }
  }
})
