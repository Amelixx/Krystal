const Discord = require(`discord.js`);

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let userToBan = await message.mentions.members.first()

    if (!userToBan.bannable) return message.channel.send(`:x: I don't have permission to ban this user.`)

    if (message.author != bot.users.cache.get(`97238312355364864`)) {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(`:x: You don't have permission to use this command.`)
        if (userToBan.highestRole.position >= message.member.highestRole.position) return message.channel.send(`:x: You don't have permission to ban this user.`)
    }

    let reason = await coreMessage.replace(`${args[1]} `, ``)
    if (reason == args[1]) reason = null
    if (!reason) reason = await `No reason specified.`
    
    if (!userToBan) return message.channel.send(`Usage: \`${prefix}ban [@User]\``)
    if (!userToBan.user.bot) await userToBan.send(`You were banned from ${message.guild.name} by ${message.author.tag}.\nReason: ${reason}`)

    await userToBan.ban(reason)

    if (await userToBan.guild.members.get(userToBan.user.id)) return message.channel.send(`:x: User was not banned.`)
    else if (await !userToBan.guild.members.get(userToBan.user.id)) message.channel.send(`Successfully banned ${userToBan.user.tag}.\nReason: ${reason}`)
    
}

module.exports.info = {
    name: `ban`,
    usage: `<user>`,
    type: `admin`,
    summary: `Bans a specfied user.`,
    help:
`You can ban a user with \`%PREFIX%ban (@user)\`.
Optionally, you can add a reason with \`%PREFIX%ban (@user) (reason)\``
}