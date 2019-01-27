const Discord = require('discord.js');
const bot = new Discord.Client();

var prefix = ("*")

bot.on('ready', function () {
  bot.user.setActivity("Command: *help");
  console.log("Connected");
});

bot.login(process.env.TOKEN);


bot.on('message', message => {
  if (message.content === prefix + "help") {
    message.channel.send("Liste des commandes: \n *burgerbot \n *fabriquant \n *embed");
    console.log("Commande help effectué")
  }

  if (message.content === prefix + "burgerbot") {
    message.reply("Création du bot le _27/01/2018_ à _ 23h00_");
    console.log("Commande burgerbot effectué");
  }

  if (message.content === prefix + "fabriquant") {
    message.reply("_Ce bot a été crée par Kingsman_");
    console.log("Commande fabriquant effectué");
  }

  if (message.content === prefix + "embed") {
    var embed = new Discord.RichEmbed()
      .setTitle("Embed")
      .setDescription("Ceci est un embed")
      .addField("*help", "Page d'aide", true)
      .addField("Embed01", "Embed 01 ! :) Suivez les tuto de [PZH CODAGE](https://pzhcodage.webnode.fr)", true)
      .setColor("0xFF8000")
      .setFooter("Bon moment parmis nous ! :)")
    message.channel.send(embed);
    console.log("Commande embed effectué");
  }
});
