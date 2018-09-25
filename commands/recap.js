const { raid } = require('./raid')

module.exports = {
    name: 'recap',
    args: false,
    cooldown: 10,
    description: 'Demande un récapitulatif de l\'organisation actuelle pour le raid.',
    execute(message, args) {
        if (raid.length) {
            const data = []
            const data2 = []
            for (raidDay of raid) {
                if (Object.keys(raidDay.players).length) {
                    let str = `**${raidDay.date} :** `
                    for (playerName of Object.keys(raidDay.players)) {
                        str += `${playerName} (${raidDay.players[playerName]}), `
                    }
                    data.push(str.slice(0, -2))
                }
                const raidHour = organizeRaid(Object.values(raidDay.players))
                if (raidHour !== null) {
                    data2.push(`Il est possible de partir le **${raidDay.date}** à ${raidHour}`)
                }
            }
            message.channel.send(data.length ? data : "Personne ne s'est inscrit-e pour l'instant...")
            if (data2.length) message.channel.send(data2)
        } else return message.channel.send("Aucun raid n'a été préparé pour le moment !")
    },
}

const convertToMinutes = hour => {
    const tab = hour.split(/[Hh:]/).map(e => Number(e))
    return tab[0] * 60 + tab[1]
}

const convertToString = minutes => `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`

const findMax = array => array.reduce((acc, e) => acc = e > acc ? e : acc, array.pop())

// finds earliest hour for now
const organizeRaid = players => players.length >= 8 ? convertToString(findMax(players.map(e => convertToMinutes(e)))) : null
