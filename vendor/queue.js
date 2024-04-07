const voice = require("@discordjs/voice");
const play = require("play-dl");
const Queue = require("better-queue");
const { _ } = require("../utils/localization");

let song;
// Create a new queue
const queue = new Queue(function (input, cb) {
  song = input;
  // Process the input here
  console.log("Processing:", input);

  // Call the callback when processing is complete
  cb(null, input);
});

queue.on("task_queued", (taskId, song) => {
  console.log("Finished playing song:", song);
  setTimeout(() => {
    playSong(song);
  }, song.length * 1000); // Move on to the next song after the duration of the current song
});

// Add song to the queue
const addSongToQueue = async (song) => {
  /*
  if (queue.length > 0 || queue.running) {
    queue.push(song);
  } else {
    playSong(song);
  }
  */

  await queue.push(song);

  playSong(song);
  if (queue.running) console.log("yes");
};

const playNextSong = () => {
  const nextSong = queue.length > 0 ? queue.peek() : null;
  if (nextSong) {
    song = nextSong; // Update the global song variable
    playSong(song); // Play the next song
  }
};

// Function to play a song
const playSong = async (song) => {
  try {
    const connection = voice.joinVoiceChannel({
      channelId: song.currentChannel.id,
      guildId: song.interaction.guild.id,
      adapterCreator: song.interaction.guild.voiceAdapterCreator,
    });

    const stream = await play.stream(song.url);
    const resource = await voice.createAudioResource(stream.stream, {
      inputType: voice.StreamType.Opus,
    });

    const player = await voice.createAudioPlayer();

    player.on("error", (error) => {
      console.error("Audio player error:", error);
    });

    player.on(voice.AudioPlayerStatus.Idle, () => {
      setTimeout(() => {
        playSong(song);
      }, song.length * 1000); // Move on to the next song after the duration of the current song
    });

    await connection.subscribe(player);
    await player.play(resource);

    await song.channel.send({
      embeds: [
        {
          type: "rich",
          title: _("now_playing"),
          description: `**[${song.title}](${song.url})**`,
          thumbnail: {
            url: song.thumbnail,
            width: 0,
            height: 0,
          },
          fields: [
            {
              name: _("channel"),
              value: song.channelOwner,
              inline: true,
            },
            {
              name: _("duration"),
              value: song.duration,
              inline: true,
            },
          ],
          footer: {
            text: "Requested by " + song.requestBy,
          },
          timestamp: song.requestedTime,
        },
      ],
    });
  } catch (error) {
    console.error("Error playing song:", error);
  }
};

// Skip the current song and play the next one
const skipSong = () => {
  queue.remove(0); // Remove the current song from the queue
  playNextSong(); // Play the next song
};

// Clear all songs in the queue
const clearQueue = () => {
  queue.cancel(); // Clear all tasks in the queue
};

// End the queue
const endQueue = () => {
  queue.destroy(); // End the queue
};

async function playQueue(interaction, channel, currentChannel) {
  if (!song) {
    console.log("No song queued.");
    return;
  }

  if (queue.running) {
    console.log("Song already queued.");
    return;
  }

  playSong(song);
}

module.exports = {
  queue,
  playQueue,
  addSongToQueue,
  skipSong,
  clearQueue,
  endQueue,
};
