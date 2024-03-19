const { Configs } = require("../../database/schemas/config");
const { _ } = require("../../utils/localization");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId } = interaction;
    const serverId = interaction.guild.id;
    const server = await Configs.findOne({ server: serverId });

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      const responseChannel = await client.channels.cache.get(
        server.responseChannel
      );

      if (!command)
        return await interaction.reply({ content: _("outdated_command") });

      if (
        server.commandChannel &&
        interaction.channelId !== server.commandChannel
      ) {
        if (responseChannel)
          return await responseChannel.send({
            content: _("commands_only_run_channel_variable_mention_user", {
              channel: `<#${server.commandChannel}>`,
              user: `<@${interaction.user.id}>`,
            }),
          });

        return await interaction.reply({
          content: _("commands_only_run_channel"),
          ephemeral: true,
        });
      }
    } else {
      await command.execute(interaction, client);
    }
  },
};
