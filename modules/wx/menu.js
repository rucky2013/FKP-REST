var libs = require('../../libs/libs')
var config = require('../../config');
var api = require('../../apis/javaapi')

function *query(){
    var nowmenu = yield api.pullWxData.call(this,'querymenu',{});
    console.log(nowmenu);
}

module.exports = query