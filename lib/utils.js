var _ = require('lodash');
var urllib = require('urllib');
var debug = require('debug')('huawei_push:utils');
var constant = require('./constant');
var hw_token = {
  'access_token': 0,
  'expire': 0
};

var defaults = {
  timeout: 5000
};

function requestAccess(callback) {
  debug('requestAccess');
  var nowSeconds = Math.floor(Date.now() / 1000);

  if (hw_token['expire'] > nowSeconds) {
    callback(null, hw_token['access_token']);
  }
  url = constant.accessTokenAPI;
  data = {
    'client_id': this.options.appId,
    'client_secret': this.options.appSecret,
    'grant_type': 'client_credentials'
  };

  var options = {
    method: 'POST',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    contentType: 'application/x-www-form-urlencoded',
    dataType: 'json',
    timeout: this.options.timeout
  };

  urllib.request(url, options, function(err, data) {
    debug('response:', err, data);

    if (err) {
      callback(err, null);
    }

    if (data === undefined) {
      err = new Error('request access_token response is undefined');
      return callback(err, null);
    }

    if (data.error) {
      err = new Error(data.error_description);
      return callback(err, null);
    }

    hw_token['expire'] = nowSeconds + data['expires_in'];
    hw_token['access_token'] = data['access_token'];
    callback(null, hw_token['access_token']);
  });
}

function requestNotification(token, data, appMethod, option, callback) {
  url = constant.baseAPI;
  debug('request:', url, data);
  var body = {title:data.android.notification_title,content:data.android.notification_content};
  var param = {appPkgName: option.appPkgName};
  var action = {type: 3, param: param};
  var msg = {type:3, action:action, body: body};
  var hps = {msg: msg, customize: data.android.extras};
  var payload = {hps: hps};

  var params =  "access_token="+encodeURIComponent(hw_token['access_token'])+
                "&nsp_svc="+constant.apiMethod + appMethod+
                "&nsp_ts="+Math.floor(Date.now() / 1000)+
                "&device_token_list="+encodeURIComponent(JSON.stringify([token]))+
                "&payload="+encodeURIComponent(JSON.stringify(payload));

  var options = {
    method: 'POST',
    data: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    dataType: 'json',
    timeout: defaults.timeout
  };
  var url = url + "?nsp_ctx="+encodeURIComponent(JSON.stringify({"ver":"1", "appId":option.appId}))
  urllib.request(url, options, function(err, data, res) {
    debug('response:', err, data);
    if (err) {
      return callback(err);
    }

    if (data === undefined) {
      err = new Error('notification response is undefined');
      return callback(err, null);
    }

    // fail if data.code is 0
    if (data.msg !== 'Success') {
      err = new Error(data.msg);
      err.result_code = data.code;
      return callback(err);
    }

    callback(null, data);
  });
}

module.exports.requestNotification = function(token, data, appMethod, option, callback) {
  requestNotification.call(this, token, data, appMethod, option, callback);
};

module.exports.requestAccess = function(callback) {
  requestAccess.call(this, callback);
};

/*
 * config: configure for Huawei-Push
 * opts: options for parseOptions
 */
module.exports.parseOptions = function(config) {
  if (!_.isObject(config)) {
    throw new Error('options must be Object');
  }

  this.options = _.clone(defaults);
  _.assign(this.options, config);

  if (!_.isNumber(this.options.appId)) {
    throw new Error('options.appId required');
  }

  if (!_.isString(this.options.appSecret)) {
    throw new Error('options.appSecret required');
  }
};
