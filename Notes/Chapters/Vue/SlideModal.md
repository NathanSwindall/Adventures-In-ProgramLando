---
layout: post
category: notes
image: /Notes/assets/images/vueart.png
summary: Vue Slots
date: 2021-11-03
author: Nathan Swindall
---



## **Initial Planning**

A recent project I have been given at work is one where I have to reskin something that is already in production. This involves turning a page into a slide modal that will have all the functionality that the page originally had. I won't go into too much of what is on the page. There are a few important things that I can say at this very moment. The slide modal is used to display different rates for given projects over many years. These rates will also differ for certain categories. For example, let's say we are keeping track of the rate a car devalues in a given year based on four different companies’ assessment of the car. This car might devalue in price for by 20% for one company's assessment and then by 23% for another company. The slide modal that I am creating will give a user the ability to see what the different rates are by year and company, and if the user has certain privileges, they will be allowed to edit the rate for a given year. To create this slide modal, I will be using the frontend frame Vue version 2. I have come to really love Vue, and have found the learning curve to be quite manageable compared to React, which has always confused me. I am also using typescript and all many different packages to help with typescript + vue development. A great blog article that I have found that really got me up to speed using typescript with vue is [Typscript + Vue](https://blog.logrocket.com/vue-typescript-tutorial-examples/)


## **First Problem**

The first problem that I faced was figuring out how to create a modal that would be triggered and slide beautifully across the screen. This was actually easily done with a vuetify. Vuetify has the navigation-drawer component which works just a like a charm in this case. The only trouble that I ran into, which was actually quite a pain to deal with, was the fact that the navigation-drawer didn't originally go over the nav bar, and I wanted it to cover everything. It unfortunately took me days to fix this problem, and I tried many different solutions. One was to put the navigation-drawer at the top level, but this is not best practice because when doing so, it renders the lifecycle hooks almost unusable or inoperable. This is because the component is created along with the app.vue file. The way that it needed to be used was by putting it at lower levels. Also, after trying to implement this solution, I ended up having to put code outside the component. This isn't necessarily a bad thing, but since I need to reuse this component in quite a few places, this editing quickly becomes quite unwieldy. 

After talking to another dev, I found out that they had put the z-index on the nav-bar to such a high value (because they never wanted anything over it) that it caused the navigation-drawer to always be below it. This will definitely be a lesson for future projects on this app... always check the z-index value. 

After finally finishing the slide part of the slide modal, it was finally time to add stuff to the modal. I have never been a css whiz kid, so I have been having a lot of trouble with this part. I first started to try to recreate the table using regular html elements, and was going to use css to style it into a table. This very quickly got out of hand because I was creating many div tables with spans in them ... and well... it was an absolute mess. I quickly looked into vuetify to see if they had any elements that might be worth using and luckily enough they did actually have something that made my job almost too easy. They had the v-rows and v-cols ui components. It definitely made the html for my slide modal a lot more readable, but I was running into a new problem which was how to line up all the items. 


Figuring out the vuex store


# To Be Continued







