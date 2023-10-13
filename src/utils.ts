import { Service } from "@sern/handler";
import { Track } from "discord-player-plus";
import { EmbedBuilder } from "discord.js";

export function fmtDuration(duration: number): string {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration / 60) - hours * 60);
  const seconds = Math.floor(duration - (hours * 3600) - (minutes * 60));

  let durationString = "";
  if (hours > 0) durationString += `${hours}h:`;
  if (minutes > 0) durationString += `${minutes}m`;
  if (seconds > 0) durationString += `:${seconds}s`;

  return durationString;
}

export function trackToEmbed(track: Track) {
  return new EmbedBuilder().setTitle(track.title).setURL(track.url).setImage(track.thumbnailUrl!).setFooter({text: `Długość: ${fmtDuration(track.duration)}`})
}
