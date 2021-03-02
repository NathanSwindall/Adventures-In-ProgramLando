---
layout: post
category: tech
image: /assets/images/3.jpg
date: 2021-02-11
title: Using Express with Elm
summary: Serve up your Elm apps with a lightweight backend server
author: Nathan Swindall
---



Here's the table of contents:

1. TOC
{:toc}



## Problem

While going through the book [Elm in Action](https://www.manning.com/books/elm-in-action?utm_source=Swindeasy&utm_medium=affiliate&utm_campaign=book_rfeldman_elm_4_14_20&utm_content=number2&a_aid=Swindeasy&a_bid=a11d59e7) problems I ran into while using elm is that I kept having to type in the command `elm make client/src/PhotoGroove.elm --output client/app.js` which isn't really that bad, but when I came from using node.js to develop up the backend for apps, having a live reload became almost a given. Thus I decided to make a simple application skeleton for whenever I wanted to make an elm app. The repository can be found [here](https://github.com/NathanSwindall/elm-setup) if you want to clone the setup for your projects. 

## Basic Setup

The first thing you are going to do in order to create this basic setup is to create a folder and then open up whatever ide you are using in that folder. I am using [Visual Studio Code](https://code.visualstudio.com/) and there is a great [elm plugin](https://marketplace.visualstudio.com/items?itemName=Elmtooling.elm-ls-vscode) by Elm tooling which really has everything you need to get started with coding in elm, but I am so used to coding in node.js that I wanted that specifically as my backend. 

Now you are going to run the command `elm init`, assuming that you already installed elm (if you don't you can check out the beginning of [this](https://www.youtube.com/watch?v=5XT5Qh5xdyI&t=82s) video). Once you run this you will have a few folders in place and a json file. It should look like this. 



<p></p>
{%- assign initUrl = "blog-tech/assets/images/elm-basics/elm-init.png" | relative_url-%}
<img src ="{{initUrl}}">
<p></p>

You can go ahead an delete the src folder because we are going to change the source folder for the setup. Now before we do anything else. We are going to run another command which is `npm init`. This will help us set up our backend. 


<p></p>
{%- assign initUrl = "blog-tech/assets/images/elm-basics/npm-init.png" | relative_url-%}
<img src ="{{initUrl}}">
<p></p>


Now that we have both npm initialized and elm initialized in the project we can start adding the correct folders. We are going to add a client folder for where our elm goes, and then a server folder for our backend node.js code. We are going to have a src folder in each of those folders too. It should look something like the following. 


<p></p>
{%- assign initUrl = "blog-tech/assets/images/elm-basics/folders.png" | relative_url-%}
<img src ="{{initUrl}}">
<p></p>


Now that we have the right folder setup we need to edit a few files. The first thing we need to have live reload for both our server and elm app is nodemon and express for the server. Run these commands to install them.


```elm
npm install nodemon --save-dev
npm install express
```

These will install the correct dependencies that we need for our backend and for live reload of the elm and backen app. After these are installed you will want to edit the package.json file to have these scripts in them. 

```elm
"elm-dev": "nodemon --exec elm make client/src/HelloWorld.elm --output client/app.js",
"node-dev": "nodemon server/src/app.js"
```

The new package.json file
```json
{
  "name": "elm-setup",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "elm-dev": "nodemon --exec elm make client/src/HelloWorld.elm --output client/app.js",
    "node-dev": "nodemon server/src/app.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}

```

These commands will help you live reload whenever you make a change to your elm file, and any of the backend files too. The only thing is that you will need two terminal open when you run them. Next we are going to change the elm.json file. We will change the `"source-directories"` list from `"src"` to `"client/src"`. This will make elm compile the elm file that we will have in our client/src folder and not in the original src folder we had. 

```json
{
    "type": "application",
    "source-directories": [
        "client/src"
    ],
    "elm-version": "0.19.1",
    "dependencies": {
        "direct": {
            "elm/browser": "1.0.2",
            "elm/core": "1.0.5",
            "elm/html": "1.0.0"
        },
        "indirect": {
            "elm/json": "1.1.3",
            "elm/time": "1.0.0",
            "elm/url": "1.0.0",
            "elm/virtual-dom": "1.0.2"
        }
    },
    "test-dependencies": {
        "direct": {},
        "indirect": {}
    }
}
```

Now let's add the code for our backend to run on port 3002. Don't worry too much if you don't know node.js. This code is just starting up the server for you and serving our client folder that will have our elm code in it. You shoud put this file in the `server/src` directory

```js
const express = require('express')
const path = require('path')
const {join} = require('path')
const app = express()


// setup server on port 3001
const port = process.env.PORT || 3002


// set up the public directory to be served
const publicDirectory = path.join(__dirname,"../../client")
app.use(express.static(publicDirectory))



// start up server
app.listen(port,()=> {
    console.log("This app is running on port " + port)
})
```
Now it is time to create a basic elm file and html file for our elm app. The html file will live in the `client` folder. Thus go ahead a create an `index.html` file there and a `HelloWorld.elm` in the `client/src` folder. 


### **index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

    <div id="app"></div>
    <script src="app.js"></script>

    <script>
        var app = Elm.HelloWorld.init({node: document.getElementById("app")})
    </script>
    
</body>
</html>
```

### **HelloWorld.elm**
```elm
module HelloWorld exposing (main)
import Dict exposing (update)
import Browser

import Browser
import Html exposing (div,h1, img, text)
import Html.Attributes exposing (..)

view model = 
    div [] 
        [ h1 [] [ text "Hello World"]]

main =
    view "no model yet"
```

Now we have all the pieces in place and we can now live reload our app. To live reload you just need to run `npm run node-dev` in one terminal that is cd to the project folder to start our server on port 3002. Make sure you don't have anything on this port or the command will fail. Now run `npm run elm-dev` in another terminal cd to the same folder so we can live reload the elm app. You can now open up your app in the browswer at `http://localhost:3002/` and it should jsut display "Hello World" as a header. 

If you want to change the elm file title from HelloWorld, then you will need to change the html file so that the code is slightly different. Replace <YourTitle> in the html code below and put it in your html file where the original code was and everything should work

```html
<script>
    var app = Elm.<YourTitle>.init({node: document.getElementById("app")})
</script>
```



