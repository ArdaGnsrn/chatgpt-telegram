export async function run(bot, msg) {
    const text = "Hello, This bot gives you AI-powered answers using ChatGPT. \nAvailable commands are:\n\n/newchat - Start a new chat"
    await bot.sendMessage(msg.chat.id, text, {
        reply_to_message_id: msg.message_id
    })
}