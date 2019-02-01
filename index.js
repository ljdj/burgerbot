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
  console.log("Connecté avec succès");
});

bot.login(process.env.TOKEN);


bot.on('message', message => {
  // commande help
  if (message.content === prefix + "help") {
    message.channel.send("Liste des commandes: \n *burgerbot \n *fabriquant \n *embed \n *xp \n *kick \n *ban");
    console.log("Commande help effectué")
  }

  // commande création
  if (message.content === prefix + "burgerbot") {
    message.reply("Création du bot le _27/01/2018_ à _ 23h00_");
    console.log("Commande burgerbot effectué");
  }

  // commande dev
  if (message.content === prefix + "fabriquant") {
    message.reply("_Ce bot a été crée par Kingsman_");
    console.log("Commande fabriquant effectué");
  }
  // crée un Embed
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

  // enregistrement dans la base de l'XP
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
    // commande d'XP
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

    // Kick et Ban
    let command = message.content.split(" ")[0];
    const args = message.content.slice(prefix.length).split(/ +/);
    command = args.shift().toLowerCase();

    // kick Admin= role pour kick un membres
    if (command === "kick") {
      let modRole = message.guild.roles.find("name", "Admin");
      if (!message.member.roles.has(modRole.id)) {
        return message.reply("Tu n'as pas la permission de faire cette commande.").catch(console.error);
      }
      if (message.mentions.users.size === 0) {
        return message.reply("Merci de mentionner l'utilisateur à expulser.").catch(console.error);
      }
      let kickMember = message.guild.member(message.mentions.users.first());
      if (!kickMember) {
        return message.reply("Cet utilisateur est introuvable ou impossible à expulser.")
      }
      if (!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
        return message.reply("Je n'ai pas la permission KICK_MEMBERS pour faire ceci.").catch(console.error);
      }
      kickMember.kick().then(member => {
        message.reply(`${member.user.username} a été expulsé avec succès.`).catch(console.error);
        // général, channel pour afficher les kick
        message.guild.channels.find("name", "général").send(`**${member.user.username}** a été expulsé du discord par **${message.author.username}**.`)
      }).catch(console.error);
    }

    // ban, Admin = role permetant le ban
    if (command === "ban") {
      let modRole = message.guild.roles.find("name", "Admin");
      if (!message.member.roles.has(modRole.id)) {
        return message.reply("Tu n'as pas la permission de faire cette commande.").catch(console.error);
      }
      const member = message.mentions.members.first();
      if (!member) return message.reply("Merci de mentionner l'utilisateur à bannir");
      member.ban().then(member => {
        message.reply(`${member.user.username} a été banni avec succès.`).catch(console.error);
        // général, channel pour inscrire les ban
        message.guild.channels.find("name", "général").send(`**${member.user.username}** a été banni du discord par **${message.author.username}**`)
      }).catch(console.error);
    }
    
    // info | sondage
    if (message.content === prefix + "infodiscord") {
      var embed = new Discord.RichEmbed()
        .setDescription("Information du Discord")
        .addField("Nom du discord", message.guild.name)
        .addField("Crée le", message.guild.createdAt)
        .addField("Tu as rejoin le", message.member.joinedAt)
        .addField("Utilisateurs sur le discord", message.guild.memberCount)
        .setColor("0x0000FF")
      message.channel.send(embed);
    } 
    
    // sondage
    if (message.content.startsWith(prefix + "sondage")) {
      if (message.author.id === "519580124971270185") {
        let args = message.content.split(" ").slice(1);
        let thingToEcho = args.join(" ")
        var embed = new Discord.RichEmbed()
          .setDescription("Sondage")
          .addField(thingToEcho, "Répondre avec :white_check_mark: ou :x:")
          .setColor("0xB40404")
          .setTimestamp()//n'est pas obligatoire
        message.guild.channels.find("name", "sondage").send(embed)
          .then(function (message) {
            message.react("✔")
            message.react("✖")
          }).catch(function () {

        });
      } else {
        return message.reply("Tu n'as pas la permission.");
      }
    } 
  }
});
