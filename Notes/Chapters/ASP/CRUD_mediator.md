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

<div class="textBlurb">
The create endpoint will be slightly different from the previous examples, but will follow the same pattern. We are going to once again create a class in the Activities folder, but with the name <code class="code-style">Create.cs</code>. In this class we are going to create a Command class (not the query class as in the previous examples), and a <code class="code-style">Handler</code> class within the Create.cs class. like in the examples before. Remember that queries are getting something while commands are telling our code to do something. This is why we use <code class="code-style">Query</code> for getting something will we use and <code class="code-style">Command</code> for changing something or creating something. We will add a property to the command class becasue this is what we are creating and inherit from IRequest but this time just IRequest. Then the Handler class will inherit from the IRequestHandler with Command as the type.  
</div><br/>

```cs
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {

            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }
            async Task<Unit> IRequestHandler<Command, Unit>.Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Activities.Add(request.Activity); // stored into memory so we don't need to add await

                await _context.SaveChangesAsync();

                return Unit.Value; // because our code must return something
            }
        }
    }
}
```
<br/>
<div class="textBlurb">
The implementation of the IRequestHandler class looks a bit different, but it's not too important. Just go with the flow. We are adding the DataContext variable like normally. For the implementation of the Handle function we are use the Add function on the context variable. We don't make it async because we are just adding it in memory. We use async when making the save to the Database. We have to return something for this function, but since we are just saving and not wanting anything back, we will return <code class="code-style">Unit.value</code> which is just a dummy value. Now let's make the post route. Go to the Activities Controller and add a new function call <code class="code-style">CreateActivity</code>. Make it async, the task object will be of type<code class="code-style">IActionResult</code> instead of the <code class="code-style">ActionResult</code> like the previous versions. 
</div><br/>

```cs 
[HttpPost]
public async Task<IActionResult> CreateActivity(Activity activity)
{
    return Ok(await Mediator.Send(new Create.Command{Activity = activity}));
}
```
<br/>

<div class="textBlurb">
The one last thing to notice is that the Parameter is activity. The framework is smart enough to know where it is getting this parameter, which is from the body of the request, but if you want to add it to the beginning of the parameter, you could write it like the following: 
</div><br/>

```cs 
[HttpPost]
public async Task<IActionResult> CreateActivity({FromBody]Activity activity)
{
    return Ok(await Mediator.Send(new Create.Command{Activity = activity}));
}
```
<br/>

<div class="textBlurb">
This request is a littler trickier to test out then the previous requests. This is because we have to do some setup in Postman in order for it to work. We are going to send a json file like the following. <br/>
{%- assign PostmanCreateActivity = "Notes/assets/images/Dotnet/PostmanCreateActivity.png" | relative_url-%}
<img src="{{PostmanCreateActivity}}"><br/><br/>

You can see that we have a variable for the guid, and a variable for activityDate. Postman has the ability to automatically make Guid types for you when sending data. Making a specific activity date is a little trickier. You are going to actually have to write a Pre-request script in order to do that. <br/><br/>

{%- assign PostmanCreatePreScript = "Notes/assets/images/Dotnet/PostmanCreatePreScript.png" | relative_url-%}
<img src="{{PostmanCreatePreScript}}"><br/><br/>

If you get a 405 error method not found. You might want to stop and restart you server because this might be able to fix it. The script above actually creates a date that is 14 days ahead of the current date. 
</div>

## <strong>Adding an Edit Handler</strong>

<div class="textBlurb">
The next endpoint that we are going to construct is the edit endpint. The point is going to be very similar to the one for create where it will be a command type, but there will be some minor differences. We will setup everything pretty similarly the way we setup the create class with first making a new class called <code class="code-style">Edit.cs</code> in the Activities folder of our application project. Then we will create two new class that will inherit from the IRequest and IRequestHandler again with the type of Command. The property that the Command class will have will be a Activity property. Let me show you the code. 
</div><br/>

```cs
namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }
            async Task<Unit> IRequestHandler<Command, Unit>.Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id);

                activity.Title = request.Activity.Title ?? activity.Title;

                await _context.SaveChangesAsync();

                return Unit.Value;

            }
        }
    }
}
```
<br/>

<div class="textBlurb">
implementation of the Handle function will be slightly different, and we will hold off on its true implementation until the next section. First, we are getting the activity from our datacontext variable according to the id we get from the request. Then, if in the request we are changing the title, then we will change the activities title in memory, if not, we will keep the old title. Finally we will save it asynchronously to the database. We have to use the <code class="code-style">Unit.Value</code> because the function has to return something. Now, we are going to write our endpoint in the controller to talk to this new request. The edit endpoint will be a <code class="code-style">PUT</code> request because we are just editing an activity already there. The <code class="code-style">POST</code> request is for if we are creating a new activity. We are editing a specific activity too, so we will need to add the id to the path. But this begs the question, are we going to have to had a line for each property we are going to change? What if we have hundreds of properties that need to be change? In all due time! Just work with me right now. 
</div>

```cs
[HttpPut("{id}")]
public async Task<IActionResult> EditActivity(Guid id, Activity activity)
{
    activity.Id = id;
    return Ok(await Mediator.Send(new Edit.Command{Activity = activity}));
}
```

<div class="textBlurb">
As a reminder, we are trying to edit an activity, so we are included the activity edits in the request, so the dotnet framework is smart enough to know that the activity comes from the request. We are attaching the id to this activity before sneding it off to the mediator class, so that class can pull the current activity from the database. In postman, we will have to setup the environment slightly like we did for the create request. <br/>

{%- assign PostmanEditJson = "Notes/assets/images/Dotnet/PostmanEditJson.png" | relative_url-%}
<img src="{{PostmanEditJson}}"><br/><br/>

You will have to setup the prescript exactly like you did for the create request. <br/>


{%- assign PostmanEditPreScript= "Notes/assets/images/Dotnet/PostmanEditPreScript.png" | relative_url-%}
<img src="{{PostmanEditPreScript}}"><br/><br/>


</div>
 


## <strong>Adding AutoMapper</strong>

<div class="textBlurb">
In the last section, to update a single property wasn't too bad, but if we wanted to update quite a few properties, this could get pretty unwieldy after many times. So, first we need to make a new folder in the application layer called Core. We are going to have to install a new nuget package. The nuget package is called <code class="code-style">AutoMapper.Extensions.Microsoft.DependencyInjection</code>. Now create a class in the folder called <code class="code-style">MappingProfiles</code>, and have this class inherit from Profile which we will get from <code class="code-style">using AutoMapper</code>. The tricky part is adding the dependency to our startup file in the API folder. With the newest update you won't probably need a using statement, but you might need to restart your visual studio code, or use <code class+code-style>dotnet restore</code> if you IDE marks the new line of code as red. The code to add to your start up file is: <br/><br/>

<code class="code-style">services.AddAutoMapper(typeof(MappingProfiles).Assembly);</code><br/><br/>

Then, the class you made is below. 
</div> <br/>


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
<br/>
<div class="textBlurb">
Now that we have everything wired up, we need to add it as a dependency injection in our edit class. Then we will add another line of code in the Handle request so that we are mapping any changes in the request onto our database Activity. Finally, make sure to test it in postman. You can just pick a specific id and then use that one to change the contents of the activity. Make sure to do a get request to see your changes. 
</div> <br/>


```cs 
public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }
            async Task<Unit> IRequestHandler<Command, Unit>.Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id); // Get the specific Activity from the database

                _mapper.Map(request.Activity, activity); // Now map the request Activity onto the request activity to get the changes. 

                await _context.SaveChangesAsync(); // Now save those changes

                return Unit.Value;

            }
        }
```

<br/>
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

## <strong>Continuing Our Countries Endpoint</strong>

<div class="textBlurb">
Continuing our countries example from the first part of this app, we are going to add the mediator pattern to it, and test it out. If you decided to make some other endpoint, do it your own way and try to learn by doing what you read. I think the best approact to learning is trying and tinkering with the code to really find out different ideas your might have for your own app, or a future app of your dreams. To start of with, let's rewrite the <code class="code-style">GetCountries</code> function using the mediator pattern. I have written the code below which is really just a copy of the list class you made for the Activities. Firstly though, you will create a folder in the application folder that is called <code class="code-style">Countries</code> that will house all the classes for our Countries class. Then, we will write the code. 
</div><br/>

```cs
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Countries
{
    public class List
    {
        public class Query : IRequest<List<Country>>
        {

        }

        public class Handler : IRequestHandler<Query, List<Country>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;

            }
            public async Task<List<Country>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Countries.ToListAsync();
            }
        }
    }
}
```
<br/>
<div class="textBlurb">
The crazy thing is that we don't have to add any code to our startup class. The startup class only needs the type from one of our classes, whether it is the Activities List.cs class or any other class that implements this IRequest, and IRequestHandler type pattern we are seeing and the magic will happen. We are starting off with just the easy GET request, so go ahead and comment out the rest of your class code, and just focus on this request in your controller, and then test it out in Postman.  
</div><br/>

```cs 
namespace API.Controllers
{
    public class CountriesController : BaseController
    {
        

        [HttpGet] // api/Countries
        public async Task<ActionResult<List<Country>>> GetCountries()
        {
            return await Mediator.Send(new List.Query());
        }

        // [HttpGet("{id}")] //api/Activities/{id}
        // public async Task<ActionResult<Country>> GetCountry(Guid id)
        // {
        //     return await _context.Countries.FindAsync(id);
        // }


        // [HttpGet("speak/{language}")] //api/Countries/{languages}
        // public async Task<ActionResult<List<Country>>> GetCountriesThatSpeak(string language)
        // {
        //     return await _context.Countries.Where((Country country) => country.Language.ToLower() == language.ToLower()).ToListAsync();
        // }
    }
}
```
<br/>

<div class="textBlurb">
</div>

<div class="textBlurb">
Some things that I would like to try are populating my database with data from another API so that we would have all the countries. I wonder if there is such an API that would fit our model, and then I would like to try this pattern using F#. It would be interesting if you could do such a pattern in F#. Still, my knowledge of F# is not too great right now. The branch for this specific part of the app are located <a  href="https://github.com/NathanSwindall/dotnet-tutorial/tree/crud_operations">here</a>. 
</div>

