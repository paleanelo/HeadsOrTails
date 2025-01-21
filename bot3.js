const { Bot, InlineKeyboard } = require("grammy");

const bot = new Bot("7673247740:AAHyf5P7fVbcEYh4Wrry_maaKOFzHWLMvgo"); //GuessTheNumber_testtest_bot


const userGames = {};


bot.command("start", (ctx) => {
    ctx.reply(
        "Добро пожаловать в игру 'Угадай число'! 🤔\n\n" +
        "Я загадаю число от 1 до 100, а вы должны его угадать.\n" +
        "Для начала игры используйте команду /play.\n\n" +
        "Для справки используйте команду /help."
    );
});


bot.command("help", (ctx) => {
    ctx.reply(
        "Правила игры:\n" +
        "1. Используйте /play, чтобы начать игру.\n" +
        "2. Я загадаю число от 1 до 100.\n" +
        "3. Вы вводите числа, чтобы попытаться угадать.\n" +
        "4. Я подскажу, больше или меньше ваше число относительно загаданного.\n" +
        "5. Побеждает тот, кто угадает число!\n\n" +
        "Удачи! 🎉"
    );
});


bot.command("play", (ctx) => {
    const userId = ctx.from.id;

    const randomNumber = Math.floor(Math.random() * 100) + 1;
    userGames[userId] = { number: randomNumber, attempts: 0 };

    ctx.reply(
        "Я загадал число от 1 до 100. Попробуйте угадать! Введите ваше предположение:"
    );
});


bot.on("message:text", async (ctx) => {
    const userId = ctx.from.id;

    if (!userGames[userId]) {
        ctx.reply(
            "Вы ещё не начали игру. Используйте команду /play, чтобы начать."
        );
        return;
    }

    const userGuess = parseInt(ctx.message.text, 10);
    const game = userGames[userId];


    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        ctx.reply("Пожалуйста, введите число от 1 до 100.");
        return;
    }

    game.attempts += 1;

    if (userGuess === game.number) {
        await ctx.reply(
            `Поздравляем! 🎉 Вы угадали число ${game.number} за ${game.attempts} попыток.`
        );

        const playAgainKeyboard = new InlineKeyboard()
            .text("Да", "play_again")
            .text("Нет", "end_game");

        await ctx.reply("Хотите сыграть еще раз?", {
            reply_markup: playAgainKeyboard,
        });

        delete userGames[userId];
    } else if (userGuess < game.number) {
        ctx.reply("Моё число больше. Попробуйте снова!");
    } else {
        ctx.reply("Моё число меньше. Попробуйте снова!");
    }
});


bot.on("callback_query:data", async (ctx) => {
    const userId = ctx.from.id;

    if (ctx.callbackQuery.data === "play_again") {

        const randomNumber = Math.floor(Math.random() * 100) + 1;
        userGames[userId] = { number: randomNumber, attempts: 0 };

        await ctx.reply(
            "Я загадал новое число от 1 до 100. Попробуйте угадать! Введите ваше предположение:"
        );
    } else if (ctx.callbackQuery.data === "end_game") {
        await ctx.reply("Спасибо за игру! Возвращайтесь снова. 😊");
    }

    await ctx.answerCallbackQuery();
});


bot.start();
console.log('Бот запущен...');