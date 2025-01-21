const { Bot, InlineKeyboard } = require("grammy");

const bot = new Bot("7571928004:AAHrG4wa_vp-ucAfGkRU-a6sWrequJFXovQ"); //RockPaperScissors_testtest_bot


bot.command("start", (ctx) => {
    ctx.reply(
        "Добро пожаловать в игру 'Камень, ножницы, бумага'! ✊✋✌️\n\n" +
        "Выберите один из вариантов, чтобы сыграть с ботом.\n\n" +
        "Для начала игры используйте команду /play.\n" +
        "Для справки используйте команду /help."
    );
});


bot.command("help", (ctx) => {
    ctx.reply(
        "Правила игры:\n" +
        "1. Используйте /play, чтобы начать игру.\n" +
        "2. Выберите 'Камень', 'Ножницы' или 'Бумага'.\n" +
        "3. Бот также сделает выбор.\n" +
        "4. Побеждает тот, чья комбинация сильнее:\n" +
        "   - Камень бьет ножницы\n" +
        "   - Ножницы режут бумагу\n" +
        "   - Бумага накрывает камень\n\n" +
        "Удачи!"
    );
});


const choices = ["Камень", "Ножницы", "Бумага"];

function getBotChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}


function determineWinner(playerChoice, botChoice) {
    if (playerChoice === botChoice) {
        return "Ничья! 🤝";
    }
    if (
        (playerChoice === "Камень" && botChoice === "Ножницы") ||
        (playerChoice === "Ножницы" && botChoice === "Бумага") ||
        (playerChoice === "Бумага" && botChoice === "Камень")
    ) {
        return "Вы выиграли! 🎉";
    }
    return "Вы проиграли. 😢";
}


bot.command("play", (ctx) => {
    startGame(ctx);
});


function startGame(ctx) {
    const keyboard = new InlineKeyboard()
        .text("Камень", "rock")
        .text("Ножницы", "scissors")
        .text("Бумага", "paper");

    ctx.reply("Сделайте ваш выбор:", { reply_markup: keyboard });
}


bot.on("callback_query:data", async (ctx) => {
    const userChoice = ctx.callbackQuery.data;

    if (userChoice === "rock" || userChoice === "scissors" || userChoice === "paper") {
        const userChoiceText =
            userChoice === "rock" ? "Камень" :
            userChoice === "scissors" ? "Ножницы" : "Бумага";
        const botChoice = getBotChoice();
        const result = determineWinner(userChoiceText, botChoice);

        await ctx.reply(
            `Вы выбрали: ${userChoiceText}\nБот выбрал: ${botChoice}\n\n${result}`
        );

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
