/* Code by Dzoom (https://yougame.biz/threads/88864) */

const { Client } = require("discord.js")
const createPrivateRoom = require("./createPrivateRoom.js");

var client = new Client();

client.on("ready",()=>{
    console.log(`Бот запущен.`);
})

client.on("voiceStateUpdate",(oldMember,newMember)=>{
    createPrivateRoom(oldMember,newMember)
})

client.login("NjQ3MDU0MjI5NzIyMTAzODE0.Xr_vYw.L8jHpWcQv2KupoCh_fWxyzn85bs");