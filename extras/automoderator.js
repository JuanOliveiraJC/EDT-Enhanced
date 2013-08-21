if (autoModerator !== undefined)
  autoModerator.close()

String.prototype.equalsIgnoreCase     = function(other)    { return typeof other !== 'string' ? false : this.toLowerCase() === other.toLowerCase(); };
var autoModeratorModel = require('app/base/Class').extend({
  version: "3.1.5",
	bannedWords: [
		'http://plug.dj',
		'http://www.plug.dj',
		'plug.dj/',
                'adf.ly',
                'adf.ly/',
                'http://adf.ly',
                'is now your fan!',
                'is now your fan',
                'is now your fa',
                'is now your fã',
                '/me is now your fan!',
                '/em is now your fan!',
                '/me is now your fã',
                '/em is now your fã',
                'is now your fã!',
                'is now your fa!',
                '/me is now your fa',
                '/em is now your fã!',
                '/me is now your fa!',
                'agora e seu fa',
                '/me agora e seu fa',
                '/em agora e seu fa',
                'agora e seu fa!',
                'agora e seu fã',
                'agora e seu fã!',
                '/em agora e seu fa!',
                '/em agora e seu fã!',
                '/em agora e seu fã',
                '/me agora e seu fa!',
                '/me agora e seu fa!',
                '/me agora e seu fã!',
                '/me agora e seu fã',
                ':trollface:',
                ':poop',
                ':shit:',
                ':hankey:'
	],
	mutedUsers: [],
	init: function() {
		this.proxy = {
			chat:        $.proxy(this.onChat,          this),
			chatCommand: $.proxy(this.onChatCommand,   this),
		}
		API.on(API.CHAT,          this.proxy.chat);
		API.on(API.CHAT_COMMAND,  this.proxy.chatCommand);
		API.chatLog('Anti Spam versão ' + this.version + ' ligado !')
	},
	close: function() {
		API.off(API.CHAT,          this.proxy.onChat);
		API.off(API.CHAT_COMMAND,  this.proxy.onChatCommand);
		API.chatLog('Anti Spam desligado')
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
				API.chatLog(a + ' adicionada as palavras banidas')
			} else {
				this.bannedWords.splice(this.bannedWords.indexOf(a),1)
				API.chatLog(a + ' removida das palavras banidas')
			}
		}
		if (value.indexOf('/mute') === 0) {
			var user = this.getUserID(value.substr(5))
			if (user === null) API.chatLog('usuario não encontrado!')
			else {
				this.mutedUsers.push(user.id)
				API.chatLog(user.username + ' agora esta mutado')
			}
		}
		if (value.indexOf('/unmute') === 0) {
			var user = this.getUserID(value.substr(7))
			if (user === null) API.chatLog('usuario não encontrado!')
			else if (this.mutedUsers.indexOf(user.id) > -1) {
				this.mutedUsers.splice(this.mutedUsers.indexOf(user.id), 1);
				API.chatLog(user.username + ' não esta mais mutado')
			}
		}
		if (value.indexOf('/reload') === 0) {
			API.chatLog('Reiniciando...');
                        setTimeout(function() {$.getScript('https://raw.github.com/TNBUP/blah/master/extras/automoderator.js')},1000)
                        return;
		}
		if (value.indexOf('/die') === 0) {return autoModerator.close()}
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
