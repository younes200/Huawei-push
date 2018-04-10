module.exports = {
	appId: 1,
	appSecret: 'your appSecret',
	tokens: 'your device token',
	appPkgName: 'your app package name',
    callback: function() {
    	console.log(JSON.stringify(arguments, null, 2));
    }
};
