const { Bot, InlineKeyboard } = require("grammy");

const bot = new Bot("7452427840:AAEpJ7Lpg54mIIj-Js7t_smEeYKF8B4Qd_M");


bot.command("start", (ctx) => {
    ctx.reply(
        "Добро пожаловать в игру 'Орел и решка'! 🎲\n\n" +
        "Вы можете сделать ставку на 'Орел' или 'Решка'. Используйте команду /play, чтобы начать игру.\n\n" +
        "Для справки используйте команду /help."
    );
});


bot.command("help", (ctx) => {
    ctx.reply(
        "Правила игры:\n" +
        "1. Используйте /play, чтобы начать игру.\n" +
        "2. Сделайте ставку, выбрав 'Орел' или 'Решка'.\n" +
        "3. Бот случайным образом определит результат и сообщит, выиграли вы или нет.\n\n" +
        "Приятной игры!"
    );
});


function flipCoin() {
    return Math.random() < 0.5 ? "Орел" : "Решка";
}


bot.command("play", (ctx) => {
    startGame(ctx);
});


function startGame(ctx) {
    const keyboard = new InlineKeyboard()
        .text("Орел", "heads")
        .text("Решка", "tails");

    ctx.reply("Сделайте вашу ставку:", { reply_markup: keyboard });
}


bot.on("callback_query:data", async (ctx) => {
    const userChoice = ctx.callbackQuery.data;

    if (userChoice === "heads" || userChoice === "tails") {
        const userChoiceText = userChoice === "heads" ? "Орел" : "Решка";
        const result = flipCoin();

        const win = (userChoiceText === result);
        const outcomeMessage = win
            ? `Поздравляем, вы выиграли! 🎉`
            : `К сожалению, вы проиграли. 😢`;

        await ctx.reply(`Вы выбрали: ${userChoiceText}\nРезультат: ${result}\n${outcomeMessage}`);

        const playAgainKeyboard = new InlineKeyboard()
            .text("Да", "play_again")
            .text("Нет", "end_game");

        await ctx.reply("Хотите сыграть еще раз?", { reply_markup: playAgainKeyboard });
    } else if (userChoice === "play_again") {
        startGame(ctx);
    } else if (userChoice === "end_game") {
        await ctx.reply("Спасибо за игру! Возвращайтесь снова. 😊");
    }

    await ctx.answerCallbackQuery();
});


bot.start();
console.log('Бот запущен...');
