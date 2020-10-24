// The message structure
// {
//   id: '2105306037230366285',
//     from: {
//   id: 490179759,
//     is_bot: false,
//     first_name: 'Dud',
//     username: 'dudad1',
//     language_code: 'en'
// },
//   message: {
//     message_id: 72,
//       from: {
//       id: 1372304744,
//         is_bot: true,
//         first_name: 'Portobot_Dudi',
//         username: 'Dudi_Portobot'
//     },
//     chat: {
//       id: 490179759,
//         first_name: 'Dud',
//         username: 'dudad1',
//         type: 'private'
//     },
//     date: 1603540472,
//       text: 'Get Current Status for:',
//       reply_markup: { inline_keyboard: [Array] }
//   },
//   chat_instance: '-7501195965987024978',
//     data: '0902-5537-2054'
// }


module.exports = class TelegramMessage {
	constructor(msg) {
		const { message, from } = msg;
		this.id = msg.id;
		this.from = from;
		this.text = msg.text;
		this.data = msg.data;
		this.chatInstance = msg.chat_instance;
		this.originalMessage = {
		  id: message.message_id,
		  from: message.from,
      chat: message.chat,
      text: message.text,
      date: message.date,
    };
	}

	getUserId() {
    return this.from.id;
  }
  getFirstName(){
      return this.from.first_name;
  }
  getLastName(){
      return this.from.last_name;
  }
  getUsername(){
      return this.from.username;
  }
  getLanguage(){
      return this.from.language_code;
  }
	getChatId() {
		return this.originalMessage.chat.id;
    }
  getText(){
      return this.originalMessage.text;
  }
  getData(){
    return this.data;
  }
};
