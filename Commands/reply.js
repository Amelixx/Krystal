const Discord = require(`discord.js`)

const settings = require(`../config.json`)
const modules = require(`../modules.js`)

const globalStats = require(`../JSON/Stats/globalStats.json`);
module.exports.run = async (bot, message, args, content, prefix) => {
    if (![`635572357217648643`, `97238312355364864`].includes(message.author.id)) return message.channel.send(`You don't have permission to run this command.`)

    if (!globalStats.lastDM) return message.channel.send(`No one to reply to?`)
    let user = bot.users.cache.get(globalStats.lastDM);
    if (!user) return message.channel.send(`Can't find the user to reply to. They must have left all servers I'm in.`)

    user.send(content).then(x => {message.react(`✔`).then(x => {x.remove()})}).catch(err => {message.channel.send(`Couldn't send reply. Perhaps I've been blocked?`)})
}

module.exports.info = {
    name: `reply`,
    type: `omniverse`,
    noHelp: true
}