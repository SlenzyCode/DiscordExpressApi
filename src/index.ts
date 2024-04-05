import Discord, { Client, Partials, IntentsBitField, EmbedBuilder } from "discord.js";
import express, { Request, Response } from 'express';
import { bot, web, settings } from "./config.json";
import chalk from "chalk";
import cors from "cors";

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

client.once("ready", () => {
    console.log(chalk.bgGreen(`${client.user?.tag} bot başarıyla bağlandı`));
});

client.on("messageCreate", async (message: Discord.Message) => {
    if (message.content === ".ping") {
        const embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${message.author.username} - Ping`, iconURL: client.user?.displayAvatarURL({ size: 4096 }) })
            .setDescription(`${client.user?.username} botumuzun gecikme hızı ${client.ws.ping}ms`)
            .setFooter({ text: `${message.author.username} tarafından istendi.`, iconURL: message.author.displayAvatarURL() })
        message.channel.send({ embeds: [embed] });
    };
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/message", (req: Request, res: Response) => {
    res.send("Merhaba, dünya!");
});

app.post("/api/post", (req: Request, res: Response) => {
    const { name, surname, age } = req.body;
    if (!name || !surname || !age) return res.status(400).json({ code: 400, message: "Lütfen bütün bilgileri doldurun." });
    const logChannel = client.channels.cache.get(settings.log_channel_id) as Discord.TextChannel | undefined;
    if (!logChannel) return res.status(500).json({ code: 500, message: "Log kanalı bulunamadı." });
    const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setAuthor({ name: `${client.user?.username} - Api Log`, iconURL: client.user?.displayAvatarURL() })
        .setDescription("Bir kullanıcı api'ye istek gönderiminde bulundu.")
        .addFields([
            { name: "👤 İsmi", value: name.toString(), inline: true },
            { name: "👤 Soyadı", value: surname.toString(), inline: true },
            { name: "👤 Yaşı", value: age.toString(), inline: true }
        ])
        .setFooter({ text: `${client.user?.username} © Tüm hakları saklıdır.`, iconURL: client.user?.displayAvatarURL() })
    logChannel.send({ embeds: [embed] });
    return res.json({
        message: {
            name,
            surname,
            age
        }
    });
});

app.listen(web.port, () => {
    console.log(chalk.bgGreen("Apiler başarıyla yüklendi"));
});

client.login(bot.token);