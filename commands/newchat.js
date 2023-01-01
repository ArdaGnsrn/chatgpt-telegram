export async function run(bot, msg, args, {db}) {
    db.delete(msg.chat.id)
    await bot.sendMessage(msg.chat.id, 'Your old chat has been deleted.', {
        reply_to_message_id: msg.message_id
    })
}