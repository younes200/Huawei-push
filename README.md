# HMS Push
> Huawei HMS Android Push Service for NodeJS

The SDK for Node version is not officially provided, this SDK is in adaptation to the official document [Huawei Push Service SDK for server](http://developer.huawei.com/cn/consumer/wiki/index.php)

Upgrade to [HMS](http://developer.huawei.com/consumer/cn/service/hms/catalog/huaweipush_agent.html?page=hmssdk_huaweipush_devguide_server_agent)

At present, only the Android notification push function is implemented. Other implementations will be added later.

# Supported features

- Message: Used to construct the content of the message to be sent
- Notification: Notification  push related

# Install

    npm install huawei-push --save

# Usage

```
var msg = new Message();
msg
  .title('title example')
  .content('description example')
  .extras({'user_id': 4843, 'target': 'Greedy Land'});
var notification = new Notification({
  appId: 'your appId',
  appSecret: 'your appSecret',
  appPkgName: 'your app package name',
});
notification.send('your device token', msg, config.callback);
```

* Note that custom information Huawei interface needs to transfer Array, but I find it inconvenient, so here can support transfer dictionary.

Use examples can be seen[example](./example).

# API

Please refer to [Huawei Push Service Server SDK (HuaweiPushServiceSDK for server)](http://developer.huawei.com/cn/consumer/wiki/index.php)。

# Licence
MIT
