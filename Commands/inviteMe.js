const Discord = require(`discord.js`);

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!coreMessage) return message.channel.send(`Invalid usage.`)
    guild = modules.fetchGuild(coreMessage)
    if (!guild) return message.channel.send(`Couldn't find a guild.`)
    if (Array.isArray(guild)) {
        console.log(guild)
        let string = modules.createGuildString(guild)
        
        return message.channel.send(`More than one guild found.\nValid Matches:\n${string}`)
    }
    
    let invite = await modules.findInvite(guild)
    if (!invite) return message.channel.send(`No invites found.`)
    else message.channel.send(`Invite acquired.\nhttps://discord.gg/${invite.code}`)


}

module.exports.info = {
    name: `inviteme`,
    developer: true
}