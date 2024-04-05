const { Configs } = require("../../database/schemas");
const { _ } = require("../../utils/localization");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const serverId = interaction.guild.id;
    const server = await Configs.findOne({ server: serverId });

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command)
        return await interaction.reply({ content: _("outdated_command") });

      const currentThread = await client.channels.cache.get(
        interaction.channelId
      );

      if (
        server &&
        !server.allowedChannels.includes(currentThread.parentId) &&
        server.commandChannel &&
        interaction.channelId !== server.commandChannel
      ) {
        //
        const responseChannel = await client.channels.cache.get(
          server.responseChannel
        );

        // Attempt to delete the initial reply message (optional)
        await interaction.deferReply();
        // Delete the original slash command reply
        await interaction.deleteReply();

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

      await command.execute(interaction, client);
    }
  },
};
