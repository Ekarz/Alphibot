const { raid } = require('./raid')

module.exports = {
    name: 'recap',
    args: false,
    cooldown: 10,
    description: 'Demande un récapitulatif de l\'organisation actuelle pour le raid.',
    execute(message, args) {
        if (raid.length) {
            const data = []
            for (raidDay of raid) {
                if (Object.keys(raidDay.players).length) {
                    let str = `**${raidDay.date} :** `
                    for (playerName of Object.keys(raidDay.players)) {
                        str += `${playerName} (${raidDay.players[playerName]}), `
                    }
                    data.push(str.slice(0, -2))
                }
            }
            data.length ? message.channel.send(data) : message.channel.send("Personne ne s'est inscrit-e pour l'instant...")
        } else return message.channel.send("Aucun raid n'a été préparé pour le moment !")
    },
}
