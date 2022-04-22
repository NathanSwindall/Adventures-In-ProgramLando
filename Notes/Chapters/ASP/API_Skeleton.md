---
layout: post
category: notes
image: /Notes/assets/images/dotnet.png
summary: API Skeleton DotNet
date: 2022-02-25
author: Nathan Swindall
---

## <strong>Creating an API Skeleton<strong>

In this section I will be creating a simple API that can be tested with postman to get data back in JSON format. The first thing we need to do is setup the project. 


### setup

```dotnet - h``` => gives you the commands with dotnet 

`dotnet --version` => gives you yours version of dotnet

`dotnet new -l` => gives you a bunch of templates to use to start your project

`dotnet new sln` =>  Solution File -- this will be a container for out projects

`dotnet new webapi` =>  ASP.NET Core Web API command

`dotnet new classlib` =>  Class Library -- Supporter files

`dotnet new webapi -n API` => creates a folder with the name API with an API csproj file in it. 


First I will make a new directory with the command ```mkdir Reactivities```. Use the Reactivities ls to see what is in the file. We shouldn't have anything. Now go ahead and run `dotnet new sln` in the directory for Reactivities. From there we will create a few projects. 

The first project we will create is the api project. <br>
```dotnet new webapi -n API``` => This will create the webapi. It will talk to the Application level. 

The other commands to run in the Reactivities file are: 

`dotnet new classlib -n Application `

`dotnet new classlib -n Domain `

`dotnet new classlib -n Persistence`

Now that we have many different projects. We need to go ahead and add them to our solution. The way we are going to structure the project is as below. The dependency pathways are where the arrow is pointing. So if one project points to another, that projects relies on the project it is pointing to. 

### Domain 
The domain is the center of our application. The domain contains the business entities. The application will talk to the domain and the persistence layer will talk to the domain. 

```haskell
Application -> Domain <- Persistence
```

### Application 
The application is to process the business logic. The application level talks to the Domain level and the Persistence level. 

```haskell
Persistence <- Application -> Domain
```

### Persistence
Provides the connections to the database and translate code into SQL queries.The Persistence level talks to the Domain level, and the Application level talk to the Persistence level. 

```haskell
Domain <- Persistence <- Application
```

Now we need to add all the projects to the solutions files. We can do this with the following commands. 

```dotnet sln add API``` => This will add the api project to the solution. You can extrapolate the commands for adding the rest of the files to the solution file. 

```dotnet sln list``` => This command will show you all the project files in your solution. 

Now that we have all the projects in the file we need to add the dependency files to our solution. First we are going to ``cd`` into the API folder to add the dependency. As stated above, it depends on the application layer. Thus, form the API folder run the following command: 

``` dotnet add reference ../Application```

Now we will go to the application folder. It requires a dependency on the Domain level and the Persistence level. 

```dotnet add reference ../Persistence```<br>

```dotnet add reference ../Domain```

The commands for the Persistence. So cd into persistence 

```dotnet add reference ../Domain```


## .NET 6.0 Considerations 

There are a few things to take into consideration when making this project. 

We need to add these files to our project to understand the course better
Program.cs => There are not using statements
Setup.cs => This file isn't there 

launchsettings 5001 https and 5000 http for the applicationURL 
implicitUsings in API.csproj file. We should keep it enabled. In AI.csporj
To find the auto-generated file you can look int he obj file and find API.GlobalUsing.g.cs


The API.csporj as a property `<Nullable>` that will make something accept null properties. Without this code, the compiler will throw a run time 
error if the property contains a null value. 
We should take this off. Just makes it explicit that something could be null, by adding the ?
Adding two new files to the folder for the old version (add pictures here)

Changing the command line to 5001 and 5000


## Project Files 

Going through the files in VS code will cause a pop up to happen if you have the C# extension installed. The pop will auto-generate the missing files from out new project. Go ahead and click yes for this part. You can auto-generate these helpful debug files whenever you use `.NET: Generate Assets for Build and Debug`. 
have vscode build the features .NET: generate files 
add in settings to exclued those **/obj and **/bin
launch settings change launch browser to false 
delete the https localhost part 
dotnet run 
dotnet watch run


## Reviewing the project file and startup

Project references

exlude obj/ bin folders. They are auto-generated

Launchseetings
-launchBrowser: false 
-We aren't using Https

dotnet run 
dotnet watch run

auto save feature on 

Making the bin and obj folders not seen

Program.cs
webServer called kestrel comes with the asp.net 

```csharp
 public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
```

In the `launchSettings.json` I change a few things around. I made it so that the browser does not automatically run when the starting up the server, and because we are not going to worry about running https, the url for https was delete. It should look something like below. 

```json 
"profiles": {
    "API": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": false,
      "launchUrl": "swagger",
      "applicationUrl": "http://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
```

My `appsettings.Development.json` for this project will look something like the following. Adding the value `"information"` makes it so that we can get more information back form the build than just using `"warning"`. 

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}

```

Here is the startup file that you get out of the box. There are quite a few different things to talk about with this file. The first thing that I want to mention is that the `Iconfiguration configuration` is being injected into the startup class. This gives us access to a lot of different features. 

```csharp
namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

```

The `ConfigurationServices` is the part of the startup file for you [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection#:~:text=In%20software%20engineering%2C%20dependency%20injection,object%20is%20called%20a%20service.) right now we have dependency injections for controllers. This is because it is an API, and then an injection for swagger. We won't use swagger too much but it can help with testing your api, and it gives a nice html view of your API if you go to the swagger endpoing. 


```csharp

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

```

## The API controller and using postman

Controllers provide the endpoints for our API. In the starter files in our API folder there is a controllers folder tht will have our endpoints. Currently there is only one endpoint which is the weather forecast data endpoint. The ability to use this endpoint is enabled in the `Startup.cs` file. Its in the configure method where we have the `app.UseRouting` which is responsible for enabling the routing for our endpoints, and then the `app.UseEndpoints` which allows us to use the endpoints. In the `WeatherForecastController.cs` file we will find a few useful things. 

```csharp
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}

```

First we have the attributes `[ApiController]` which is a little confusing right now, but it gives this file the properties of an Api controller. Then we have the attribute `[Route("controller")]` which tells us the endpoint start. Our endpoints will start with the first part of the controller name excluding the word controller. Thus, our controller name is `WeatherForecastController`, therefore our controllers will start with `weatherforecast`. There are many different types of requests you can make. This controller as a GET request signalled by the attribute `[HttpGet]`. If we want to try this get requests out, we can use the software Postman and use the request endpoint as `http://localhost:5000/weatherforecast`. 

Notice that in this file we are creating a `new WeatherForecast` object. This object is a model for the data that we will be giving out. We need it so we now the exact type of data. It is currently just floating in the API folder, but this will hopefully change to a better setup as we add more API endpoints and controllers. 

## Creating a Domain

In our Domain folder we are going to delete the class1.cs file and make a new file called `Activity`. If you have the C# extensions plugin for the visual studio code, then you have some automatic features to do this. Once you have this you can use the automatic property creator shortcut which is `prop`. If you start typing this in, it will save you some time, though not really that much time, but if you are typing out a long list of properties it really helps. Then you can just use tab to rename the parts of the property. This is a bit a boilplate code unfortunately. This will be a model for a entity in our database call `Activities`. 


```csharp
namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }   
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category {get; set; }
        public string City {get; set;}
        public string Venue { get; set; }
    }
}

```

## Adding an Entity Framework Db Context

First, we need to install some packages. We are going to be using sqlite for a bit so we need to install the correct packages to help us do this. If you have windows and visual studio code you can press `ctrl-shift-p` in order to pull up nuget gallery. Once you pull up this you will install `Microsoft.EntityFrameworkCore.Sqlite`. This is a SQLite database provider for Entity Framework Core. What we are really doing is seting up an Object Relational Mapper. This will make it so that we can write SQL statements and deal with our database in purely C# code. So we don't have to worry about being in expert in SQL. Will will install this package in the Persistence folder. Make sure to select the same version as your run time. You can check your version of dotnet by typing `dotnet --version`. Once will install we should see a new reference to the package in `Persistence.csproj`. 

You can delete the `Class1` file in the Persistence folder and now make a new file called `DataContext`. We are going to derive from the class DbContext which is part of the EntityFrameworkCore package that we just installed. Some interesting database patterns to look into that are used in the course are the Unit of Work Pattern and the Repository Pattern. Maybe it would be a good option to look them up in the future. 

First we need to generate the constructor for this new class. With visual studio code you can actually just kind of hover over the DbContext and generate the constructor. Another way is to use the `ctro` word to auto generate it, but it doesn't come with the base part of it. The base part included in the constructor means to pass the options to the DbContext constructor.  Our models for the data will be the classes like the Activity class we made earlier. According to the documentation "...typically you create a class that derives from DbContext and contains DbSet<TEntity> properties for each entity in the model. If the DbSet<TEntity> properties have a public setter, they are automatically initialized when the instance of the derived context is created." Thus the properties in the Activity class all have setters, so they will all be initialized. 

We will make a new property on this class as such: 

```csharp 
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Activity> Activities { get; set; }
    }
}
```
Since the Activity class as a property called `Id`, entity framework will actually recognize this and then make it the primary key. If we named it something else then the framework would not know what the primary key was. This could cause problems. I am not sure, but maybe you can set the primary key to something custom. The code will make a new table called activities with the columns as the properties in Activities. Unfortunately we aren't done yet. We need to go to the startup file. We will add a service in the ConfigureServices part. Also, we need to install `Microsoft.EntityFrameworkCore` core package into our API project in order to get the AddDbContext, and also `MicrosoftFrameworkCore.SqlLite` in order to get the `UseSqlite` portion to work. 

```csharp
services.AddDbContext<DataContext>(opt => 
{
    opt.UseSqlite(_config.GetConnectionString("DefaultConnection"))
}
)
```

We are going to change up the Startup function a little bit. First create this: 
```csharp
public Startup(IConfiguration config)
    {

    }
```

Then with the automated part we are going to initialize a private variable. In order to get private variables that have the prefix '_' with them we will have to have the plugin `C# Extensions` and then go to settings and change the private prefix to '_' for this part. Thus when we are done we should have something like: 

```csharp
public IConfiguration _config { get; }
public Startup(IConfiguration config)
    {
     _config = config;
    }
```

I did run into quite a lot of trouble with my visual studio code marking things as red or "False Errors". I ended up having to install different packages sometimes and restarting my visual code also helped. When in doubt, always restart your visual studio code. I have some plugins that are probably screwing up things a bit, so make sure that you turn off plugins that might be screwing with things. 






base(options) is passing the options to the derived class so the passing it to the DbContext constructor. 
DbSet<Activity> Activities. This Activities part will be the name of our table will columns that will match the names of our class. 
We want an Id so that we know which part is the primary key
Go to startup file and add a service to our dependency container 

services.AddDbContext<DataContext>(opt => 
{
    opt.UseSqlite(_config.GetConnectionString("DefaultConnection"))
}
)

Now we will also change the configuration in the setup part. 
private readonly IConfiguration _config 

public Startup(Iconfiguration config)
{
    _config = config;
}

In the settings go to the private part and set Csharpextensions: Private MemberPrefix as `-`. 
remove this setting 
Go to Csharpextensions. Use This for Ctor Assignments. Don't mark this. 

We need to add our defaultString that will be used by the SqlLite. We add it to the app settings. 
"ConnectionStrings": {
    "DefaultConnection": "Data source=reactivities.db"
}


## Creating an Entity Framework code first migration

So the migration will make a table in our database called Activities with the properties from the Activity class. 
Make sure to stop your server. 
cd Reactivities 
use the command dotnet tool list --global
This will make sure you have the dotnet-ef tool. 
If not installed go to nuget.org/packages/dotnet-ef/
dotnet tool install --global dotnet-ef --version <your version>
if already installed 
dotnet tool install --global dotnet-ef --version <your version>
dotnet ef migrations add InitialCreate -p Persistence -s API
-p is where the DbContext is 
-s is where the starter project is
We will probably get an error. 
We will need to reference Microsoft.EntityFrameworkCore.Design. 
We will need it in our API project. 
Look at the migration file. The first one. 
