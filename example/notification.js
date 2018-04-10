var HwPush = require('../lib');
var Message = HwPush.Message;
var Notification = HwPush.Notification;

var config = require('./config');

var msg = new Message();
msg
  .title('title example')
  .content('description example');

var notification = new Notification({
  appId: config.appId,
  appSecret: config.appSecret,
  appPkgName: config.appPkgName
});

notification.send(config.tokens, msg, config.callback);
