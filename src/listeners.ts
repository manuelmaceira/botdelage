import {
  joinVoiceChannel,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  AudioPlayerStatus,
  createAudioPlayer,
  VoiceConnection,
  AudioPlayer,
} from "@discordjs/voice";
import { Client, Message } from "discord.js";

const connectionMap: Map<string, VoiceConnection> = new Map();

const TIMEOUT = 10000;

const timeoutHandler = () => {
  let timeout: NodeJS.Timeout;
  return {
    startTimeout: (connection: VoiceConnection) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => connection.destroy(), TIMEOUT);
    },
    cancelTimeout: () => clearTimeout(timeout),
  };
};

const joinToMessage = (msg: Message) => {
  if (!msg.member?.voice.channel || !msg.guild) {
    throw new Error("Invalid message!");
  }
  const channel = msg.member.voice.channel;

  const connection =
    connectionMap.get(channel.id) ||
    joinVoiceChannel({
      channelId: channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild
        .voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });
  connectionMap.set(channel.id, connection);
  return connection;
};

const breakConnections = () => {
  for (const connection of connectionMap.values()) {
    connection.destroy();
  }
};

const isOwner = (msg: Message) =>
  msg.author.id === process.env.OWNER_ID;

const isOwnerMsg = (msg: Message, content: string) =>
  isOwner(msg) && msg.content === content;

export const registerListeners = (client: Client, repo: string) => {
  const { startTimeout, cancelTimeout } = timeoutHandler();
  client.once("ready", (c) => {
    if (!c.user || !c.application) return;
    console.log(`${c.user.username} is online`);
  });
  client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;
    if (isOwnerMsg(msg, "entrá")) {
      joinToMessage(msg);
      return;
    }
    if (isOwnerMsg(msg, "andate")) {
      breakConnections();
      return;
    }
    const numberSent = parseInt(msg.content);
    if (
      String(numberSent) !== msg.content ||
      !Number.isInteger(numberSent) ||
      numberSent < 1 ||
      numberSent > 42
    )
      return;
    if (!msg.member?.voice.channel || !msg.guild) return;
    cancelTimeout();
    const player = createAudioPlayer();
    const resource = createAudioResource(`${repo}/${numberSent}.mp3`);
    const connection = joinToMessage(msg);

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      startTimeout(connection);
    });
  });
};
