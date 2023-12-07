const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs').promises;

class WelcomeBot {
    constructor(config,messages) {
        this.config = config;
        this.messages = messages;
        this.client = new Client({ checkUpdate: false });

        this.greetedUsers = new Set();

        this.setupEvents();
    }

    async login() {
        await this.client.login(this.config.token);
    }

    setupEvents() {
        this.client
            .on('messageCreate', this.handleMessage.bind(this))
            .on('ready', () => console.log('Bot está ativo!'));

        process
            .on('unhandledRejection', (reason, promise) => console.error('Promisse sem retorno:', reason))
            .on('uncaughtException', (err) => console.error('Erro sem retorno:', err));
    }

    async handleMessage(message) {
        try {
            if (await this.isValidMessage(message)) {
                const userName = String(message.content.split('<@')[1]).split(">")[0];

                if (!this.greetedUsers.has(userName)) {
                    this.greetedUsers.add(userName);

                    const delay = Math.floor(Math.random() * 5000) + 3000;
                    const welcomeMessages = this.messages;

                    message.channel.sendTyping();
                    setTimeout(() => {
                        const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
                        message.channel.send(String(welcomeMessages[randomIndex]).replace("{USER}", `<@${userName}>`));
                    }, delay);
                }
            }
        } catch (error) {
            console.error('Erro no evento "message":', error);
        }
    }
    async isValidMessage(message) {
        const { guild, channel, author } = message;
        const { guildId, channelId, botId } = this.config;

        return (
            guild && guild.id === guildId &&
            channel && channel.id === channelId &&
            author && author.id === botId
        );
    }
}

(async () => {
    const config = require('./src/config.json');
    const messages = (await fs.readFile('./src/mensagens.txt', 'utf-8')).split("\r\n");

    const welcomeBot = new WelcomeBot(config,messages);
    await welcomeBot.login();
})();
