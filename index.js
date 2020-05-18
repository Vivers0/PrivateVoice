/* Code by Dzoom (https://yougame.biz/threads/88864) */

const { Client } = require("discord.js")

var client = new Client();

var servers = {};

var roomsID = [];

client.on("ready",()=>{
    console.log(`Бот запущен.`);
})

client.on("voiceStateUpdate",(oldMember,newMember)=>{
    try {
    if(newMember.voiceChannel){
        //если комнаты для создания приваток не существует
        if(!newMember.voiceChannel.guild.channels.find(channel=>channel.name == "Создать комнату [+]")){
            newMember.voiceChannel.guild.createChannel("Private Room", { type: "category",
            permissionsOverwrites: [{
                id: newMember.guild.id,
                deny: ['MANAGE_MESSAGES'],
                allow: ['SEND_MESSAGES']
              }]
            }).then(room => {
                roomsID.push(room.id)
            })
            newMember.voiceChannel.guild.createChannel("Создать комнату [+]",{type:'VOICE',
            permissionOverwrites: [{
                id:newMember.guild.id,
                deny: ['ADMINISTRATOR','SPEAK'],
                allow: ['CONNECT']
            }]}).then(async room => {
                roomsID.push(room.id)
                await room.setParent(newMember.guild.channels.find(c => c.name === "Private Room"));
                await newMember.voiceChannel.guild.channels.find(channel=>channel.name == "Создать комнату [+]").setUserLimit(1, "Канал для создания приватных комнат")   
            })
        }
        //создаём приватку если пользователь зайдёт в канал
        if(newMember.voiceChannel.name == "Создать комнату [+]"){
            newMember.voiceChannel.guild.createChannel("Private",{type:'VOICE',
            permissionOverwrites: [{
                id:newMember.guild.id,
                deny: ['ADMINISTRATOR'],
                allow: ['CONNECT','SPEAK','VIEW_CHANNEL']
            }]}).then(async room => {
                try {
                await room.setParent(newMember.guild.channels.find(c => c.name === "Private Room"));
                await newMember.setVoiceChannel(room.id);
                await newMember.voiceChannel.guild.channels.find(c => c.id === roomsID[1]).overwritePermissions(newMember, {
                    CONNECT: false
                })
                newMember.voiceChannel.guild.channels.find(channel=>channel.id==room.id).overwritePermissions(newMember, {
                    KICK_MEMBERS:true,
                    MANAGE_CHANNELS:true   
                  });
                } catch(e) {
                    console.log(e)
                }
                if (newMember.voiceChannel.parentID !== roomsID[0]) return;
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
                        // oldMember.voiceChannel.guild.channels.find(channel=>channel.id == servers[newMember.guild.id].voiceMember[newMember.id].room).delete();
                        clearInterval(servers[newMember.guild.id].voiceMember[newMember.id].interval);
                    }
                },1000)
            })
        } 
    }
    //При выходе из канала, удаление приват комнаты
    if(!newMember.voiceChannel){
        oldMember.voiceChannel.guild.channels.find(c => c.id === roomsID[1]).overwritePermissions(newMember, {
            CONNECT: true
        });
        if (oldMember.voiceChannel.parentID !== roomsID[0]) return;
        if(!servers[newMember.guild.id])servers[newMember.guild.id] = {};
        if(!servers[newMember.guild.id].voiceMember)servers[newMember.guild.id].voiceMember = {};
        if(!servers[newMember.guild.id].voiceMember[newMember.id])servers[newMember.guild.id].voiceMember[newMember.id] = {};
        if(!servers[newMember.guild.id].voiceMember[newMember.id].room)servers[newMember.guild.id].voiceMember[newMember.id].room = 0;
        if(!oldMember.voiceChannel) return;
        if(servers[newMember.guild.id].voiceMember[newMember.id].room == oldMember.voiceChannel.id){
            oldMember.voiceChannel.guild.channels.find(channel=>channel.id == servers[newMember.guild.id].voiceMember[newMember.id].room).delete();
        }
        // if (oldMember.voiceChannel.members.size == 0) {
        //     oldMember.voiceChannel.guild.channels.find(channel=>channel.id == servers[newMember.guild.id].voiceMember[newMember.id].room).delete();
        // }
    }
} catch(e) {
    console.log(e)
}
}) 


client.login("NjQ3MDU0MjI5NzIyMTAzODE0.XsF8jA.Gt4h6N9snjfsH0XtnDytJFue87A");