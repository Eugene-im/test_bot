const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config.json');
const text = require('./config/text.json');

const token = config.token;

const bot = new TelegramBot(token, { polling: true });


// bot.onText(/\/echo (.+)/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const resp = match[1];
//   bot.sendMessage(chatId, resp);
// });

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, 'Received your message');
// });


const commands = {
    edit: 'edit',
    enter: 'enter',
    callAdmin: 'call',
    test: 'test',
    test1: 'test1',
    functionality: 'functionality'
}

const keyboard = [
    [{
        text: '1',
        callback_data: '1'
    }, {
        text: '2',
        callback_data: '2'
    }, {
        text: '3',
        callback_data: '3'
    }],
    [{
        text: '4',
        callback_data: '4'
    }, {
        text: '5',
        callback_data: '5'
    }, {
        text: '6',
        callback_data: '6'
    }],
    [{
        text: '7',
        callback_data: '7'
    }, {
        text: '8',
        callback_data: '8'
    }, {
        text: '9',
        callback_data: '9'
    }],
    [{
        text: text.buttons.clear,
        callback_data: commands.edit
    }, {
        text: '0',
        callback_data: '0'
    }, {
        text: text.buttons.enter,
        callback_data: commands.enter
    }]
];

const keyboard2 = [
    [{
        text: `${text.buttons.contact}`,
        request_contact: true
    },
    //  {
    //     text: text.buttons.location,
    //     request_location: true
    // },
    {
        text: text.buttons.pol,
        request_poll: { type: 'test' }
    }, {
        text: text.buttons.test,
    }],
];
const keyboard3 = [
    [{
        text: text.buttons.test1,
        callback_data: commands.test1
    }, {
        text: text.buttons.callAdmin,
        callback_data: commands.callAdmin
    }, {
        text: text.buttons.test3,
        url: "https://google.com"
    }]
];



let flag = '';

bot.onText(/\/start/, (msg) => {
    let option = {
        parse_mode: "HTML",
        reply_markup: {
            one_time_keyboard: true,
            keyboard: keyboard2
        }
    };
    bot.sendMessage(msg.chat.id, `${text.message.start1}`, option).then(_ => flag = _);

});

bot.onText(/\/test/, (msg) => {
    let opts = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: keyboard3
        }
    };
    bot.sendMessage(msg.chat.id, 'test done', opts).then(_ => flag = _).then(_ => console.log("test done can do something else"));
});

bot.on('contact', (msg) => {
    msg.date = new Date().toUTCString();
    console.log('contacts', msg);
    userData = msg.contact;
    let opts = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: keyboard
        }
    };
    bot.sendMessage(msg.from.id, `${text.message.start3}`).then(bot.sendMessage(msg.from.id, `>`, opts).then(_ => flag = _));
});

// bot.on('location', (msg) => {
//     msg.date = new Date().toUTCString();
//     console.log('contacts', msg);
//     userData = msg.contact;
//     let opts = {
//         parse_mode: 'HTML',
//         reply_markup: {
//             inline_keyboard: keyboard
//         }
//     };
//     bot.sendMessage(msg.from.id, `${text.message.start3}`).then(bot.sendMessage(msg.from.id, `>`, opts).then(_ => flag = _));
// });

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    console.log("callBack", callbackQuery);
    console.log("flag", flag);
    // const { message: { chat, message_id, text } } = callbackQuery;
    // console.log(message);
    let action = callbackQuery.data;
    let msg = callbackQuery.message;
    let opts = {
        chat_id: msg.chat.id,
        message_id: flag.message_id,
        reply_markup: {
            inline_keyboard: keyboard
        }
    };
    let finalOpt = {
        chat_id: msg.chat.id,
        message_id: flag.message_id
    }
    let txt = flag.text;

    switch (action) {
        case commands.edit:
            txt = flag.text.slice(0, -1);
            flag.text = txt;
            bot.editMessageText(txt, opts);
            break
        case commands.test1:
            console.log("test1 done from cbQ");
            bot.sendMessage(callbackQuery.message.chat.id, "ok");
            break
        case commands.enter:
            console.log("enter");
            console.log(flag);
            txt = flag.text.slice(1);
            console.log(finalOpt)
            bot.sendMessage(text.message.thk, finalOpt);
            flag = '';
            break
        default:
            console.log("def")
            txt += action;
            flag.text = txt;
            bot.editMessageText(txt, opts);
    }
});

bot.on('polling_error', (error) => {
    console.log(error, 'bot_error_log');
    console.log(error.code); // => 'EFATAL'
});