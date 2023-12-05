// Import required modules
const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs').promises;

// Define the WelcomeBot class
class WelcomeBot {
    constructor(config) {
        // Store configuration and initialize Discord client
        this.config = config;
        this.client = new Client({ checkUpdate: false });

        // Set to keep track of greeted users
        this.greetedUsers = new Set();

        // Setup event listeners
        this.setupEvents();
    }

    // Method to log in the bot
    async login() {
        await this.client.login(this.config.token);
    }

    // Method to set up event listeners
    setupEvents() {
        this.client
            // Listen for new messages
            .on('messageCreate', this.handleMessage.bind(this))
            // Log a message when the bot is ready
            .on('ready', () => console.log('Bot está ativo!'));

        // Handle unhandled rejections and exceptions
        process
            .on('unhandledRejection', (reason, promise) => console.error('Promisse sem retorno:', reason))
            .on('uncaughtException', (err) => console.error('Erro sem retorno:', err));
    }

    // Method to handle incoming messages
    async handleMessage(message) {
        try {
            if (await this.isValidMessage(message)) {
                // Extract username from the message content
                const userName = message.content.split('puro hype! ')[1];

                // Greet the user if not greeted before
                if (!this.greetedUsers.has(userName)) {
                    this.greetedUsers.add(userName);

                    // Generate a random delay and welcome message
                    const delay = Math.floor(Math.random() * 5000) + 3000;
                    const welcomeMessages = [
                        `${userName} oii`,
                        `${userName} oie`,
                        `${userName} oi`,
                        `${userName} eae`,
                        `${userName} uwu >_>`,
                        `${userName} iai`,
                        `${userName} suavão?`,
                    ];

                    // Simulate typing and send the welcome message after the delay
                    message.channel.sendTyping();
                    setTimeout(() => {
                        const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
                        message.channel.send(welcomeMessages[randomIndex]);
                    }, delay);
                }
            }
        } catch (error) {
            console.error('Erro no evento "message":', error);
        }
    }

    // Method to check if a message is valid for processing
    async isValidMessage(message) {
        const { guild, channel, author, content } = message;
        const { guildId, channelId, botId, triggerPhrase } = this.config;

        return (
            guild && guild.id === guildId &&
            channel && channel.id === channelId &&
            author && author.id === botId &&
            content && content.startsWith(triggerPhrase)
        );
    }
}

// Main execution block
(async () => {
    // Read bot token from a file
    const config = {
        token: String(await fs.readFile('token.txt', 'utf-8')),
        guildId: '',
        channelId: '',
        botId: '',
        triggerPhrase: '',
    };

    // Create an instance of WelcomeBot and log in
    const welcomeBot = new WelcomeBot(config);
    await welcomeBot.login();
})();
