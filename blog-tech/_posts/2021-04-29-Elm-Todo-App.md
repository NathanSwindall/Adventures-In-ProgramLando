---
layout: post
category: tech
title: Elm App
image: /assets/images/elm.png
frontpage: frontpage
summary: A simple app using the Elm framework
date: 2021-02-22
author: Nathan Swindall
---



**Elm App**

For an programming test that I was given for a project a while ago, I had to make a simple app in React. I decided to remake that same app in Elm. It was surprisingly a lot easier once you get the basics of Elm down. There was one tricky part which was how I handle a button on top of another button. I don't want both buttons to be pressed or to signal a click event, so I had to dig into the Elm documentation a little bit. Unfortunately, since elm doesn't have a huge following, some answers to quetions are very difficult to find. 


{% assign ElmApp = "blog-tech/ElmTodoApp/index" | relative_url %} 
<a href="{{ElmApp}}">Elm Todo App</a>

There is unfortunately a glaring error to this app. A fun game if you are a tester is to find out where the error is. 