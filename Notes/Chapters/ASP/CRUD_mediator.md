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

<div class="textBlurb">
The first thing we are going to do is delete the constructor in the ActivitiesController class. We are trying to make our controllers thinner so we are going to add some logic to the BaseController class to make the derived controllers as thin and neat as possible. Now go to the BaseController class and add the following properties.  
</div><br/>

```cs 
public class BaseController: ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>(); // available to any derived classes
    }
```

<div class="textBlurb">
There are few things to note here. We are using the protected keyword for the Mediator variable because we want any derived classes to be able to use this variable. Then, we are using a special function with the operator <code class="code-style">??=</code>. This special function means that if <code class="code-style">_mediator</code> is null then we will assign the result of <code class="code-style">HttpContext.RequestServices.GetService...</code> to our Mediator variable. Now, since we added the Mediator variable to our base controller. It will be available in all of our controllers. Let's add Mediator to the controllers now, and make sure to test everything in postman to make sure it works. 
</div> <br/>

```cs 
 public class ActivitiesController : BaseController
    {

        [HttpGet] // api/Activities
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")] //api/Activities/{id}
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            // return await _context.Activities.FindAsync(id);
            return Ok();
        }
    }
```


<div class="textBlurb">
Since we have access to the Mediator variable from our base controller, we can now just use it freely in our controllers. You will notice that I go rid of the constructor which exposed our DataContext over our controllers. Now we have hid away the implementation of everything and are contacting the DB on a different layer altogether, which is our Application layer that handles business logic. We are sending data through our controllers to the Mediator which can be found in the Application layer, and from this layer, the Mediator is sending the data back to the controller. 
</div><br/>

## <strong>Adding a Details Handler</strong>

<div class="textBlurb">
We are going to do something very similar to the last section. We are creating another query again. This pattern splits up things into queries which are meant for grabbing data, and then commands which will change data in the database. So, we are going to make another class in our Activities folder called <code class="code-style">Details.cs</code> this time. The class could really be called anything, but we are grabbing specific details fo an Activity. We are creating it in our business logic again (just had to write that to remind myself again). So after creating the class, make a class inside it called <code class="code-style">Query</code>. This pattern will become quite familiar to you as you make the other CRUD operations. Have the query class inherit from IRequest which will have a type of Activity. Also, add a property to the Query class with a Guid id. So it will look something like below. 
</div><br/>

```cs 
namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity> 
        {
            public Guid Id { get; set; }
        }

    }
}
```


<div class="textBlurb">
We need to add the Handler class to our details class just like we did previous for the <code class="code-style">List.cs</code> class. So, go ahead and write a class that inherits from IRequestHandler with a type of Query, Activity. Then implement the interface to get rid of the red which will give you a function called Handle. This function should be async, so add async in front of it, and then add the following code to the return. Sorry, for writing so dryly, but there isn't too much excitement here. Also, you will need to add the using statements. 
</div><br/>

```cs
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity> 
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.FindAsync(request.Id); // Not handling the null case
            }
        }
    }
}
```

<div class="textBlurb">
We are going to go back to our API controller for Activities and add <code class="code-style">await _context.Activities.FindAsync(request.Id)</code> to our return statement for our HtttpGet request for getting a singled activity by id. After you do this, make sure to test the route in Postman. 
</div><br/>

```cs 
    [HttpGet("{id}")] //api/Activities/{id}
    public async Task<ActionResult<Activity>> GetActivity(Guid id)
    {
        // return await _context.Activities.FindAsync(id);
        return  await Mediator.Send(new Details.Query{Id = id});
    }
```
<br/>

## <strong>Adding a Create Handler</strong>
Add new class to Activities called Create 
add a new class called Command that inherits the IRequest but this time we don't do <Activity>
add an property to this class that is an Activity property 
Now add a new class called Handle : IRequestHandler<Command>. Notice it doesn't have any reture item. We could make it have a return item maybe. 
implement the interface and using all the using statements to clear the red. 
Add datacontext in the constructor function using the readonly way. 
From there we are going to use _context.Activities.Add(request.Activity)
We don't need to use AddAsync here because it is only saving to local memory and not our database right now .
Then add await _context.SaveChangesAsync(). This uses our database so we need to save it. 
Our function has to return a Task<Unit> so we will to a return Unit.Value; to get rid of the red. 
Now go to Activities controller 
Add a Create Activity with an [HttpPost] attribute above it. 
return Ok(await Mediator.Send(new Create.Command{Activity = activity})) 
make sure the Task<IActionResult> is used in the function as a return value. 
Test in Postman. 
In properties you can use {{$guid}} that will make postman produce its own Guid. 
You could use [FromBody] attribute
Then make the date variable = {{activityDate}} for a variable in the pre-request Script 
    var moment = require("moment")
    pm.environment.set('activityDate', moment().add(14,'day's).toISOString());

Fully test out in Postman

## <strong>Adding an Edit Handler</strong>

First thing we are going to do is create and Edit class in Activities 
Create a Command class that inherits IRequest 
Make a property in this class for an Activity  Activity Activity 
Make another Handle class that inherits IRequestHandler<Command>
implement the interface with it and create the constructor that takes in our Datacontext 
Because we are updating we need to actually get the activity first. 
Firstly, we do a 
    var activity = await _context.Activities.FindAsync(request.Activity.Id)
    then let's just change the title right now 
    activity.Title = request.Activity.Title ?? activity.Title
notice that we are using ?? instead of ??= 
now await _context.SaveChangesAsync() 
return Unit.Value
Now go to Activities Controller 
create a put request because we use put requests to change things 
It should take an id 
create function EditActivity(Guid id, Activity activity)
activity.Id = id
then return Mediator.Send(new Edit.Command{Activity = activity)
test out in postman. 

## <strong>Adding AutoMapper</strong>

In the last section, to update a single property wasn't too bad, but if we wanted to update quite a few properties, this could get pretty unwieldy after many times. 
So, we need to add a folder called Core to our Applicaton project 
Install autoMapper with dependency extensions from the Nuget Library
Now create a class in the core folder called Mapping Profiles 
Make the class derive from Profile (which is from AutoMapper)
add the dependency to our startup file. This will be very similar to the one we added for list. 
It seems that we don't need to add a dependencyinjection for all the List like objects 
so Services.

create a constructor for the MappingProfiles

```cs
using AutoMapper;
using Domain 

namespace Application.Core 

    public class MappingProfiles : Profile 
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>(); // Mapping from an Activity to an Activity 
        }
    }
```

Dependency inject the IMapper interface into your Edit Handler constructor and add the readonly variables
Now in Handle _mapper.Map(request.Activity, activity) so we are mapping the the activities from the request to the activity in the database
Now test in PostMan


## <strong>Adding a Delete Handler</strong>

Commands don't return anything
Add a new class to the application activities folder called Delete
Go ahead and make the command class in your delete class and have it inherit from IRequest
Create a property on this class for the Guid id 
Now create a Handler class and inherit from IRequestHandler<Command>
No make the Handle async 
We are going to make a constructor for the Handler class that dependency injects the DataContext field into 
Now go to the handle method and add 

```cs 
var activity = await _context.Acitvities.FindAsync(request.request.Id)

_context.Remove(activity); // removes from memory

await _context.SaveChangesAsync(); // actually updates the database

return Unit.Value;
```

Add the endpoint now 

```cs
[HttpDelete("{id"})]
public async Task<IActionResult> DeleteActivity(Guid id)
{
    return Ok(await Mediator.Send(new Delete.Command {Id = id}))
}
```

## <strong>Startup Class Housekeeping</strong>

In the api, add a new folder Extensions 
Create a new class ApplicationServiceExtensions, make it static 
create a static method 
```cs
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        .... // cut an paste all the code from the starter class here except for the addcontrollers code
        return services
    }
```
Then add this method in our starter class. 


## <strong>CancellationToken</strong>

The cancellation token is to be used when a user cancels the request so that the request gets cancelled. If we don't use the cancellation token when the user 
cancels the request, then the request will still try to hit the endpoint and bring back data. 

In the List.cs file, put this in the Handle method

```cs

try{

    for (var i = 0; i < 10: i++)
    {
        cancellationToken.ThrowIfCancellationRequested();
        await Task.Delay(1000, cancellationToken);
        _logger.LogInformation($"Task {i} has completed");
    }
} catch (Execption ex) when (ex is TaskCanceledExpeception)
{
    _logger.LogInformation("Task was cancelled");
}

```

Now, let's go to the Activitiescontroller.cs, we want to make sure to pass the httpGet for activities function the parameter CancellationToken ct
Then, pass ct as a parameter to the Mediator class
Now it is available in our List.cs class. 
If we try it now, and cancel the request, then we can use it. 



## <strong>Using debugger in VS Code</strong>

If you don't have the .vscode files in your other files, then you will need to generate it. Just type in generate after doing ctrl + shift + p on windows.
Now, you can go into debugger mode. There are two different debugger modes. One is for attaching to an already running server. This way will require you to chose the dotnet version that has the API.exe file, while the other will help you debug your started files because it starts the file for you.

## <strong>Summary</strong>

We made different layers to map to Clean Architecture. 
We looked at CQRS + Mediator pattern. 
Our api controllers send something to our business logic which has a Mediator. Mediator will form the request and then send it back out to our API Controller. 
We created the CRUD operations

[Even Sourcing](https://youtu.be/JHGkaShoyNs)

How would you use a NoSQL database with our server instead? Could you use the Mediator Pattern? How would all this be implemented. 
Different NoSQL database are MongoDB, Azure Cosmos DB, Cassandra, RavenDB, CouchDB, ... these might be interesting. 

