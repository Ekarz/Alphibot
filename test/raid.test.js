const raid = require('../commands/raid')

const message = {
    channel: {send: jest.fn()}
}

test('setup raid', () => {
    raid.execute(message)
    expect(raid.raid).toHaveLength(7)
    for (raidDay of raid.raid){
        expect(raidDay.players).toEqual({})
    }
    expect(message.channel.send).toHaveBeenCalled()
})
