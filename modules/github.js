/**
 * Module dependencies.
 */
var fs = require('fs')
var path = require('path')
var libs = require('../libs/libs')
var config = require('../config');
var api = require('../apis/javaapi');


function *github(){
    libs.clog('github')
    var github = config.auth.github;

    if (this.sess.argv) {
        if (this.sess.argv === 'test') {
            console.log('========== github auth test环境');
            github = config.test.auth.github
        }
    }


    var _this = this;

    var cat = this.params.cat
    var title = this.params.title;

    var client_id = github.clientID,
        scope = 'user',
        stat = 'agzgz',
        cb_url = github.callbackURL,
        secret = github.clientSecret,
        sesskey = github.userKey;

    if (title ==='sign' && !this.session.$user){
        this.redirect("https://github.com/login?return_to=/login/oauth/authorize?client_id="+client_id+"&redirect_uri="+cb_url+"&response_type=code")
    }
    else {
        var query = this.local.query
        if (this.session.$user){
            this.redirect('/index')
        }

        if (query.code){
            var code = query.code;
            var postdata = {
                client_id: client_id,
                client_secret: secret,
                code: code,
                redirect_uri: cb_url,
                method : 'post'
            }
            var ttt = yield api.req(this, 'https://github.com/login/oauth/access_token', postdata)
            var github_token = ttt[1].access_token
            // github_token为如下内容
            // { access_token: '82b79fcd53b5532fd6fe91d8281edf80677ae4de',
            //   token_type: 'bearer',
            //   scope: '' }
            var userpost = {
                method: 'post',
                headers: {
                    "user-agent": 'love_gz'
                }
            }
            var github_user = yield api.req(this, 'https://api.github.com/user?access_token='+github_token, userpost)
            var g_user = github_user[1]
            // console.log('============ g_user');
            // console.log('============ g_user');
            // console.log('============ g_user');
            // console.log('============ g_user');
            // console.log(g_user);

            var hasUser = yield api.req(this, '$signis', {username: g_user.login})
            if (hasUser){
                // this.session[sesskey] = hasUser
                console.log('============ session user');
                console.log('============ session user');
                console.log('============ session user');
                console.log(this.session.$user);
                this.redirect('/index')
            }
            else{
                var signupUser = yield api.req(this, '$signup', {github: g_user})
                this.redirect('/index')
            }
        }
    }


}


module.exports = github
