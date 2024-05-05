const fs = require("fs");
const { _ } = require("../../utils/localization");
const { Giveaways } = require("../../database/schemas");
const { containsMultipleData } = require("../../utils/arrayFunctions");

const { v4: uuidv4 } = require("uuid");
const randomIdv4 = uuidv4();

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { customId, guild, message, channel } = await interaction;

    const serverId = guild.id;

    if (interaction.isButton() && customId.startsWith("btnJoinGiveaway")) {
      const currentChannelId = message.channelId;

      const btnParse = customId.split("-");
      const code = btnParse[1];

      const giveaway = await Giveaways.findOne({
        server: serverId,
        code: code,
      });

      if (!giveaway)
        return await interaction.reply({
          content: "Giveaway not found",
          ephemeral: true,
        });

      const {
        server,
        messageId,
        channelId,
        voiceId,
        winners,
        winnersList,
        reserves,
        reservesList,
        duration,
        role,
        limit,
        startAt,
        endAt,
        ended,
        participants,
        blacklist,
        createdById,
        createdByDateTime,
        createdByChannel,
      } = giveaway;

      if (ended)
        return await interaction.reply({
          content: "Giveaway ended",
          ephemeral: true,
        });

      if (limit > 1 && participants.length >= limit)
        return await interaction.reply({
          content:
            "You cannot participate because the number of participants has been exceeded",
          ephemeral: true,
        });

      if (role && !containsMultipleData(roleIds, [role]))
        return await interaction.reply({
          content: "You must have role xx to participate in the giveaway",
          ephemeral: true,
        });

      if (participants.includes(interaction.user.id))
        return await interaction.reply({
          content: "You have already entered the giveaway",
          ephemeral: true,
        });

      if (blacklist.includes(interaction.user.id))
        return await interaction.reply({
          content:
            "You cannot participate in the draw because you are on the blacklist",
          ephemeral: true,
        });

      const member = interaction.guild.members.cache.get(message.author.id);

      if (voiceId && member.voice.channel.id !== voiceId)
        return await interaction.reply({
          content: "You are not currently in a voice channel",
          ephemeral: true,
        });

      participants.push(interaction.user.id);

      const join = await giveaway.save();

      if (!join)
        return await interaction.reply({
          content: "You can not joined giveaway",
          ephemeral: true,
        });

      return await interaction.reply({
        content: "You are joined Giveaway",
        ephemeral: true,
      });
    }
  },
};
