const {
  Client,
  CommandInteractionOptionResolver,
  GatewayIntentBits,
  SlashCommandBuilder,
  EmbedBuilder,
  GuildMember,
  Guild,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  basename,
  ModalBuilder,
  TextInputStyle,
  InteractionResponseType,
  InteractionType,
  AttachmentBuilder,
  ChannelType,
  MessageType,
  DMChannel,
  Routes,
  TextInputBuilder,
} = require("discord.js");

const { REST } = require("discord.js");
const noblox = require("noblox.js");
const help = require("./help.js");
const event = require("./event.js");
const report = require("./report.js");
const ticket = require("./ticket.js");
const rank = require("./rank.js");
const user = noblox.setCookie(
  "COOKIE"
);

// Client setup

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
});

// REST

const rest = new REST({ version: "10" }).setToken(
  "TOKEN"
);

// Events

client.on("interactionCreate", async (interaction) => {
  if (interaction.commandName === "help") {
    // Embed build

    const helpembed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("APEX ADVENTURES HELP BOT: COMMANDS")
      .setDescription(
        "**------__COMMANDS__------**\n\n**❕ GENERAL COMMANDS**\n**/help**\n**/report**\n**/ticket**"
      )
      .setFooter({
        text: "AA Help Bot || Need assistance? do /help for help!",
        iconURL: "https://i.imgur.com/BQXTL1m.png",
      });
    interaction.reply({
      content:
        "These are the commands in **Apex Adventures**. Look at the attachment below:",
      embeds: [helpembed],
    });
  }

  if (interaction.commandName === "event") {
    const event = interaction.options.getString("event");
    const link = interaction.options.getString("link");
    const cohost = interaction.options.getUser("cohost") ?? "N/A";
    const role = interaction.options.getRole("roleping");
    const cevent = interaction.guild.channels.cache.get("1185213852175040563");

    if (!link.startsWith("https://")) {
      interaction.reply({
        content: "Link is not a valid link, please insert a valid link",
        ephemeral: true,
      });
    } else {
      interaction.reply(
        "Your event announcement has been sent in <#1185213852175040563>! Do /help for more commands."
      );
      cevent.send({
        content: `**APEX ADVENTURES || EVENTS**\n\n**${event}**\n\nHost: ${interaction.user}\nCo-Host: ${cohost}\n:link:: ${link}\n\n||${role}||`,
      });
    }
  }

  if (interaction.commandName === "rank") {
    await interaction.deferReply();
    const tuser = interaction.options.getNumber("targetuser");
    const trank = interaction.options.getNumber("targetrank");

    noblox
      .changeRank(5156922, tuser, trank)
      .then(async () => {
        const username = await noblox.getUsernameFromId(tuser);
        const grn = await noblox.getRankNameInGroup(5156922, tuser);
        interaction.reply(
          `The rank of ${username} has been updated and they have been ranked to **${grn}**`
        );
      })
      .catch((error) => {
        console.error(error.stack);
        interaction.reply({
          content: `Something went wrong, Here is what can have gone wrong: \n\n- **The user id does not exist or isn't in the group**\n- **The rank number does not exist**\nPlease double check the fields. Thank you!`,
          epabdhemeral: true,
        });
      });
  }

  if (interaction.commandName === "report") {
    const modal = new ModalBuilder()
      .setTitle("Report a user")
      .setCustomId("mregister")
      .setComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setLabel("Target Roblox Username")
            .setCustomId("utibu")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder("Roblox username (eg. yourmine_broHD)")
        ),

        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setLabel("Target Discord Username (if they have one)")
            .setCustomId("utibd")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setPlaceholder("Discord username (eg. furnishedfur)")
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setLabel("Reason of report")
            .setStyle(TextInputStyle.Paragraph)
            .setCustomId("utibp")
            .setRequired(true)
            .setPlaceholder("Reason of your report. Must be detailed.")
        )
      );

    interaction.showModal(modal);
  }

  if (interaction.commandName === "ticket") {
    const tmodal = new ModalBuilder()
      .setTitle("Create a ticket")
      .setCustomId("ticket_register")
      .setComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId("t")
            .setRequired(true)
            .setLabel("Title")
            .setPlaceholder("Title of your ticket")
            .setStyle(TextInputStyle.Short)
        ),

        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId("d")
            .setLabel("Reason of your ticket")
            .setPlaceholder("Type out your concern or suggestion.")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)
        )
      );

    interaction.showModal(tmodal);
  }

  // --------------------------------------------------------------------------------------------------------------

  if (interaction.type === InteractionType.ModalSubmit) {
    if (interaction.customId === "mregister") {
      const rusername = interaction.fields.fields.get("utibu").value;
      const dusername = interaction.fields.fields.get("utibd").value;
      const mreason = interaction.fields.fields.get("utibp").value;
      const creporttg = interaction.guild.channels.cache.get(
        "1190002015116480572"
      );
      const reportembed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("New Report!")
        .setDescription(
          `**REPORT DATA:** \n\nReporter: ${interaction.user}\n\nRoblox Username of Reported: ${rusername}\nDiscord Username of Reported: ${dusername}\n\nReason: ${mreason}`
        )
        .setFooter({
          text: "AA Help Bot || Need assistance? do /help for help!",
          iconURL: "https://i.imgur.com/BQXTL1m.png",
        });

      creporttg.send({
        content: "NEW REPORT! <@&1190010026526515311> ",
        embeds: [reportembed],
      });
      interaction.reply({
        content:
          " :police_officer::skin-tone-3: Report submitted! Your report is now under review by our staff. **Staff will dm or ping you shortly.**",
        ephemeral: true,
      });
    }

    if (interaction.customId === "ticket_register") {
      const tuser = interaction.user;
      const ttitle = interaction.fields.fields.get("t").value;
      const tdesc = interaction.fields.fields.get("d").value;
      const cticket = interaction.guild.channels.cache.get(
        "1190265611822047293"
      );
      const tembed = new EmbedBuilder()
        .setTitle("Modmail      ")
        .setDescription(
          `**NEW TICKET || ${ttitle}**\n\nTicket Maker: ${tuser}\n\nTicket Purpose: ${tdesc}`
        )
        .setColor("Random")
        .setFooter({
          text: "AA Help Bot || Need assistance? do /help for help!",
          iconURL: "https://i.imgur.com/BQXTL1m.png",
        });
      cticket.send({
        content: "NEW TICKET! <@&1190010026526515311>",
        embeds: [tembed],
      });
      interaction.reply({
        content:
          ":ticket: Your ticket has been recorded. **Be on the lookout for dms or pings from our staff.**",
        ephemeral: true,
      });
    }
  }
});

client.on("ready", () => {
  console.log("Bot is online.");
});

// Slash Command setup

const botid = "1189966686045098044";
const guildid = "1183068097326895175";

const jsonhelp = help;
const jsonevent = event;
const jsonreport = report;
const jsonticket = ticket;
const jsonrank = rank;

async function main() {
  const commands = [jsonhelp, jsonevent, jsonreport, jsonticket, jsonrank];
  try {
    console.log("(/) refreshing application commands.");
    await rest.put(Routes.applicationGuildCommands(botid, guildid), {
      body: commands,
    });
  } catch (err) {
    console.error("Error registering commands", err);
  }
}

main();

client.login(
  "TOKEN"
);
