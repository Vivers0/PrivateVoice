const { Client } = require("discord.js")
var client = new Client();

var servers = {};

var roomsID = "";
var parentID = "";

client.on("ready",()=>{
    console.log(`Бот запущен.`);
})

client.on("voiceStateUpdate",(oldMember,newMember)=>{
    try {
    if(newMember.voiceChannel){        
        //создаём приватку если пользователь зайдёт в канал
        if(newMember.voiceChannel.id == roomsID){
            newMember.voiceChannel.guild.createChannel("Private",{type:'VOICE',
            permissionOverwrites: [{
                id:newMember.guild.id,
                deny: ['ADMINISTRATOR'],
                allow: ['CONNECT','SPEAK','VIEW_CHANNEL']
            }]}).then(async room => {
                await room.setParent(parentID)
                await newMember.setVoiceChannel(room.id);
                newMember.voiceChannel.guild.channels.find(c => c.id === roomsID).overwritePermissions(newMember, {
                    CONNECT: false
                });
                newMember.voiceChannel.guild.channels.find(channel=>channel.id==room.id).overwritePermissions(newMember, {
                    KICK_MEMBERS:true,
                    MANAGE_CHANNELS:true   
                  });

                if(!servers[newMember.guild.id])servers[newMember.guild.id] = {};
                if(!servers[newMember.guild.id].voiceMember)servers[newMember.guild.id].voiceMember = {};
                if(!servers[newMember.guild.id].voiceMember[newMember.id])servers[newMember.guild.id].voiceMember[newMember.id] = {};
                if(!servers[newMember.guild.id].voiceMember[newMember.id].room)servers[newMember.guild.id].voiceMember[newMember.id].room = room.id;
                servers[newMember.guild.id].voiceMember[newMember.id].room = room.id;
                if(!servers[newMember.guild.id].voiceMember[newMember.id].interval)servers[newMember.guild.id].voiceMember[newMember.id].interval = {};
                servers[newMember.guild.id].voiceMember[newMember.id].interval = setInterval(()=>{
                    if(newMember.voiceChannel){
                        if(servers[newMember.guild.id].voiceMember[newMember.id].room != newMember.voiceChannel.id){
                            newMember.voiceChannel.guild.channels.find(channel=>channel.id == servers[newMember.guild.id].voiceMember[newMember.id].room).delete();
                            clearInterval(servers[newMember.guild.id].voiceMember[newMember.id].interval);
                        }
                    }else if(!newMember.voiceChannel){
                        clearInterval(servers[newMember.guild.id].voiceMember[newMember.id].interval);
                    }
                },3000)
            })
        } 
    }
    //При выходе из канала, удаление приват комнаты
    if(!newMember.voiceChannel){
        oldMember.voiceChannel.guild.channels.find(c => c.id === roomsID).overwritePermissions(newMember, {
            CONNECT: true
        });
        if(!servers[newMember.guild.id])servers[newMember.guild.id] = {};
        if(!servers[newMember.guild.id].voiceMember)servers[newMember.guild.id].voiceMember = {};
        if(!servers[newMember.guild.id].voiceMember[newMember.id])servers[newMember.guild.id].voiceMember[newMember.id] = {};
        if(!servers[newMember.guild.id].voiceMember[newMember.id].room)servers[newMember.guild.id].voiceMember[newMember.id].room = 0;
        if(!oldMember.voiceChannel) return;
        if(servers[newMember.guild.id].voiceMember[newMember.id].room == oldMember.voiceChannel.id){
            oldMember.voiceChannel.guild.channels.find(channel=>channel.id == servers[newMember.guild.id].voiceMember[newMember.id].room).delete();
        }
    }
} catch(e) {
    console.log(e)
}
}) 

client.login("Your Token")