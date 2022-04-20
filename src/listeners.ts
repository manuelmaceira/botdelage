import {
  joinVoiceChannel,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  AudioPlayerStatus,
  createAudioPlayer,
  VoiceConnection,
} from "@discordjs/voice";
import { Client } from "discord.js";

const TIMEOUT = 10000;

const timeoutHandler = () => {
  let timeout: NodeJS.Timeout;
  return {
    start: (connection: VoiceConnection) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => connection.destroy(), TIMEOUT);
    },
    cancel: () => clearTimeout(timeout),
  };
};

export const registerListeners = (client: Client, repo: string) => {
  const { start, cancel } = timeoutHandler();
  client.once("ready", (c) => {
    if (!c.user || !c.application) return;
    console.log(`${c.user.username} is online`);
  });
  client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;
    const numberSent = parseInt(msg.content);
    if (
      String(numberSent) !== msg.content ||
      !Number.isInteger(numberSent) ||
      numberSent < 1 ||
      numberSent > 42
    )
      return;
    if (!msg.member?.voice.channel || !msg.guild) return;
    cancel();
    const channel = msg.member.voice.channel;
    const player = createAudioPlayer();
    const resource = createAudioResource(`${repo}/${numberSent}.mp3`);

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild
        .voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      start(connection);
    });
  });
};
