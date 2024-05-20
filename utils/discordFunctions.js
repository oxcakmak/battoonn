function discordChannelTypeDetector(id) {
  let channelType = "";
  if (isNaN(id)) {
    throw new Error(`Invalid number input: ${id}`);
  }

  switch (id) {
    case 0:
      channelType = "guild_text";
      break;
    case 1:
      channelType = "dm";
      break;
    case 2:
      channelType = "guild_voice";
      break;
    case 3:
      channelType = "group_dm";
      break;
    case 4:
      channelType = "guild_category";
      break;
    case 5:
      channelType = "guild_announcement";
      break;
    case 10:
      channelType = "announcement_thread";
      break;
    case 11:
      channelType = "public_thread";
      break;
    case 12:
      channelType = "private_thread";
      break;
    case 13:
      channelType = "guild_stage_voice";
      break;
    case 14:
      channelType = "guild_directory";
      break;
    case 15:
      channelType = "guild_forum";
      break;
    case 16:
      channelType = "guild_media";
      break;
  }
  return channelType;
}

module.exports = { discordChannelTypeDetector };
