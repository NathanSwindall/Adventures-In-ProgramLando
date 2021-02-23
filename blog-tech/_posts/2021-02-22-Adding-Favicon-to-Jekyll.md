---
layout: post
category: tech
title: Adding a Favicon to a Jekyll Website
image: /assets/images/favicons.jpg
frontpage: frontpage
summary: Just plain frustrating sometimes
date: 2021-02-22
author: Nathan Swindall
---


Adding a favicon to your website makes it that much more professional looking, but when it comes to adding one to a Jekyll website you might run into some common pitfalls. Luckily you have come to the right blog in order to fix these problems. When I was first creating this website, for some reason I kept getting a strange error which was that my favicon was showing up on certain pages, but not others.

The first thing you are going to want to do is to make sure that you have a favicon of your liking. With this favicon, we are just going to put it into the main site directory.          

<p>&nbsp;</p>

{%- assign imgUrl = "/assets/images/favicon_directory.png" | relative_url -%}
<img src="{{imgUrl}}">

<p>&nbsp;</p>

{%- assign favicondir = "<link rel='stylesheet' href='{{ '/assets/main.css' | relative_url }}'>" -%}
It's actually a very simple thing to fix. I am assuming that you have access to the _includes file in your project directory. In the includes file directory there should be a file called `head.html`. In this file we will just put one line of code under `{{favicondir}}`. It actually doesn't really matter where you put it in the head.html file, but you want to at least place it between the head tags. The line of code is :

```html
{% raw %}
<link rel="icon" type="image/png" sizes="512x512" href="{{ 'fav.png' | relative_url }}">"
{% endraw %}
```

And Voila! You have yourself a wonderful favicon in your jekyll website. Also, you need to make sure that you change the sizes attribute to the size of your favicon which should be a square. Mine is 512 x 512. 