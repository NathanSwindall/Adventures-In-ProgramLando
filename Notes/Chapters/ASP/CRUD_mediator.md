---
layout: post
category: notes
image: /Notes/assets/images/dotnet.png
summary: Creating a CRUD application using the CQRS + Mediator pattern
date: 2022-05-05
author: Nathan Swindall
---

## Introduction 


In this section we are going to work on making the different CRUD (Create Read Update Delete) operations for our API. There isn't much to show for this section but it is handling a lot of functionality that we will be able to test in postman. Now there is no perfect way to architecture your program to handle these operations. For this section we are going to implement the CQRS + Mediator pattern which is by no means the golden hammer (The perfect pattern that will solve all problems) of patters but it will be apt for the functions of our app. 

## Clean Architecture 

Independent from frameworks 
Testable 
Independent from the interface (React)
Independent from the database