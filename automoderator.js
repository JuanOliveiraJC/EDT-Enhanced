if (autoModerator !== undefined)
  autoModerator.close()

String.prototype.equalsIgnoreCase     = function(other)    { return typeof other !== 'string' ? false : this.toLowerCase() === other.toLowerCase(); };
var autoModeratorModel = require('app/base/Class').extend({
  version: "1.1.0",
	bannedWords: [
		'http://plug.dj',
		'http://www.plug.dj',
		'plug.dj/',
		':shit:',
		':poop:',
                ':trollface:',
                ':hankey:',
                'adf.ly',
                'adf.ly/',
                'http://adf.ly',
	],
	mutedUsers: [],
	init: function() {
		this.proxy = {
			chat:        $.proxy(this.onChat,          this),
			chatCommand: $.proxy(this.onChatCommand,   this),
		}
		API.on(API.CHAT,          this.proxy.chat);
		API.on(API.CHAT_COMMAND,  this.proxy.chatCommand);
		console.log('Anti Spam versão ' + this.version + ' ligado XD !')
		API.sendChat('pei pa')
	},
	close: function() {
		API.off(API.CHAT,          this.proxy.onChat);
		API.off(API.CHAT_COMMAND,  this.proxy.onChatCommand);
		console.log('Anti Spam versão ' + this.version + ' agora parado!')
	},
	onChat:function(data) {
		for (var i in this.bannedWords) {
			var message = data.message.toLowerCase();
			if (message.indexOf(this.bannedWords[i].toLowerCase()) > -1)
				API.moderateDeleteChat(data.chatID)
		};
		if (this.mutedUsers.indexOf(data.fromID) > -1)
			API.moderateDeleteChat(data.chatID);
	},
	onChatCommand: function(value) {
		if (value.indexOf('/banword') === 0) {
			var a = value.substr(8)
			if (this.bannedWords.indexOf(a) < 0) {
				this.bannedWords.push(a)
				API.sendChat(a + ' adicionada as palavras banidas')
			} else {
				this.bannedWords.splice(this.bannedWords.indexOf(a),1)
				API.sendChat(a + ' removida das palavras banidas')
			}
		}
		if (value.indexOf('/mute') === 0) {
			var user = this.getUserID(value.substr(5))
			if (user === null) API.chatLog('usuario não encontrado!')
			else {
				this.mutedUsers.push(user.id)
				API.sendChat(user.username + ' agora esta mutado')
			}
		}
		if (value.indexOf('/unmute') === 0) {
			var user = this.getUserID(value.substr(7))
			if (user === null) API.chatLog('usuario não encontrado!')
			else if (this.mutedUsers.indexOf(user.id) > -1) {
				this.mutedUsers.splice(this.mutedUsers.indexOf(user.id), 1);
				API.sendChat(user.username + ' não esta mais mutado')
			}
		}
	},
	getUserID: function(data) {
    	data = data.trim();
        if (data.substr(0,1) === '@')
            data = data.substr(1);
            var users = API.getUsers();
            for (var i in users) {
                if (users[i].username.equalsIgnoreCase(data) || users[i].id.equalsIgnoreCase(data))
                    return users[i];
            }
            return null;
        }
});
var autoModerator = new autoModeratorModel();
