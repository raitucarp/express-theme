Introduction Express-Theme
=============

**express-theme** is express.js middleware that aim to create structured and simple theme very easily. In the future, I will create market for express-themes. All people can upload their themes to the market, and developer-user can install easily for their projects.

# Install #

	npm install express-theme

# Usage #

#### First we should load express-theme module in app.js: ####

	var theme = require('express-theme');

#### Put middleware in app.configure before app.router: ####

	app.configure(function () {
		// ...
		app.use('v1'); // v1 is theme name, see details below
		app.use(app.router);
		app.use(express.static(path.join(__dirname, 'public')));
    	app.use(theme.error('dev')); // handle error
		app.use(theme.notfound());  // 404 not found
	});

#### Create themes dir under your views: ####

	app/
	   /views/
	   		/themes/
	   		/themes/v1
	   		/themes/v2
	   		/themes/name

As you can see, your themes should in themes directory, and create your themes there. v1, v2, above is name of your themes.

From now in this documentation, I use v1 as example theme, ejs as default engine and extension of views.

#### Create five main files: ####

	/themes/v1/500.ejs
			  /404.ejs
			  /index.ejs (this is optional actually)
			  /package.js
			  /screenshot.png

What is that files purposes?

- **505.ejs** is error handling, maybe your code error and for production you may not want print something ugly rather than your beautiful theme
- **404.ejs** is handle 404 not found, when user mistype url on your site, default express produce ugly not found page. So it's now your chance to beautify your not found page
- **index.ejs**, actually this is default file, it is optional. You can create your header.ejs or footer.ejs, and page.ejs as you want.
- **screenshot.png** is future use, this file is for my upcoming projects. express-theme marketplace. 
- **package.json** is your theme description. this is also future use, but it is required file, not optional.

#### What is inside package.json? ####

	{
		"name": "v1",
		"author" : "Ribhararnus Pracutiar",
		"description": "Default theme"
	}

- name: your theme name
- author: your name
- description: description of your theme

#### Now, it's time to move on to router ####

I use index.js as example:

	exports.index = function(req, res) {
		var theme = res.theme;
		theme.title('my title')
			 .meta('description', 'your site description')
			 .meta('keywords', 'your site keywords')
			 .css('style, bootstrap')
			 .js('jquery.min, bootstrap.min')
			 .robots('googlebot', { noodp: 1, index: 1, follow: 0} )
			 .opengraph('title', 'the rock')
			 .twitter_cards('summary', {
				site: '@yoursite',
				creator: '@username',
				title: 'your site title',
				description: 'your site description' 
			 })
			 .headerScript('<script>console.log(a)</script>')
			 .footerScript('<script>console.log(b)</script>')
			 .data('test', 'absolutely beautiful')
			 .load('index'); // index is file under your theme dir
	};

In ***views/themes/v1/index.ejs***:

	<!DOCTYPE html>
	<html <%-og_namespace%>>
	  <head>
	    <title><%= title %></title>
	    <%- meta -%>
	    <%- stylesheet -%>
	    <%- javascript %>
	    <%- headerScript %>
	  </head>
	  <body>
	    <h1><%= title %></h1>
	    <p>Welcome to <%= title %>, <%= test %></p>
	    <%- footerScript %>
	  </body>
	</html>

```<%- meta ->```, ```<%- stylesheet %>```, ```<%- javascript %>```,```<%- title %>``` is required variable.


It will render:

	<!DOCTYPE html>
	<html prefix="og: http://ogp.me/ns/article#">
	  <head>
	    <title>my title</title>
	    <meta name="description" content="your site description" />
	<meta name="keywords" content="your site keywords" />
	<meta name="googlebot" content="index, nofollow, noodp" />
	<meta property="og:title" content="the rock" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@yoursite" />
	<meta name="twitter:creator" content="@username" />
	<meta name="twitter:title" content="your site title" />
	<meta name="twitter:description" content="your site description" />
	    <link rel="stylesheet" href="/v1/css/style.css" />
	<link rel="stylesheet" href="/v1/css/bootstrap.css" />
	    <script href="/v1/js/jquery.min.js"></script>
	<script href="/v1/js/bootstrap.min.js"></script>
	
	    <script>console.log(a)</script>
	  </head>
	  <body>
	    <h1>my title</h1>
	    <p>Welcome to my title, absolutely beautiful</p>
	    <script>console.log(b)</script>
	  </body>
	</html>


*getter*

**theme.change(themeName)**

change your theme directly in your router. 

	theme.change('v2')

**theme.getName()**

get your theme name

	theme.getName()

**theme.getInfo()**

get info from package.json

	theme.getInfo()

*All methods are chainable except load*

**theme.title(pageTitle)**

It is your site title, and will render as ```<%= title %>```. for example:
	theme.title("This is about page")

**theme.data(key, value)**

Add data to your views, key is string, and value is mixed type. for example: 

	theme.data('mydata', 'good')
		 .data('age', 1)
		 .data('appearance', ['black', 'white'])

In your views file you can print it directly as your key name. for example:
	
	<%= mydata %> has age: <%= age %>

**theme.data(object)**

Same as default data method, but use object rather than key value. for example:

	theme.data({
		mydata: 'good',
		age: 1
	})

In your views files you can print it directly as your key name in object. example:

	<%= mydata %> has age: <%= age %>

**theme.css(csslist, [options])**

add css to your page, ``` csslist ``` is string. for example:

	theme.css('bootstrap, style, v2')

In your views:

	<%- stylesheet %>

It will print

	<link rel="stylesheet" href="/v1/css/bootstrap.css" />
	<link rel="stylesheet" href="/v1/css/style.css" />
	<link rel="stylesheet" href="/v1/css/v2.css" />

Options are optional, contains:

- media
- alternate
- query

for example: 
	
	theme.css('for_print', { media: 'print'})
		 .css('a, b', {alternate: true})
		 .css('c', {q: {v: '2'}})

it will print:

	<link rel="stylesheet" media="print" href="/v1/css/for_print.css" />
	<link rel="alternate stylesheet" href="/v1/css/a.css" />
	<link rel="alternate stylesheet" href="/v1/css/b.css" />
	<link rel="stylesheet" href="/v1/css/c.css?v=2" />

**theme.css(css1, css2, css3, ..., cssn, options)**

Same as above method, the different is it takes argument rather than string separated with commas

*Note that: css1, css2, .. cssn can take url as input*

	theme.css('http://dc8hdnsmzapvm.cloudfront.net/assets/styles/application.css', {q: {'87923645ca2ae626bb841ec75bddeb8c': ''}})

result

	<link rel="stylesheet" href="http://dc8hdnsmzapvm.cloudfront.net/assets/styles/application.css?87923645ca2ae626bb841ec75bddeb8c" />

**theme.js(jslist, [options])**

add javascript to your page.

	theme.js('jquery, bootstrap, underscore')

In your views:

	<%- javascript %>

will print

	<script href="/v1/js/jquery.js"></script>
	<script href="/v1/js/bootstrap.js"></script>
	<script href="/v1/js/underscore.js"></script>

options is optional, only accept q

	theme.js('baba,yaya,dede', {q: {v: 3}})

result:

	<script href="/v1/js/baba.js?v=3"></script>
	<script href="/v1/js/yaya.js?v=3"></script>
	<script href="/v1/js/dede.js?v=3"></script>

js list could be array

	theme.js(['bootstrap', 'underscore'])


**theme.js(external_js1, external_js2, ..., external_jsn, [options])**

Same as above, but it takes url as parameter

**theme.meta(name, content)**

add meta tags to your page

	theme.meta('description', 'this is cool website')
		 .meta('keywords', 'cool, javascript awesome, good')

In your views:

	<%- meta %>

result:

	<meta name="description" content="this is cool website" />
	<meta name="keywords" content="cool, javascript awesome, good" />

**theme.meta(object)**

	theme.meta({ name: 'keywords', content: 'my_keywords'})
		 .meta({ http-equiv: 'refresh', content: '30'})

result

	<meta name="keywords" content="my_keywords" />
	<meta http-equiv="refresh" content="30" />
	
**theme.robots([name], options)**

as name is optional, if you don't describe which robots, it will take default name "robots". And when you set robots name, example 'googlebot' it will print as you wish

	theme.robots({
            	index: 1,
            	follow: 0
      		})
        	.robots('googlebot', {
            	index: 1,
            	noodp: 1,            
        	})

result

	<meta name="robots" content="index, nofollow" />
	<meta name="googlebot" content="index, follow, noodp" />

default options are:

- index
- follow
- noodp
- noarchive
- etc. you can read more [https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag ](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag)

when you set index with 1, it will print index, otherwise it will print noindex. same as follow, when you print follow:0 it will print nofollow, moreover will print follow

for more information about robots meta tags you can read it here: [http://www.robotstxt.org/meta.html](http://www.robotstxt.org/meta.html)

**theme.headerScript(script)**

add script to your header, maybe analytics code or whatever do you want

	theme.headerScript('<script>console.log("a");</script>')

In your views:

	<%- headerScript %>

result:

	<script>console.log("a");</script>

tips. make sure that you put it in header tag


**theme.footerScript()**

add script to your header

	theme.footerScript('<script>console.log("this is footer");</script>')

tips. make sure that you put it in very bottom page