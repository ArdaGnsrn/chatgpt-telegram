import {ChatGPTAPIBrowser} from 'chatgpt'
import * as dotenv from 'dotenv'
import TelegramBot from 'node-telegram-bot-api'
import {sleep, convertExponentialToSymbol} from './app/utils.js'
import {oraPromise} from "ora";
import Queue from 'bee-queue';

const queue = new Queue('chatgpt');
import JSONdb from 'simple-json-db';
const db = new JSONdb('./app/storage.json');

import fs from "fs";
dotenv.config()
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});

const api = new ChatGPTAPIBrowser({
    email: process.env.OPENAI_EMAIL,
    password: process.env.OPENAI_PASSWORD,
    isGoogleLogin: true,
})
await api.initSession()

let commands = (await fs.promises.readdir("./commands"))
    .map((f) => {
        return {
            name: f.replace(".js", ""),
            module: import(`./commands/${f}`)
        }
    })

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const chatText = msg.text;

    if (chatText.startsWith("/")) {
        let splitText = chatText.split(" ", 1)
        let cmd = commands.find((c) => c.name === splitText[0].replace("/", ""))
        if (cmd) return (await cmd.module).run(bot, msg, splitText[1] ?? null, {
            db
        })
    }

    const thingMsgId = (await bot.sendMessage(chatId, '🤔', {
        reply_to_message_id: msg.message_id
    })).message_id;

    const job = await queue.createJob({
        chatId,
        thingMsgId,
        text: chatText
    }).save()

    job.on('failed', async () => {
        await job.retries(1).save();
    })
});


queue.process(async function (job, done) {
    const {text, chatId, thingMsgId} = job.data
    try {
        const chatInfo = db.has(chatId) ? db.get(chatId) : {}
        const chatSettings = {
            conversationId: chatInfo.conversationId ?? undefined,
            parentMessageId: chatInfo.lastMessage ?? undefined
        }

        let result = await oraPromise(api.sendMessage(text, chatSettings), {
            text: "Processing Message: " + text
        })

        let resp = result.response

        resp = convertExponentialToSymbol(resp)

        db.set(chatId, {conversationId: result.conversationId, lastMessage: result.messageId})
        await bot.editMessageText(resp, {
            chat_id: chatId,
            message_id: thingMsgId,
            parse_mode: 'Markdown'
        })
        return done()
    } catch (e) {
        console.log("Sleeping for 5 secs..")
        await sleep(5000)
        throw new Error("Error")
    }
});




