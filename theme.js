var path = require('path'),
    fs   = require('fs'),
    querystring = require('querystring');

function Theme(name) {
    /* define all important vars */
    var _name = name, _css = [], _js = [], _title, _status,
        urlRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
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
        
        console.log(arguments);

        if (typeof arguments[lastArgumentIndex] === 'object' && !(arguments[lastArgumentIndex] instanceof Array)) {
            options = arguments[lastArgumentIndex];
            delete arguments[lastArgumentIndex];
            argumentsLength = argumentsLength - 1;
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
            
            console.log(scripts instanceof Array);
            console.log(scripts);
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

    this.title = function (title) {
        _data.title = title;
        return this;
    };

    this.data = function () {
        if (arguments.length === 2) {
            var name = arguments[0],
                value = arguments[1];
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

    this.status = function (number) {
        _status = number;
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
                _data.stylesheet += '<link rel="' + alternate + 'stylesheet" ' + media + 'href="'+ href +'" />\n  ';
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
                _data.javascript += '<script href="'+ href +'"></script>\n  ';
            }
        }
    };

    this.load = function (template) {
        var that = this;
        renderStylesheet();
        renderJavascript();
        if (typeof template === 'undefined') {
            template = 'index';
        }

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

themeModule.error = function (env){
    return function (err, req, res, next) {
        var data = {error: ''};
        if (env === 'dev') {
            data.error = err.stack;
        }
        res.status(500);
        res.render('themes/' + res.theme.getName() +'/500', data);
    };
};

module.exports = themeModule;