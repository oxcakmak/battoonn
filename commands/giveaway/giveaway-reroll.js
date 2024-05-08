const {
  ChannelType,
  EmbedBuilder,
  ReactionCollector,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const { Giveaways } = require("../../database/schemas");
const { _ } = require("../../utils/localization");
const { shuffleArray } = require("../../utils/arrayFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway-reroll")
    .setDescription("Giveaway reroll")
    .addStringOption((option) =>
      option.setName("code").setDescription("Giveaway code").setRequired(true)
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    // Check if the user has permission to manage messages
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: _("you_do_not_have_permission_command"),
        ephemeral: true,
      });

    const serverId = await interaction.guild.id;
    const code = interaction.options.getString("code");

    const Giveaway = await Giveaways.findOne({
      server: serverId,
      code: code,
    });

    if (!Giveaway)
      return await interaction.reply({
        content: "Giveaway not found",
        ephemeral: true,
      });

    let tempReserves = 0;
    // If reservesCount exceeds the remaining participants, adjust reservesCount
    if (Giveaway.reserves > Giveaway.participants - Giveaway.winners)
      tempReserves = Giveaway.participants - Giveaway.winners;

    if (Giveaway.winnersList) Giveaway.winnersList = [];
    if (Giveaway.reservesList) Giveaway.reservesList = [];

    await shuffleArray(Giveaway.participants);

    // Pick winners
    for (let i = 0; i < Giveaway.winners; i++) {
      Giveaway.winnersList.push(
        `<@${Giveaway.participants[i].replace("u", "")}>`
      );
    }

    // Pick reserves
    if (Giveaway.reserves > 0) {
      for (
        let i = tempReserves;
        i < Giveaway.winners + Giveaway.reserves;
        i++
      ) {
        Giveaway.reservesList.push(
          `<@${Giveaway.participants[i].replace("u", "")}>`
        );
      }
    }

    const messageChannel = await interaction.client.guilds.cache
      .get(Giveaway.server)
      ?.channels.cache.get(Giveaway.channelId);

    const fetchedMessage = await messageChannel.messages.fetch(
      Giveaway.messageId
    );
    if (!messageChannel || !fetchedMessage) return;

    Giveaway.ended = true;

    await Giveaway.save();

    const winnerObject = {
      name: "Winners",
      value: Giveaway.winnersList
        .map((item, index) => `${index + 1}. ${item}`)
        .join("\n"),
    };

    const reserveObject = {
      name: "Reserves",
      value:
        Giveaway.reservesList.length > 0
          ? Giveaway.reservesList
              .map((item, index) => `${index + 1}. ${item}`)
              .join("\n")
          : "",
    };

    const embed = {
      embeds: [
        {
          title: "Giveaway rerolled!",
          description: "Giveaway #" + Giveaway.code + " rerolled",
          fields:
            Giveaway.reservesList.length > 0
              ? [winnerObject, reserveObject]
              : [winnerObject],
        },
      ],
      components: [],
    };
    try {
      await fetchedMessage.edit(embed);
      return await interaction.reply({
        content: "Giveaway rerolled!",
        ephemeral: true,
      });
    } catch (e) {
      console.log(e.message);
      return await interaction.reply({
        content: "Error",
        ephemeral: true,
      });
    }
  },
};
