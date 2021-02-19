---
layout: post
category: tech
title_article: Custom Html Tags
image: /assets/images/9.jpg
summary: Flavoring your html files for the perfect recipe
date: 2021-02-17
author: Nathan Swindall
---


## Problem

I just started my new jekyll website with gitpages and I wanted to add something cool to my blog using javascript. It's nothing super fancy like what you see on many websites, but I thought it would be cool to present problems for my Elm tutorial to my readers and then have answers to these problems. But I didn't want to show the answers right away to the reader, but instead have a button that would show the reader the answer. This is a really easy to do with some simple JavaScript, CSS, and html, but I wanted to try to encapsulate these answer components into easy customizable Html tags, so I could quickly add them to the dom. 

## Shadow DOM

My first idea was to use a shadow DOM, because I could style these components inside the encapsulation, and not have to worry about the CSS affecting the outside CSS. I wasn't too familiar with using a shadow DOM before, but after trying to implement it with my blog website I have learned some of the positive attributes and negative attributes about it. 

## Creating a custom Html tag

Before I actually tried to connect a shadow DOM onto any of my elements, I first had to get familiar with using custom Html tags. The code below gives a component that is really just an h1 tage encapsulated by the custom tag. Go ahead and make a JavaScript file labeled HelloWorld.js and put the following code in it. 

```JavaScript
class HelloWorld extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<h1>Hello world</h1>`;
    }
  }
      
customElements.define('hello-world', HelloWorld);
```

Another way you could write this same code is by using `document.createElement('h1')` and the `appendChild` function. If we were to do it this way the code would become the following. 

```JavaScript
class HelloWorld extends HTMLElement {
    connectedCallback() {
      let h1 = document.createElement('h1')
      h1.textContent = "Hello World"
      this.appendChild(h1)
    }
  }
      
customElements.define('hello-world', HelloWorld);

```
Both styles have there pluses and minuses. The seconde example is more verbose, but to me it is a better structured way to write the customer tag, while the first example is less code. 

Go ahead and connect the code into a html file like the following:

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

<hello-world></hello-world>

<script src="HelloWorld.js"></script>
</body>
</html>
```
And Presto! We have our first custom Html element to use with our html files, though this example isn't very exciting because when we open up the file in a browser all we see is `Hello World`. Now to explain the code, we are just extending an html element and using the `connectedCallback` function when the element is appended to the DOM. `connectedCallback` is one of the many life cycle functions for custom html tags that you can have. Another one is `disconnectedCallback` which is called when you remove the element from the document. A source for more information is [here](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). 


## encapsulation of multiple tags in a custom Html tag

The way I often use custom html tags is to encapsulate many different things into one tag, so they become isolated tags you can kind of stamp on your html document. For example, let's say we wanted to add a button and some javascript into this custom tag. Let's make the button do something very trivial like just printing "You clicked me, thanks" to the console. You could wire it up as the following. 

```JavaScript
class HelloWorld extends HTMLElement {
    connectedCallback() {
    
        // Create elements for the custom tags
        let button = document.createElement('button')
        
        // set attributes
        button.textContent = "Click Me"

        // set function for the custom tag
        button.addEventListener("click", () => {
            console.log("You clicked me, thanks!")
        })

        // add button as a child to the HelloWorld tag
        this.appendChild(button)
   
    }
  }
      
customElements.define('hello-world', HelloWorld);
```
Instead of adding the addEventListener function, you could actually create a script tag for the custom element and add it that way too to the button. For example, check out the following code:

```JavaScript


```

## what we want to do


## interplay with jekyll


## shadow Dom


## non- shadow dom one

## scoped javascript


## problems

## make sure the path is correct in jekyll




