---
layout: post
category: notes
image: /Notes/assets/images/dotnet.png
summary: Creating a CRUD application using the CQRS + Mediator pattern
date: 2022-05-05
author: Nathan Swindall
---

<link rel="stylesheet" href="/blog-tech/assets/markdown.css">

## Table of Contents 

- [Introduction](#introduction)
- [Clean Architecture](#clean-architecture)
- [CQRS](#cqrs)
- [Creating our first Query handler](#creating-our-first-query-handler)
- [Thin Controllers in API](#thin-controllers-in-api)

## <strong>Introduction</strong>

<p class='textBlurb'>
In this section we are going to work on making the different CRUD (Create Read Update Delete) operations for our API. There isn't much to show for this section but it is handling a lot of functionality that we will be able to test in postman. Now there is no perfect way to architecture your program to handle these operations. For this section we are going to implement the CQRS + Mediator pattern which is by no means the golden hammer (The perfect pattern that will solve all problems) of patterns but it will be apt for the functions of our app. 
</p>

## <strong>Clean Architecture</strong>

<p></p>
{%- assign CleanArchitecture = "Notes/assets/images/Dotnet/CleanArchitecture.png" | relative_url-%}
<img src ="{{CleanArchitecture}}">

<p class="textBlurb">
For a more detailed description of the clean architecture, you can check out <a href="https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html">this article</a>  which is where I go the picture from. I will try to explain the way I understand it. The above circles are all unidirectional, which means that the entities know nothing about the Use Cases layer and the Use Cases layer knows nothing about the Interface Adapters layer.<br/>
<u>Entities</u>: map directly to our domain. These are business objects. Right now the only entity that we have is the Activities entity. <br/>
<u>Use Cases</u>: is where all our business layer is and where our business rules are. This is where we will create an entity, delete an entity, update an entity and get and entity. This will form the basis of our CRUD operations.<br/> 
<u>Interface Adapters</u>: This is where our api is. <br/>
<u>Framework & Drivers</u>: This is where our user interface is and our Database. In theory, our entities have no knowledge of anything outside them. Thus, they have no knowledge of what database we are using or what front-end we are using. They are agnostic to everything. <br />
<br/>
<strong>Clean Architecture recommendations</strong><br />
1) Independent from frameworks - These principles can be applied to any framework including other ones other than Dotnet<br/>
2) Testable - It should be testable and the business layer should be testable without any external interfaces such as database.<br/> 
3) Independent from the interface - Should be able to change the application layer without changing the business layer underneath.This includes using other front-end technologies such as Elm, or Vue without changing anything underneath<br/>
4) Independent from the database - We should be independent from the database.<br/><br/>

<strong>Flow of Control</strong><br/><br/>
{%- assign ControllerPresenter = "Notes/assets/images/Dotnet/ControllerPresenter.png" | relative_url-%}
<img src="{{ControllerPresenter}}"><br/><br/>

The presenter and controller in the above picture are in the API layer, and the orange part are in the application Business rules layer. The API will receive an HTTP request and then send it to the Use Case Input Port layer to be processed. Then, once it is processed it will send it to the presenter part of our API to send out the appropriate HTTP response. The idea of the mediator pattern is that it covers this specific use case in our application. So, with our application, something will be sent to the API controller, and from here we are going to send a Query/Command to the Mediator.Send() function. The Mediator.Send() will send these queries or commands to the mediator handler which will handle our use case. For example, if we wanted to get an Activity from our database, this would be a use case, and we would send this query via the Mediator.Send() method to our mediator handler that lives in our application business rules layer. This will process our logic. This layer will return an object that will be sent to our API Controller and ultimately to the http response. 
</p>

## <strong>CQRS</strong>

<div class="textBlurb">
CQRS stands for Command Query responsibility Segregation, in our application we aren't really going to see the benefits of using this pattern, but if you have a database specifically optimized for write operations and a database optimized for read operations, you would begin to see the benefits of this pattern. So, for example, if you had a NoSQL read database such as MongoDB, and a regular SQL database for writing operations. This actually might be a fun future project to implement with this current project, and I will think about adding it later as I am familiar with using both types of database. Maybe, I would also use the MongoDB database for my video game that I am currently developing in F#. I digress though. The idea of this pattern is that we are going to have Commands and Queries. <br/><br/>


<strong>Commands</strong><br/>

<ul>
<li>Does something</li>
<li>Modifies State</li>
<li>Should not return a value</li>
</ul><br/><br/>
<strong>Query</strong><br/><br/>
<ul>
<li>Answers a question</li>
<li>Does not modify State</li>
<li>Should return a value</li>
</ul>

</div>

## <strong>Creating our first Query handler</strong>

<div class="textBlurb">

Going back to the model that we are creating for our app, the application layer holds our business logic. We need to create our business logic in this layer and in order to do that we will be using a package called MediatR. Go ahead and install this package using Nuget into your Application layer. Because the API project depends on our Application project, this nuget package will be available in our API project as well. The package is called: mediatR.Extensions.Microsoft.Dependencyinjection. Once you have done that we will delete the unused class1.cs class and create a new folder in our Application folder call Activities. From here we will create a new class called List.cs. Inside this class we will nest another class called Query. You could really call this class anything you wanted, but since it will be for querying in our buisness logic it makes sense to call it this. This new Query class will inherit from IRequest, so attach IRequest on to it. No we are going to create another nested class in our List class called Handler. This will be the Handler for actually going to our database. Make sure that it has the inheritance IRequestHandler. It should turn red, so you will have to implement the interface. Also, generate a constructor for the Handler class and add DataContext as an argument. You will have to bring in the proper using statements. Then initialize the correct field (look at the example code below for more details). Finally, for the function Handle that was implemented through the interface we will create the following function: <code class="code-style">return await _context.Activities.ToListAsync();</code>

</div><br/>

```cs
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>>{}

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.ToListAsync();
            }
        }
    }
}
```


<div class="textBlurb">

No we will edit our API controller. Go to the Activities API Controller and get rid of the DataContext context field and instead replace them with IMediator mediator. If you have trouble bringing in the using MediatR statement at the top, sometimes either turning on and off your visual studio code will work or using the command <code class="code-style">dotnet restore</code> will help. In the GetActivities method we are going to return <code class="code-style">return await _mediator.Send(new List.Query());</code>. We aren't going to worry about the other id method right now, so change the return statement to <code class="code-style">return ok();</code>. If you run your server now you will notice that you will still get an error like <code class="code-style">System.InvalidOperationException: Unable to resolve service for type 'MediatR.IMediato</code>. This is because we need to make it a service to use it as dependency injection like we are doing in the above controller. 

</div><br/>

```cs 
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using MediatR;
using Application.Activities;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {
        private readonly IMediator _mediator;

        public ActivitiesController(IMediator mediator )
        {
            _mediator = mediator;
        }

        [HttpGet] // api/Activities
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await _mediator.Send(new List.Query());
        }

        [HttpGet("{id}")] //api/Activities/{id}
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            // return await _context.Activities.FindAsync(id);
            return Ok();
        }
    }
}
```

<div class="textBlurb">
Now lets add it as a service in order to be able to use postman to test the get request for our server. Go to your startup file and in the services section add <code class="code-style"> services.AddMediatR(typeof(List.Handler).Assembly);</code>. If we restart our server (It seems that the watch doesn't work when updating the startup files so you need to restart the server), then you should be able to make an http GET request to our server now. 
</div><br/>

```cs 
  public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
            });
            services.AddDbContext<DataContext>(opt => 
            {
                opt.UseSqlite(_config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors( opt => 
            {
                opt.AddPolicy("CorsPolicy", policy => 
                {
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);
        }

```

## <strong>Thin Controllers in API</strong>




Independent from frameworks 
Testable 
Independent from the interface (React)
Independent from the database