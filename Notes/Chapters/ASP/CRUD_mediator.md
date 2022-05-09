---
layout: post
category: notes
image: /Notes/assets/images/dotnet.png
summary: Creating a CRUD application using the CQRS + Mediator pattern
date: 2022-05-05
author: Nathan Swindall
---

<link rel="stylesheet" href="/blog-tech/assets/markdown.css">

## <strong>Introduction</strong>

<p class='textBlurb'>
In this section we are going to work on making the different CRUD (Create Read Update Delete) operations for our API. There isn't much to show for this section but it is handling a lot of functionality that we will be able to test in postman. Now there is no perfect way to architecture your program to handle these operations. For this section we are going to implement the CQRS + Mediator pattern which is by no means the golden hammer (The perfect pattern that will solve all problems) of patters but it will be apt for the functions of our app. 
</p>

## <strong>Clean Architecture</strong>

<p></p>
{%- assign CleanArchitecture = "Notes/assets/images/Dotnet/CleanArchitecture.png" | relative_url-%}
<img src ="{{CleanArchitecture}}">

<p class="textBlurb">
The above circles are all unidirectional, which means that the entities know nothing about the Use Cases layer and the Use Cases layer knows nothing about the Interface Adapters layer.<br/>
<u>Entities</u>: map directly to our domain. These are business objects. Right now the only entity that we have is the Activities entity. <br/>
<u>Use Cases</u>: is where all our business layer is and where our business rules are. This is where we will create an entity, delete an entity, update an entity and get and entity. This will form the basis of our CRUD operations.<br/> 
<u>Interface Adapters</u>: This is where our api is. <br/>
<u>Framework & Drivers</u>: This is where our user interface is and our Database. In theory, our entities have no knowledge of anything outside them. Thus, they have no knowledge of what database we are using or what front-end we are using. They are agnostic to everything. <br />
<br/>
<strong>Clean Architecture recommendations</strong><br />
1) Independent from frameworks - These principles can be applied to any framework including other ones other than Dotnet<br/>
2) Testable - It should be testable and the business layer should be testable without any external interfaces such as database.<br/> 
3) Independent from the interface - Should be able to change the application layer without changing the business layer underneath.This includes using other front-end technologies such as Elm, or Vue without changing anything underneath<br/>
4) Independent from the database - We should be independent from the database. 
</p>

Independent from frameworks 
Testable 
Independent from the interface (React)
Independent from the database