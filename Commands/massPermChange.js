const modules = require(`../modules.js`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!["449932895919013900", "97238312355364864"].includes(message.author.id)) return message.channel.send(`This command is restricted to like, one person but technically three people, and you're not one of them, sooooooooooooo`)

    if (!coreMessage) return message.channel.send("You need to enter something that I can search the categories for.")

    // Fetch category channels
    let categories = message.guild.channels.cache.filter(x => {return x.name.toLowerCase().startsWith(coreMessage.toLowerCase()) && x.type == "category"})
    channels = []
    list = ""
    categories.forEach(x => {
        list += `\`${x.name}\` - ${x.children.size} channels\n`
        channels = channels.concat(x.children.array())
    })

    if (!categories.size) return message.channel.send(`Couldn't find any categories starting with '${coreMessage}'`)

    let answer = await modules.sendQuestion(message.author, message.channel, `This will **delete** all specific role permissions on all channels in the categories below, and allow everyone to view them but not send to them.\nConfirm you are ok with this by sending "confirm", or just say "ok mistress krystal", idc.\n***(They're probably out of order, it'd be a waste of CPU power to sort them c:)***\n\n${list}`, (m) => {return ["confirm", "ok mistress krystal"].includes(m.content.toLowerCase())}, 60000)
    if (!answer) return;

    let length = channels.length,
    msg = await message.channel.send(`Ok, I've got ${length} more channels to go.`),
    start = Date.now()
    num = Math.round(length / 30)
    for (let i in channels) {
        let c = channels[i]

        await c.overwritePermissions([
            {
                id: message.guild.roles.everyone,
                allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                deny: ["SEND_MESSAGES", "ADD_REACTIONS"],
                type: "role"
            }
        ])

        if (i == num) await msg.edit(`Ok, I've got ${length - i} more channels to go.\nYou know, my developer was thinking of putting a progress bar here, but, I mean, while it would be cool.. maybe in another update.`)
        else if (i == num*2) await msg.edit(`Ok, I've got ${length - i} more channels to go.\nOh fuck it, it would be cool.\n\n${modules.progressBar(i, length, 60)}`)
        else if (i % num == 0 && i != 0) await msg.edit(`Ok, I've got ${length - i} more channels to go.\n<a:loveparrot:460507059780321281> Progress bar brought to you courtesy of Rubìx:tm:\n\n${modules.progressBar(i, length, 60)}`)
    }
    await msg.edit(`Updated ${length} channels in ${modules.getTimeString(Date.now() - start)}.\n\n████████████████████████████████████████████████████████████`)
    return true
}

module.exports.info = {
    name: `masspermchange`,
    type: `krystal`,
    aliases: [`perm`, `perms`],
    summary: `Mass change role permissions in a channel category.`,
    usage: ``
}