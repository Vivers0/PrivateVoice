{ Client } = require 'discord.js'
client = new Client
{ token, voiceID, parentID } = require "../../cfg/config.json"

client.login(token)

config = {
    voice: "712181617510318230",
    parent: "712181616608280576"
}

client.on('ready', () -> console.log("Ready!"))

client.on('voiceStateUpdate', (oldState, newState) ->
    if not oldState.guild.channels.cache.has(voiceID) or not oldState.guild.channels.cache.has(voiceID)
        throw Error("Не указано либо айди канала, либо айди категории")
    if newState.channelID == voiceID
        newState.guild.channels.create('Private', {
            type: "VOICE",
            parent: parentID,
            permissionOverwrites: [
                {
                    id: newState.guild.id,
                    allow: ["VIEW_CHANNEL"]
                },
                {
                    id: newState.member.id,
                    allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS"]
                }
            ]
        }).then((ch) -> newState.setChannel(ch))

     if oldState.channel and not oldState.channel.members.size and oldState.channel.parentID == parentID and oldState.channelID isnt voiceID
        oldState.channel.delete()
)