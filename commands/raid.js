const { months, days } = require('../properties.json')

module.exports = {
    name: 'raid',
    args: false,
    usage: '', //TODO
    guildOnly: true,
    officerOnly: true,
    description: 'Lance un appel aux disponibilités de raid.',
    raid: [], // Array 2 dimensions. dans raid => chaque jour de la semaine / dans chaque jour => les joueurs
    execute(message, args) {
        const startOfWeek = findNextTuesday()
        message.channel.send(`Préparation d'un raid la semaine du **mardi ${startOfWeek.getDate()} ${months[startOfWeek.getMonth()]}**...`)
        for (const day in days) {
            const weekDay = new Date()
            weekDay.setDate(startOfWeek.getDate() + Number(day))
            const raidDay = {
                date: `${days[day]} ${weekDay.getDate()} ${months[weekDay.getMonth()]}`,
                players: [], // one player = { playerName, hour }
            }
            this.raid.push(raidDay)
        }
    },
}

const findNextTuesday = () => {
    const now = new Date()
    const nextTuesday = new Date()
    nextTuesday.setDate(now.getDate() + 7 - (now.getDay() + 5) % 7)
    return nextTuesday
}
