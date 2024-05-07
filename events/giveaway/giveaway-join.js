const { _ } = require("../../utils/localization");
const { Giveaways } = require("../../database/schemas");
const { containsMultipleData } = require("../../utils/arrayFunctions");
const { addTime } = require("../../utils/dateFunctions");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { customId, guild, message, channel } = await interaction;

    const serverId = guild.id;

    if (interaction.isButton() && customId.startsWith("btnJoinGiveaway")) {
      const currentChannelId = message.channelId;
      const participantId = "u" + interaction.user.id;

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
        description,
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

      if (limit > 0 && participants.length === limit)
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

      const participantInBlacklist = await blacklist.includes(participantId);
      const participantAlreadyJoined = await participants.includes(
        participantId
      );

      if (participantInBlacklist)
        return await interaction.reply({
          content:
            "You cannot participate in the draw because you are on the blacklist",
          ephemeral: true,
        });

      if (!participantInBlacklist && participantAlreadyJoined)
        return await interaction.reply({
          content: "You have already entered the giveaway",
          ephemeral: true,
        });

      const member = await interaction.guild.members.cache.get(participantId);

      if (voiceId && member.voice.channel.id !== voiceId)
        return await interaction.reply({
          content: "You are not currently in a voice channel",
          ephemeral: true,
        });

      // 7 => participant Number

      const fetchedMessage = await message.channel.messages.fetch(messageId);

      if (!fetchedMessage.embeds.length)
        return await interaction.reply({
          content: "The message does not contain an embed",
          ephemeral: true,
        });

      const embed = {
        embeds: [
          {
            title: _("giveaway_number_with_variable", { number: code }),
            description: description
              ? description
              : _("giveaway_join_message_with_emoji"),
            fields: [
              {
                name: "Giveaway Duration",
                value: duration.toString(),
                inline: true,
              },
              {
                name: "Ends In",
                value: "Apr 28, 2024, 10:10 PM",
                inline: true,
              },
              { name: "\u200b", value: "" },
              {
                name: "Join Role Required",
                value: role ? "Yes" : "No",
                inline: true,
              },
              {
                name: "Joiner Role",
                value: role ? `<@${role}>` : "-",
                inline: true,
              },
              { name: "\u200b", value: "" },
              {
                name: "Winners",
                value: winners.toString(),
                inline: true,
              },
              {
                name: "Reserves",
                value: reserves.toString(),
                inline: true,
              },
              { name: "\u200b", value: "" },
              {
                name: "Participants",
                value: participants.length + 1,
                inline: true,
              },
              {
                name: "Max Participants",
                value: limit,
                inline: true,
              },
              { name: "\u200b", value: "" },
              {
                name: "Created By",
                value: `<@${createdById}>`,
                inline: true,
              },
              {
                name: "Created Date & Time",
                value: createdByDateTime.toString(),
                inline: true,
              },
              /*
            { name: "", value: "" },
            {
              name: "Primary Winners",
              value: "-",
              inline: true,
            },
            {
              name: "Secondary Winners",
              value: "-",
              inline: true,
            },
            */
            ],
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                style: 3,
                label: "🎉",
                custom_id: `btnJoinGiveaway-${code}`,
                disabled: false,
                type: 2,
              },
            ],
          },
        ],
        /* timestamp: 1714330395290, */
      };
      try {
        await fetchedMessage.edit(embed);
      } catch (e) {
        console.log(e.message);
      }

      await participants.push(participantId);

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
