Introduction Express-Theme
=============

**express-theme** is express.js middleware that aims to create structured and simple theme very easily. In the future, I will create market for express-themes. All people can upload their themes to the market, and developer-user can install easily for their projects.

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
    	app.use(theme.error(routes.errorHandler)); // handle error
		app.use(theme.notFound(routes.notFound));  // 404 not found
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

**theme.status(statusCode)**

custom status code for your res, example:

	theme.status(404)

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

## Social Media##

This is advance usage. If you don't know what you do, please read this two documentation:

- [http://ogp.me/](http://ogp.me/)
- [https://dev.twitter.com/docs/cards](https://dev.twitter.com/docs/cards)

Please note that social media meta tags is part of ```<%- meta -%>``` variable.

### Facebook Opengraph ###

facebook opengraph is special meta tags for facebook. Make sure you define the namespace before go deeper:

#### theme.opengraph('namespace', type)####

there are several types of namespace, you should choose one:
	
1. music
2. video
3. article
4. book
5. profile
6. website
7. custom

place your namespace as attribute of html tag

	<html <%-og_namespace%>>

**theme.opengraph('namespace', 'music')**

result: ```<html prefix="og: http://ogp.me/ns/music#">```

**theme.opengraph('namespace', 'video')**

result: ```<html prefix="og: http://ogp.me/ns/video#">```

**theme.opengraph('namespace', 'article')**
	
result: ```<html prefix="og: http://ogp.me/ns/article#">```

**theme.opengraph('namespace', 'book')**

result: ```<html prefix="og: http://ogp.me/ns/book#">```

**theme.opengraph('namespace', 'profile')**

result: ```<html prefix="og: http://ogp.me/ns/profile#">```

**theme.opengraph('namespace', 'website')**

result: ```<html prefix="og: http://ogp.me/ns/website#">```

**theme.opengraph('namespace', 'custom', {namespace: ns, url: yoursite})**

custom namespace should have namespace and url, for example:

	theme.opengraph('namespace', 'custom', {
			 	namespace: 'my_namespace', 
				url: 'http://example.com'
		  })

result:

	<html prefix="my_namespace: http://example.com/ns#">

#### theme.opengraph(property, value)####

	theme.opengraph('title', "The Rock")
         .opengraph('type', 'video.movie')
         .opengraph('url', 'http://www.imdb.com/title/tt0117500/')
         .opengraph('image', "http://ia.media-imdb.com/images/rock.jpg", {
            secure_url: 'https://secure.example.com/ogp.jpg',
            type: 'image/jpeg',
            width: '400',
            height: '300'
         })

value can be as object, it will print:

	<meta property="og:title" content="The Rock" />
	<meta property="og:type" content="video.movie" />
	<meta property="og:url" content="http://www.imdb.com/title/tt0117500/" />
	<meta property="og:image" content="http://ia.media-imdb.com/images/rock.jpg" />
	<meta property="og:image:secure_url" content="https://secure.example.com/ogp.jpg" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:image:width" content="400" />
	<meta property="og:image:height" content="300" />

Please read official documentation of facebook opengraph, and open issue when you find a bug.

### Twitter Cards ###

Official documentation at [https://dev.twitter.com/docs/cards](https://dev.twitter.com/docs/cards)

Express-theme only support these cards:

- **Summary Card**: Default Card, including a title, description, thumbnail, and Twitter account attribution.
- **Summary Card with Large Image**: Similar to a Summary Card, but offers the ability to prominently feature an image.
- **Photo Card**: A Tweet sized photo Card.
- **Gallery Card**: A Tweet Card geared toward highlighting a collection of photos.
- **App Card**: A Tweet Card for providing a profile of an application.
- **Player Card**: A Tweet sized video/audio/media player Card.
- **Product Card**: A Tweet Card to better represent product content.

*Please note that, you only can call this method once, if you call again then the last method will replace the previous*

#### Summary cards ####

this code:

	theme.twitter_cards('summary', {
            site: '@nytimes',
            creator: '@SarahMaslinNir',
            title: 'Parade of Fans for Houston’s Funeral',
            description: 'NEWARK - The guest list and parade of limousines with celebrities emerging from them seemed more suited to a red carpet event in Hollywood or New York than than a gritty stretch of Sussex Avenue near the former site of the James M. Baxter Terrace public housing project here.',
            image: 'http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-article.jpg'
        })

will print this:

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@nytimes" />
	<meta name="twitter:creator" content="@SarahMaslinNir" />
	<meta name="twitter:title" content="Parade of Fans for Houston’s Funeral" />
	<meta name="twitter:description" content="NEWARK - The guest list and parade of limousines with celebrities emerging from them seemed more suited to a red carpet event in Hollywood or New York than than a gritty stretch of Sussex Avenue near the former site of the James M. Baxter Terrace public housing project here." />
	<meta name="twitter:image" content="http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-article.jpg" />

#### Summary Card with Large Image ####

	theme.twitter_cards('summary_large_image', {
            site: '@nytimes',
            creator: '@SarahMaslinNir',
            title: 'Parade of Fans for Houston’s Funeral',
            description: 'NEWARK - The guest list and parade of limousines with celebrities emerging from them seemed more suited to a red carpet event in Hollywood or New York than than a gritty stretch of Sussex Avenue near the former site of the James M. Baxter Terrace public housing project here.',
            image_src: 'http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-article.jpg'
        })

result:

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@nytimes" />
	<meta name="twitter:creator" content="@SarahMaslinNir" />
	<meta name="twitter:title" content="Parade of Fans for Houston’s Funeral" />
	<meta name="twitter:description" content="NEWARK - The guest list and parade of limousines with celebrities emerging from them seemed more suited to a red carpet event in Hollywood or New York than than a gritty stretch of Sussex Avenue near the former site of the James M. Baxter Terrace public housing project here." />
	<meta name="twitter:image:src" content="http://graphics8.nytimes.com/images/2012/02/19/us/19whitney-span/19whitney-span-article.jpg" />

#### Photo Card ####

	theme.twitter_cards('photo', {
            site: '@examplephotosite',
            creator: '@sippey',
            title: 'Parade of Fans for Houston’s Funeral',
            image: {
                content: 'http://example.com/photo/a/image.jpg',
                height: 610,
                width: 610
            }
        })

result: 

	<meta name="twitter:card" content="photo">
	<meta name="twitter:site" content="@examplephotosite">
	<meta name="twitter:creator" content="@sippey">
	<meta name="twitter:title" content="Good Morning, San Francisco">
	<meta name="twitter:image" content="http://example.com/photo/a/image.jpg">
	<meta name="twitter:image:width" content="610">
	<meta name="twitter:image:height" content="610">

### Gallery Card ###

	.twitter_cards('gallery', {
            site: '@flickr',
            creator: '@hackweek',
            title: 'Hack week',
            description: 'A look at Hack Week at Twitter HQ (@twoffice) and all of our offices around the world',
            images: [
                'http://farm9.staticflickr.com/8236/8383176221_44f50afaba_b.jpg',
                'http://farm9.staticflickr.com/8186/8393798794_3a3d27a621_c.jpg',
                'http://farm9.staticflickr.com/8189/8384260164_511782a797_c.jpg',
                'http://farm9.staticflickr.com/8188/8383177259_f927f13d81_b.jpg'
            ]
        })

result :

	<meta name="twitter:card" content="gallery">
	<meta name="twitter:site" content="@flickr">
	<meta name="twitter:creator" content="@hackweek">
	<meta name="twitter:title" content="Hack Week">
	<meta name="twitter:description" content="A look at Hack Week at Twitter HQ (@twoffice) and all of our offices around the world.">
	<meta name="twitter:image0" content="http://farm9.staticflickr.com/8236/8383176221_44f50afaba_b.jpg">
	<meta name="twitter:image1" content="http://farm9.staticflickr.com/8186/8393798794_3a3d27a621_c.jpg">
	<meta name="twitter:image2" content="http://farm9.staticflickr.com/8189/8384260164_511782a797_c.jpg">
	<meta name="twitter:image3" content="http://farm9.staticflickr.com/8188/8383177259_f927f13d81_b.jpg">

#### App Card ####

	theme.twitter_cards('app', {
            description: 'The perfect for grabbing a nearby taxi. Try it by downloading today.',
            iphone: {
                id: 306934135,
                url: 'example://action/5149e249222f9e600a7540ef',
            },
            ipad: {
                name: 'Example App',
                url: 'example://action/5149e249222f9e600a7540ef'
            },
            googleplay: {
                id: 'com.example.app',
                url: 'http://example.com/action/5149e249222f9e600a7540ef'
            }
        })

result

	<meta name="twitter:card" content="app">
	<meta name="twitter:description" content="The perfect for grabbing a nearby taxi. Try it by downloading today.">
	<meta name="twitter:app:id:iphone" content="306934135">
	<meta name="twitter:app:url:iphone" content="example://action/5149e249222f9e600a7540ef">
	<meta name="twitter:app:name:ipad" content="Example App">
	<meta name="twitter:app:url:ipad" content="example://action/5149e249222f9e600a7540ef">
	<meta name="twitter:app:id:googleplay" content="com.example.app">
	<meta name="twitter:app:url:googleplay" content="http://example.com/action/5149e249222f9e600a7540ef">

#### Player Card ####

	theme.twitter_cards('player', {
        site: '@examplevideosite',
        title: 'Example Video',
        description: 'This is a sample video from example.com',
        image: "https://example.com/keyframe/a.jpg",
        player: {
            content: 'https://example.com/embed/a',
            width: 435,
            height: 251
        }
    })

result

	<meta name="twitter:card" content="player" />
	<meta name="twitter:title" content="Example Video" />
	<meta name="twitter:description" content="This is a sample video from example.com" />
	<meta name="twitter:player" content="https://example.com/embed/a" />
	<meta name="twitter:player:width" content="435" />
	<meta name="twitter:player:height" content="251" />

#### Product Card ####

	theme.twitter_cards('product', {
            site: '@twitter',
            creator: '@twitter',
            title: 'Logo Mug',
            description: 'The perfect pick-me-up. Enjoy your favorite blend with this coffee mug featuring the Twitter logo. Make every work day good to the last drop.',
            image: "https://twitter.siglercompanies.com/graphics/00000001/mug-new.jpg",
            data: {
                Price: '$3',
                Color: 'Black'
            }
        })

result

	<meta name="twitter:card" content="product">
	<meta name="twitter:site" content="@twitter">
	<meta name="twitter:creator" content="@twitter">
	<meta name="twitter:title" content="Logo Mug">
	<meta name="twitter:description" content="The perfect pick-me-up. Enjoy your favorite blend with this coffee mug featuring the Twitter logo. Make every work day good to the last drop.">
	<meta name="twitter:image" content="https://twitter.siglercompanies.com/graphics/00000001/mug-new.jpg">
	<meta name="twitter:data1" content="$3">
	<meta name="twitter:label1" content="Price">
	<meta name="twitter:data2" content="Black">
	<meta name="twitter:label2" content="Color">


# 500 and 404 handler #

In your app configuration, you should have these, below ```app.use(app.router)```:

	app.use(theme.error(routes.errorHandler)); // handle error
	app.use(theme.notFound(routes.notFound));  // 404 not found


Your router files (routes) must contains router for errorHandler, and notFound, the name of your route handler is up to you

	exports.errorHandler (err, req, res) {
		// do something here, maybe load theme and load 404.ejs
	};

for 404 not found:

	exports.notFound (req, res) {
		// do something here, maybe load theme and load 404.ejs
	};

# License #

The MIT License (MIT)

Copyright (c) 2013 Ribhararnus Pracutiar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.