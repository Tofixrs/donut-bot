import { Context, Service } from "@sern/handler";
import { Player, Track } from "discord-player-plus";
import { Embed, EmbedBuilder, GuildMember } from "discord.js";

export function fmtDuration(duration: number): string {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration / 60 - hours * 60);
  const seconds = Math.floor(duration - hours * 3600 - minutes * 60);

  let durationString = "";
  if (hours > 0) durationString += `${hours}:`;
  durationString += `${minutes}:`;
  durationString += `${seconds}`;

  return durationString;
}

export function trackToEmbed(track: Track) {
  return new EmbedBuilder()
    .setTitle(track.title)
    .setURL(track.url)
    .setImage(track.thumbnailUrl!)
    .setFooter({ text: `${fmtDuration(track.duration)}` })
    .toJSON();
}

export async function getPlayer(
  ctx: Context,
): Promise<[Player, GuildMember] | undefined> {
  const member = await ctx.guild?.members.fetch(ctx.user.id);
  if (!member) return;

  if (!member.voice.channel) return;

  const playerManager = Service("playerManager");
  return [playerManager.get(ctx.interaction.guildId!), member];
}
