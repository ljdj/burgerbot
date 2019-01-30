const Discord = require('discord.js');
const bot = new Discord.Client();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ histoires: [], xp: []}).write()

var prefix = ("*")

bot.on('ready', function () {
  bot.user.setActivity("Command: *help");
  console.log("Connected");
});

bot.login(process.env.TOKEN);


bot.on('message', message => {
  if (message.content === prefix + "help") {
    message.channel.send("Liste des commandes: \n *burgerbot \n *fabriquant \n *embed \n *xp");
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

  var msgauthor = message.author.id;

  if (message.author.bot)return;

  if (!db.get("xp").find({user: msgauthor}).value()) {
    db.get("xp").push({user: msgauthor, xp: 1}).write();
  } else {
      var userxpdb = db.get("xp").filter({user: msgauthor}).find('xp').value();
      console.log(userxpdb);
      var userxp = Object.values(userxpdb);
      console.log(userxp);
      console.log(`Nombre d'xp: ${userxp[1]}`);

      db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();

    if (message.content === prefix + "xp") {
      var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
      var xpfinal = Object.values(xp);
      var xp_embed = new Discord.RichEmbed()
        .setTitle(`Stat des XP de ${message.author.username}`)
        .setColor('#F4D03F')
        .setDescription("Affiche des XP")
        .addField("xp", `${xpfinal[1]} xp`)
        .setFooter("Enjoy :p")
      message.channel.send({embed: xp_embed});
      console.log("Commande xp effectué");
    }
  }
});
