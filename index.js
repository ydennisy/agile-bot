/**
 * Created by dennisy on 12/07/2016.
 */
'use strict';

var SlackBot = require('slackbots');
var events = require('events');
var _ = require('underscore');

var secret = require('./secret');

const botChannel = 'testagilebot';

var eventEmitter = new events.EventEmitter();
var bot = new SlackBot({
    token : secret.token,
    name : 'agilebot'
});

console.log(secret.token);

bot.on('start', function () {
   bot.postMessageToChannel(botChannel, 'agilebot server is up!');
});

bot.on('message', parseMessage);

function parseMessage (data) {
    if (data.type == 'message'){
        var str = (JSON.stringify(data.text))
                        .toLowerCase()
                        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        console.log(str);
        if (str.indexOf('standup') > 0){
            var userMakingRequest = data.user;
            eventEmitter.emit('standUpRequested', userMakingRequest);
        }
    }
}
eventEmitter.on('standUpRequested', beginStandUp);

function beginStandUp(userMakingRequest) {
    console.log('Starting standup....');
    bot.getUserId(userMakingRequest).then(function (data) {
        var userForStandUp = data.name;
        bot.postMessageToChannel(botChannel, 'hello ' + userForStandUp + ', are you all good?');
    })
}


function getUserName (id) {
    bot.getUserId(id)
        .then(function(data) {
            // console.log(data.name);
            return data.name;
        })
        .fail(function (error) {
            console.log(error);
        })
}