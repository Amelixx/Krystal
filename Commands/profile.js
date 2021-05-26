const Discord = require(`discord.js`);

const modules = require(`../modules.js`)
const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, content, prefix) => {
    let Krystal = modules.Krystal(),
    description = "No description set."

    if (!content) {member = Krystal.member(message.author); description += `\nYou can customise this by typing \`k!custom profileDescription <your description>\``}
    else member = modules.getMember(Krystal, content, message.channel)
    if (member == undefined) return;

    let data = userinfo[member.id],
    partner = bot.users.cache.get(data.marriagePartner)

    try {
    if (!partner) partner = await bot.fetchUser(data.marriagePartner).then(x => {return x.tag})
    else partner = partner.tag
    } catch (e) {partner = `No one :c`}

    let embed = new Discord.MessageEmbed()
        .setColor(data.profile.colour || `#38a4e8`)
        .setTitle(`${member.displayName}'s Profile`)
        .setDescription(data.profile.description || description)
        
        .addField(`Balance`, `${data.credits}cr`, true)
        .addField(`Rank`, `${data.level} - ${data.xp}/${data.xpCap}`, true)
        .addField(`❤️Married To`, partner, true)

        .setFooter(data.profile.footer || `You can customise this too with k!custom profileFooter <Your footer>`)

    if (data.profile.thumbnail) embed.setThumbnail(data.profile.thumbnail)
    if (data.profile.image) embed.setImage(data.profile.image)

    message.channel.send({embed})
}

module.exports.info = {
    name: `profile`,
    type: `krystal`,
    summary: `View information on a particular user (or yourself).`
}