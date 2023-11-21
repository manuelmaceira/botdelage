import {
  joinVoiceChannel,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  AudioPlayerStatus,
  createAudioPlayer,
  VoiceConnection,
  VoiceConnectionDisconnectedState,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { Client, Message } from "discord.js";
import { readdirSync } from "fs";

const connectionMap: Map<string, VoiceConnection> = new Map();

const TIMEOUT = 60 * 1000;
const AUDIO_NAMES = readdirSync("./sonidos").map((name) =>
  name.replace(".mp3", "")
);

const timeoutHandler = () => {
  let timeout: NodeJS.Timeout;
  return {
    startTimeout: (connection: VoiceConnection) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const channelId = connection.joinConfig.channelId;
        if (!channelId) throw new Error("Invalid connection!");
        connectionMap.delete(channelId);
        connection.destroy();
      }, TIMEOUT);
    },
    cancelTimeout: () => clearTimeout(timeout),
  };
};

const joinToMessage = (msg: Message) => {
  if (!msg.member?.voice.channel || !msg.guild) {
    throw new Error("Invalid message!");
  }
  const channel = msg.member.voice.channel;

  const connection = connectionMap.get(channel.id);
  if (!connection || connection.state.status === "signalling") {
    if (connection) connection.destroy();
    const newConnection = joinVoiceChannel({
      channelId: channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild
        .voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });
    connectionMap.set(channel.id, newConnection);
    return newConnection;
  }
  return connection;
};

export const registerListeners = (client: Client, repo: string) => {
  const { startTimeout, cancelTimeout } = timeoutHandler();
  client.once("ready", (c) => {
    if (!c.user || !c.application) return;
    console.log(`${c.user.username} is online`);
  });
  client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;
    if (!AUDIO_NAMES.includes(msg.content)) return;
    if (!msg.member?.voice.channel || !msg.guild) return;
    cancelTimeout();
    const player = createAudioPlayer();
    const resource = createAudioResource(
      `${repo}/${msg.content}.mp3`
    );
    const connection = joinToMessage(msg);

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      startTimeout(connection);
    });
  });
};

(() => {
  const checkConnections = () => {
    for (const [channelId, connection] of connectionMap.entries()) {
      if (
        connection.state.status ===
          VoiceConnectionStatus.Disconnected ||
        connection.state.status === VoiceConnectionStatus.Destroyed
      ) {
        connectionMap.delete(channelId);
      }
    }
  };
  setInterval(checkConnections, 500);
})();
