const { raid } = require('./raid')
const raidSize = 8

module.exports = {
    name: 'recap',
    args: false,
    cooldown: 10,
    guildOnly: true,
    raiderOnly: true,
    description: 'Demande un récapitulatif de l\'organisation actuelle pour le raid.',
    execute(message, args) {
        if (raid.length) {
            const data = []
            const data2 = []
            for (raidDay of raid) {
                const numberOfPlayers = Object.keys(raidDay.players).length
                if (numberOfPlayers) {
                    let str = `**[${numberOfPlayers}] ${raidDay.date} :** `
                    for (playerName of Object.keys(raidDay.players)) {
                        str += `${playerName} (${raidDay.players[playerName]}), `
                    }
                    data.push(str.slice(0, -2))
                }
                const raidHour = organizeRaid(raidDay.players)
                if (raidHour !== null) {
                    data2.push(`Il est possible de partir le **${raidDay.date}** :`)
                    for (const raidPossibility of Object.entries(raidHour)) {
                        data2.push(`- à ${convertToString(raidPossibility[0])} avec ${raidPossibility[1]}`)
                    }
                }
            }
            message.author.send(data.length ? data : "Personne ne s'est inscrit-e pour l'instant...")
            if (data2.length) message.channel.send(data2)
        } else return message.channel.send("Aucun raid n'a été préparé pour le moment !")
    },
}

const convertToMinutes = hour => {
    const tab = hour.split(/[Hh:]/).map(e => Number(e))
    return tab[0] * 60 + tab[1]
}

const convertToString = minutes => `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`

const organizeRaid = players => {
    const hours = Object.values(players).map(e => convertToMinutes(e))
    const playerNames = Object.keys(players)
    if (hours.length < raidSize) return null
    const result = {}
    while (hours.length >= raidSize) {
        const hour = Math.max(...hours)
        if (result[hour] === undefined) result[hour] = playerNames.slice()
        playerNames.splice(hours.indexOf(hour), 1)
        hours.splice(hours.indexOf(hour), 1)
    }
    return result
}
