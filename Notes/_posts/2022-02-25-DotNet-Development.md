---
layout: post
category: notes
title: Notes for DotNet Development
image: Notes/assets/images/dotnet.png
summary: Notes for DotNet Development
date: 2022-02-24
author: Nathan Swindall
---

At my current job, I am using Vue.js with ASP.Net Core, but I haven't used ASP.Net Core in a long time and decided to go through a course to get my skills up to par again. This will be a section that will include quite a few notes on how to run an API with a frontend. The frontend will be React.js even though I am very familiar with Vue.js. 


### **Notes for ASP.Net**
{% assign Slots = "Notes/Chapters/ASP/API_Skeleton" | relative_url %} 
&rarr; <strong><a href="{{Slots}}"> API Skeleton</a></strong>
<!-- I noticed when I have .md it ruins the file -->

{% assign Slots = "Notes/Chapters/ASP/FSharpCSharp" | relative_url %} 
&rarr; <strong><a href="{{Slots}}"> FSharp and CSharp interoperability </a></strong>

{% assign Slots = "Notes/Chapters/ASP/ReactApp_Skeleton" | relative_url %} 
&rarr; <strong><a href="{{Slots}}"> React Skeleton</a></strong>

{% assign Slots = "Notes/Chapters/ASP/Vue_Skeleton" | relative_url %} 
&rarr; <strong><a href="{{Slots}}"> Vue Skeleton</a></strong>

{% assign Slots = "Notes/Chapters/ASP/Elm_Skeleton" | relative_url %} 
&rarr; <strong><a href="{{Slots}}"> Elm Skeleton</a></strong>

{% assign Slots = "Notes/Chapters/ASP/CRUD_mediator" | relative_url %} 
&rarr; <strong><a href="{{Slots}}"> CRUD application using CQRS + Mediator pattern</a></strong>

