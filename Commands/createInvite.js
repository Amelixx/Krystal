const Discord = require(`discord.js`);

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let guild = await modules.fetchGuild(coreMessage)
    if (!guild) return message.channel.send(`I couldn't find a guild ${message.author.username} D:`)

    let invite = await guild.channels.first().createInvite({maxAge: 60, maxUses: 1}, `So Rubix can join the server ( ͡° ͜ʖ ͡°)`)
    await message.channel.send(`I managed to create an invite! :D\nhttps://discord.gg/${invite.code}`)
}

module.exports.info = {
    name: `createinvite`,
    developer: true
}