/**
 * Express-theme is middleware for express.js that aim to creating theme for it
 * 
 * The MIT License (MIT)
 * Copyright (c) 2013 Ribhararnus Pracutiar (http://github.com/raitucarp, http://twitter.com/raitucarp)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var path = require('path'),
    fs   = require('fs'),
    querystring = require('querystring');

function Theme(name) {
    /* define all important vars */
    var _name = name, _css = [], _js = [], _meta = [], _title, _status = 200,
        urlRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

    /* social media meta*/
    var _og = [], _twitter_cards = {}, _googlePlus;

    /* mediaType for stylesheets */
    var mediaType = ['all', 'braille', 'embossed', 'handheld', 'print', 'projection', 'screen', 'speech', 'tty', 'tv'];
    /* create empty _data for theme */
    var _data = {
        title: '',
        stylesheet: '',
        javascript: '',
        meta: '',
        headerScript: '',
        footerScript: ''
    };
    /* reference of this */
    var that = this;
    this.name = name;

    /* switch theme */
    this.change = function (_name) {
        this.name = _name;
        return this;
    };

    /* css method */
    this.css  = function () {
        var that = this;
        var i, media = '', _mediaType = '', alternate = false, href = '', external = false, query = {};
        var options = {
            media: '',
            alternate: false,
            q: false,
        };

        var argumentsLength = arguments.length,
            lastArgumentIndex = argumentsLength - 1; 
        

        if (typeof arguments[lastArgumentIndex] === 'object' && !(arguments[lastArgumentIndex] instanceof Array)) {
            options = arguments[lastArgumentIndex];
            delete arguments[lastArgumentIndex];
            argumentsLength = argumentsLength - 1;
        }


        if (options.media !== "") {
            if (mediaType.indexOf(options.media) !== -1) {
                _mediaType = options.media;
            }
        }

        if (options.alternate === true) {
            alternate = true;
        }

        if (options.q !== false) {
            if (typeof options.q === 'object') {
                query = options.q;
            }
        }

        if (argumentsLength > 1) {
            for (i in arguments) {
                if (arguments.hasOwnProperty(i)) {
                    if (typeof arguments[i] !== 'undefined') {
                        if (arguments[i].trim().match(urlRegExp)) {
                            external = true;
                        } else {
                            external = false;
                        }
                        _css.push({
                            name: arguments[i].trim(), 
                            media: _mediaType,
                            alternate: alternate,
                            external: external,
                            query: query
                        });
                    }
                }
            }

        } else {
            var styles = arguments[0];
            if (styles instanceof Array) {
                /* it's array */
            } else {
                styles = styles.split(',');
            }

            for (i in styles) {
                if (styles.hasOwnProperty(i)) {
                    if (typeof styles[i] !== 'undefined') {
                        if (styles[i].trim().match(urlRegExp)) {
                            external = true;
                        } else {
                            external = false;
                        }
                        _css.push({
                            name: styles[i].trim(), 
                            media: _mediaType,
                            alternate: alternate,
                            external: external,
                            query: query
                        });
                    }
                }
            }
        }
        return this;
    };

    this.js = function () {
        var i, query = {}, external = false;
        var options = {
            q: false,
            external: false
        };
         var argumentsLength = arguments.length,
            lastArgumentIndex = argumentsLength - 1; 

        if (typeof arguments[lastArgumentIndex] === 'object' && !(arguments[lastArgumentIndex] instanceof Array)) {
            options = arguments[lastArgumentIndex];
            delete arguments[lastArgumentIndex];
            argumentsLength = argumentsLength - 1;
        }

        if (options.q !== false) {
            if (typeof options.q === 'object') {
                query = options.q;
            }
        }

        if (argumentsLength > 1) {
            for (i in arguments) {
                if (arguments.hasOwnProperty(i)) {
                    if (typeof arguments[i] !== 'undefined') {
                        if (arguments[i].trim().match(urlRegExp)) {
                            external = true;
                        } else {
                            external = false;
                        }
                        _js.push({
                            name: arguments[i].trim(), 
                            external: external,
                            query: query
                        });
                    }
                }
            }
        } else {
            var scripts = arguments[0];
            if (scripts instanceof Array) {
                /* it's array */
            } else {
                scripts = scripts.split(',');
            }

            for (i in scripts) {
                if (scripts.hasOwnProperty(i)) {
                    if (typeof scripts[i] !== 'undefined') {
                        if (scripts[i].trim().match(urlRegExp)) {
                            external = true;
                        } else {
                            external = false;
                        }
                        _js.push({
                            name: scripts[i].trim(), 
                            external: external,
                            query: query
                        });
                    }
                }
            }
        }
        return this;
    };

    this.title = function (pageTitle) {
        _data.title = pageTitle;
        return this;
    };

    this.data = function () {
        if (arguments.length === 2) {
            var name = arguments[0], value = arguments[1];

            if (typeof value === 'function') {
                value = (function () { return value(); } )();
            }

            _data[name] = value;
        } else {
            var obj = arguments[0];
            var i;
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    _data[i] = obj[i];
                }
            }
        }
        return this;
    };

    this.meta = function () {
        if (arguments.length === 1) {
            if (Object.prototype.toString.call( arguments[0] ) === "[object Object]") {
                _meta.push(arguments[0]);
            }
        } else {
            if (typeof arguments[0] === 'string' && typeof arguments[1] === 'string') {
                _meta.push({name: arguments[0], content: arguments[1] });
            }
        }
        return this;
    };

    this.opengraph = function () {
        if (arguments.length === 2 || arguments.length === 3) {
            var property = arguments[0], content = arguments[1];
            if (property === 'namespace') {
                var ns = 'http://ogp.me/ns';
                var og = 'og: ';
                    switch (arguments[1]) {
                        case 'music': 
                            ns += '/music#';
                        break;
                        case 'video':
                            ns += '/video#';
                        break;
                        case 'article':
                            ns += '/article#';
                        break;
                        case 'book':
                            ns += '/book#';
                        break;
                        case 'profile':
                            ns += '/profile#';
                        break;
                        case 'website':
                            ns += '/website#';
                        break;
                        case 'custom': 
                            og = arguments[2].namespace + ': ';
                            ns = arguments[2].url + '/ns#';
                        break;
                        default:
                            ns += '#';
                        break;
                    }
                _data.og_namespace = 'prefix="' + og + ns + '"';
            } else {
                _meta.push({property: 'og:'+property, content: content});
                var options = arguments[2];
                if (arguments.length === 3) {
                    for (var i in options) {
                        if (options.hasOwnProperty(i)) {
                            _meta.push({property: 'og:'+property+':'+i, content: options[i]});
                        }
                    }
                }
            }
        }
        return this;
    };

    this.twitter_cards = function () {
        if (arguments.length === 2) {
            var type = arguments[0], 
                options = arguments[1];
            var i;
            switch (type) {
                case 'summary':
                    _twitter_cards = {
                        card: type,
                        site: '@' + options.site.replace('@', ''),
                        creator: '@' + options.creator.replace('@', ''),
                        title: options.title,
                        description: options.description
                    };
                    for (i in _twitter_cards) {
                        _meta.push({name: 'twitter:' + i, content: _twitter_cards[i]});
                    }
                    if (typeof options.image !== 'undefined') {
                        _meta.push({name: 'twitter:image', content: options.image});
                    }
                break;
                case 'summary_large_image':
                    _twitter_cards = {
                        card: type,
                        site: '@' + options.site.replace('@', ''),
                        creator: '@' + options.creator.replace('@', ''),
                        title: options.title,
                        description: options.description,
                        /*image : {
                            src: options.img_src
                        }*/
                    };
                    for (i in _twitter_cards) {
                        _meta.push({name: 'twitter:' + i, content: _twitter_cards[i]});
                    }
                    if (typeof options.image_src !== 'undefined') {
                        _meta.push({name: 'twitter:image:src', content: options.image_src});
                    }
                break;
                case 'photo':
                    _twitter_cards = {
                        card: type,
                        site: '@' + options.site.replace('@', ''),
                        creator: '@' + options.creator.replace('@', ''),
                    };

                    for (i in _twitter_cards) {
                        _meta.push({name: 'twitter:' + i, content: _twitter_cards[i]});
                    }

                    if (typeof options.title !== 'undefined') {
                        _meta.push({name: 'twitter:title', content: options.title});
                    }

                    _meta.push({name: 'twitter:image', content: options.image.content});

                    for (i in options.image) {
                        if (i !== 'content') {
                            _meta.push({name: 'twitter:image:' + i, content: options.image[i]});
                        }
                    }
                break;
                case 'gallery':
                    _twitter_cards = {
                        card: type,
                        site: '@' + options.site.replace('@', ''),
                        creator: '@' + options.creator.replace('@', ''),
                    };

                    if (typeof options.title !== 'undefined') {
                        _twitter_cards.title = options.title;
                    }

                    if (typeof options.description !== 'undefined') {
                        _twitter_cards.description = options.description;
                    }

                    for (i in _twitter_cards) {
                        _meta.push({name: 'twitter:' + i, content: _twitter_cards[i]});
                    }
                    options.images.forEach(function (img, index) {
                        _meta.push({name: 'twitter:image' + index, content: img});
                    });
                break;
                case 'app':
                    _twitter_cards = {
                        card: type,
                    };

                    if (typeof options.description !== 'undefined') {
                        _twitter_cards.description = options.description;
                    }

                    for (i in _twitter_cards) {
                        _meta.push({name: 'twitter:' + i, content: _twitter_cards[i]});
                    }

                    _meta.push({name: 'twitter:app:id:iphone', content: options.iphone.id});
                    _meta.push({name: 'twitter:app:id:ipad', content: options.ipad.id});
                    _meta.push({name: 'twitter:app:id:googleplay', content: options.googleplay.id});

                    if (typeof options.iphone.url !== 'undefined') {
                        _meta.push({name: 'twitter:app:url:iphone', content: options.iphone.url });
                    }

                    if (typeof options.ipad.name !== 'undefined') {
                        _meta.push({name: 'twitter:app:name:ipad', content: options.ipad.name});
                    }

                    if (typeof options.ipad.url !== 'undefined') {
                        _meta.push({name: 'twitter:app:url:ipad', content: options.ipad.url});
                    }

                    if (typeof options.googleplay.url !== 'undefined') {
                        _meta.push({name: 'twitter:app:url:googleplay', content: options.googleplay.url});
                    }

                    if (typeof options.country !== 'undefined') {
                        _meta.push({name: 'twitter:app:country', content: options.googleplay.url});
                    }
                break;
                case 'player':
                    _twitter_cards = {
                        card: type,
                        title: options.title,
                        description: options.description,
                    };

                    for (i in _twitter_cards) {
                        _meta.push({name: 'twitter:' + i, content: _twitter_cards[i]});
                    }
                    _meta.push({name: 'twitter:player', content: options.player.content});
                    for (i in options.player) {
                        if (i !== 'content' && i !== 'stream') {
                            _meta.push({name: 'twitter:player:' + i, content: options.player[i]});
                        }
                    }
                    if (typeof options.player.stream !== 'undefined') {
                        _meta.push({name: 'twitter:player:stream', content: options.player.stream.content});
                        _meta.push({name: 'twitter:player:stream:content_type', content: options.player.stream.content_type});
                    }
                break;
                case 'product':
                    _twitter_cards = {
                        card: type,
                        title: options.title,
                        description: options.description,
                        image: options.image.content
                    };

                    for (i in _twitter_cards) {
                        _meta.push({name: 'twitter:' + i, content: _twitter_cards[i]});
                    }

                    for (i in options.image) {
                        if (i !== 'content') {
                            _meta.push({name: 'twitter:image:' + i, content: options.image[i]});
                        }
                    }

                    options.data.forEach(function (data, index) {
                        _meta.push({name: 'twitter:data'+ (index + 1), content: data.value});
                        _meta.push({name: 'twitter:label'+ (index + 1), content: data.label});
                    });
                break;
            }
        }
        return this;
    };

    this.status = function (number) {
        _status = number;
        return this;
    };

    this.headerScript = function (script) {
        _data.headerScript += script;
        return this;
    };

    this.footerScript = function (script) {
        _data.footerScript += script;
        return this;
    };

    this.robots = function () {
        var name = 'robots', prop = arguments[0];
        if (typeof arguments[0] === 'string') {
            name = arguments[0];
            prop = arguments[1];
        }
        var index = 'index', follow = 'follow', content = [];

        if (typeof prop.index !== 'undefined') {
            if (prop.index === 0) {
                index = 'noindex';
            }
        }
        content.push(index);

        if (typeof prop.follow !== 'undefined') {
            if (prop.follow === 0) {
                follow = 'nofollow';
            }
        }
        content.push(follow);
        for (var i in prop) {
            if (prop.hasOwnProperty(i)) {
                if (i !== 'index' && i !== 'follow') {
                    if (prop[i] === 1) {
                        content.push(i);
                    }
                }
            }
        }
        _meta.push({name: name, content: content.join(', ') });
        return this;
    };

    var renderStylesheet = function () {
        var i;
        for (i in _css) {
            if (_css.hasOwnProperty(i)) {
                var css = _css[i], alternate = '', media = '', href, query;
                if (css.alternate === true) {
                    alternate = 'alternate ';
                }

                if (css.media !== '') {
                    media = 'media="' + css.media + '" ';
                }

                if (css.external === false) {
                    href = "/" + name + '/css/' + css.name + '.css';
                } else {
                    href = css.name;
                }

                query = querystring.stringify(css.query).replace(/^\=+|\=+$/g, '');
                if (query !== '') {
                    href = href + '?' + query;
                }
                _data.stylesheet += '<link rel="' + alternate + 'stylesheet" ' + media + 'href="'+ href +'" />\n';
            }
        }
    };

    var renderJavascript = function () {
        var i;
        for (i in _js) {
            if (_js.hasOwnProperty(i)) {
                var js = _js[i], href, query;

                if (js.external === false) {
                    href = "/" + name + '/js/' + js.name + '.js';
                } else {
                    href = js.name;
                }

                query = querystring.stringify(js.query).replace(/^\=+|\=+$/g, '');
                if (query !== '') {
                    href = href + '?' + query;
                }
                _data.javascript += '<script href="'+ href +'"></script>\n';
            }
        }
    };

    var renderMeta = function () {
        _meta.forEach(function (meta, index) {
            var attrs = '';
            for (var i in meta) {
                if (meta.hasOwnProperty(i)) {
                    attrs += i + '="' + meta[i].toString() + '" ';
                }
            }
            _data.meta += '<meta '+attrs+'/>\n';
        });
    };

    this.load = function (template) {
        var that = this;
        renderStylesheet();
        renderJavascript();
        renderMeta();
        if (typeof template === 'undefined') {
            template = 'index';
        }
        this.res.status(_status);
        this.res.render('themes/' + _name + '/' + template, _data);
    };
}

Theme.prototype.getName = function () {
    return this.name;
};

Theme.prototype.setPath = function ($path) {
    this.path = path.resolve($path, 'themes', this.name);
};

Theme.prototype.getInfo = function () {
    return fs.readFileSync(path.resolve(this.res.app.get('views'), 'themes', this.name, 'package.json'), 'utf8');
};

/*Theme.prototype.title = function (title) {
    this.title = title;
};

/*Theme.prototype.css = function () {
    
};*/

var themeModule = function (name) {
    this.name = name;
    return function (req, res, next) {
        var theme = new Theme(name);
        theme.res = res;
        //theme.setPath(req.app.get('views'));
        res.theme = theme;
        next();
    };
};

themeModule.error = function (env) {
    return function (err, req, res, next) {
        var data = {error: ''};
        if (env === 'dev') {
            data.error = err.stack;
        }
        res.status(500);
        res.render('themes/' + res.theme.getName() +'/500', data);
    };
};

themeModule.notfound = function () {
    return function (req, res, next) {
        res.status(404);
        res.render('themes/' + res.theme.getName() +'/404');
    };
};

module.exports = themeModule;