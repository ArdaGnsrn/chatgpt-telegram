# ChatGPT Telegram Bot

> **Note:** You need Redis Server to run the bot.

> **Note** This bot uses a [browser-based ChatGPT API](https://github.com/transitive-bullshit/chatgpt-api), please make sure you have Node.js >= 18 and a Chromium-based browser installed.

> The bot uses Google Account because of Recaptcha. The app asks you to pass a captcha verification if you don't log in with google.

## Usage

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the values
   1. `OPENAI_EMAIL` and `OPENAI_PASSWORD` is your Google account credentials.
   2. `TELEGRAM_TOKEN` is your Telegram bot token. If you don't have one, you can create one using [@BotFather](https://t.me/BotFather).
3. Run `npm install` to install dependencies
4. Run `npm start` to start the bot
5. Send `/start` to the bot to start chatting

## Features

- [X] Support multiple conversations, each chat has its own conversation.
- [X] You can clear your conversation by sending `/newchat`.
- [X] Queue system, if the bot is busy, it will queue your message and send it when it's free.
- [X] Thinking effect.
- [X] Rate limit to prevent spamming.
- [X] Authentication using Google Account.
- [X] Cloudflare captcha bypass.
- [X] Convert exponential numbers to symbols.

## License

[MIT](LICENSE) ©



