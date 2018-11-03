const { raid } = require('./raid')
const { unavailablePlayers } = require('./pasdispo')
const { raidersRoleId } = require('../config.json')

module.exports = {
    name: 'spam',
    guildOnly: true,
    officerOnly: true,
    description: "Relance les gens ayant le rôle Raiders qui n'ont pas encore donné leur dispo.",
    execute(message, args) {
        if (!raid.length) return message.channel.send("Aucun raid n'a été préparé pour le moment !")
        const raiders = message.guild.roles.get(raidersRoleId).members
            .map(m => m.user.id)
            .filter(e => !unavailablePlayers.map(e => e.id).includes(e))
        for (raidDay of raid) {
            const players = Object.keys(raidDay.players)
            for (player of players) {
                const index = raiders.indexOf(player.slice(2, -1))
                if (index >= 0) raiders.splice(index, 1)
            }
        }
        return message.channel.send(`${raiders.map(e => `<@${e}>`)}, merci de renseigner vos dispos !`)
    },
}
