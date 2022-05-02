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

First, we need to install some packages. We are going to be using sqlite for a bit so we need to install the correct packages to help us do this. If you have windows and visual studio code you can press `ctrl-shift-p` in order to pull up nuget gallery. Once you pull up this you will install `Microsoft.EntityFrameworkCore.Sqlite`. This is a SQLite database provider for Entity Framework Core. What we are really doing is setting up an Object Relational Mapper. This will make it so that we can write SQL statements and deal with our database in purely C# code. So we don't have to worry about being in expert in SQL. Will will install this package in the Persistence folder. Make sure to select the same version as your run time. You can check your version of dotnet by typing `dotnet --version`. Once will install we should see a new reference to the package in `Persistence.csproj`. 

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

I did run into quite a lot of trouble with my visual studio code marking things as red or "False Errors". I ended up having to install different packages sometimes and restarting my visual code also helped. When in doubt, always restart your visual studio code. I have some plugins that are probably screwing up things a bit, so make sure that you turn off plugins that might be screwing with things. Alss there is another setting we want to change in the C# extensions which is the 'this' setting. To do this we are going to go to options again and change the Ctor assignment which is just unchecking the "Use This For Ctor Assignments part which will get rid of the this key. 

Lastly, for this section we need to go change the connection strings so that it connects to the sqlite database. We can add this following to our app settings below. I am curious if you can change the "DefaultConnection" part to something else, or if you can change the name of the database to something else instead of reactivities.db. 

```json
"ConnectionStrings": {
    "DefaultConnection": "Data source=reactivities.db"
}
```


## Creating an Entity Framework code first migration

There is some magic going on in this section. We are going to add a migration of the data we want to our database. A migration seems to be just adding a table to our database with the properties that were specified in our domain file. So `Activity.cs` has what are columns we want to be in our file and then `DataContext.cs` actually contains what we want our table to be called with these columns which is `Activities`. To start, make sure you server isn't running. You will get a vague error if you have your server running while trying to do a migration. Make sure you are in the Reactivities folder so cd up if you are still in the API folder. 

We are going to need the dotnet tools to make a migration. You can check if you have the tools installed by running the `dotnet tool list --global`. You need to make sure you have the `dotnet-ef` installed. If you don't then you can go to the `nuget.org/packages/dotnet-ef/` to get this package. Then you will run the following command based on your version `dotnet tool install --global dotnet-ef --version <your version>`.
Now to run the migration you will run a migration command. The command is `dotnet ef migrations add InitialCreate -p Persistence -s API`. "-p" is where the DbContext is and "-s" is where the starter project is. You will probably get an error the first time you run it because you will need another package in your references for the API project which is `Microsoft.EntityFrameworkCore.Design`. Install this and then run the command again. 

When I was running the command, I kept running into a problem. The error I kept getting back was :

```python
#It was not possible to find any compatible framework version
#The framework 'Microsoft.NETCore.App', version '2.0.0' (x64) was not found.
```
I searched quite a bit for what was causing this error and found out that I had been entering the about command wrong. I kept entering `dotnet ef migrations add InitialCreate -p Persistence - s API` instead of `dotnet ef migrations add InitialCreate -p Persistence -s API`. That space between the '- s' caused this problem, so if you ever get this error, always make sure your commands are well typed. We get a few files once we run the migration. You can also use one of the options to specify which framework to use too. I am not sure if this will work but always know your commands. `The migration is where the DbContext, so this is where the files will show up. You will get a file called `initialCreate.cs`. This is where we have the C# code that converts to sql commands to make a table. It looks something like this: 

```csharp
namespace Persistence.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    City = table.Column<string>(type: "TEXT", nullable: false),
                    Venue = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Activities");
        }
    }
}
```

Notice that we have a function called Down that will drop the table, and a constraint that make the primary key for our table which is the id. The two other files are just snapshots of our database migrations, and we can actually use these snapshots to go back to another migration if we mess up our migrations. 


## Creating the database
When we start up our program, we want to be create our database with the table in it too. We are using SQLite so this makes sense to do. We will change the Main method in program.cs in order to do this. The code below is how we will change it. 

The using keyword is a special keyword that will make it so that anything stored in the variable that is after it will be deposed of after the method is over. It is a little confusing, but maybe it will make sense later. I don't see why we need to dispose of the services we are bringing into the method. It's kind of making it a local variable that gets deleted. This seems to be useful for when you are using a try/catch block because the using keyword is sort of like a finally statement that uses the dispose method to dispose of the object created. It helps with resource management. 

```csharp
public static void Main(string[] args)
{
    var host = CreateHostBuilder(args).Build(); // originally this had run on it

    using var scope = host.Services.CreateScope();

    var services = scope.ServiceProvider;

    try{
        var context = services.GetRequiredService<DataContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        // We are getting the Ilogger service which takes a type where we are logging from. 
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during migration");
    }

    host.Run(); // We must make sure to run our host or the program won't even start
}
```

We can now run the program with this code. We will change our directory to the API folder and not run the command `dotnet watch run`. We will see certain logging statements, but we also want to be able to see the SQL database that we are creating.

here are the logging statements we will get:
```csharp
Executed DbCommand (17ms) [Parameters=[], CommandType='Text', CommandTimeout='30']
      CREATE TABLE "__EFMigrationsHistory" (
          "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
          "ProductVersion" TEXT NOT NULL
      );
```

```csharp
CREATE TABLE "Activities" (
          "Id" TEXT NOT NULL CONSTRAINT "PK_Activities" PRIMARY KEY,
          "Title" TEXT NOT NULL,
          "Date" TEXT NOT NULL,
          "Description" TEXT NOT NULL,
          "Category" TEXT NOT NULL,
          "City" TEXT NOT NULL,
          "Venue" TEXT NOT NULL
      );
```
In order to see the database, we will need a plugin called SQLite by alexcvv. This of course is only if you are using visual studio code. Once we have this plugin, we can then use the command in visual studio code `SQLite: Open Database` by pressing `ctrl + shift + p` if you are using a PC. The SqlLite extensions will allow us to look into our sqlite database if we want to. We can do this by using the command `SqlLite: open database` and then going to our Activities table and right clicking on it to show table. 


## Seeding our database (Creating our data Yay!!)

So in this section we are going to actually start our database off with some data from the beginning. We are once again going to do this is in the main method in the program.cs file that we did before. In the persistence folder we are going to create a new class called Seed.cs. 

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (context.Activities.Any()) return; // if there is data already, jusr return
            
            var activities = new List<Activity>
            {
                new Activity
                {
                    Title = "Past Activity 1",
                    Date = DateTime.Now.AddMonths(-2),
                    Description = "Activity 2 months ago",
                    Category = "drinks",
                    City = "London",
                    Venue = "Pub",
                },
                new Activity
                {
                    Title = "Past Activity 2",
                    Date = DateTime.Now.AddMonths(-1),
                    Description = "Activity 1 month ago",
                    Category = "culture",
                    City = "Paris",
                    Venue = "Louvre",
                },
                new Activity
                {
                    Title = "Future Activity 1",
                    Date = DateTime.Now.AddMonths(1),
                    Description = "Activity 1 month in future",
                    Category = "culture",
                    City = "London",
                    Venue = "Natural History Museum",
                },
                new Activity
                {
                    Title = "Future Activity 2",
                    Date = DateTime.Now.AddMonths(2),
                    Description = "Activity 2 months in future",
                    Category = "music",
                    City = "London",
                    Venue = "O2 Arena",
                },
                new Activity
                {
                    Title = "Future Activity 3",
                    Date = DateTime.Now.AddMonths(3),
                    Description = "Activity 3 months in future",
                    Category = "drinks",
                    City = "London",
                    Venue = "Another pub",
                },
                new Activity
                {
                    Title = "Future Activity 4",
                    Date = DateTime.Now.AddMonths(4),
                    Description = "Activity 4 months in future",
                    Category = "drinks",
                    City = "London",
                    Venue = "Yet another pub",
                },
                new Activity
                {
                    Title = "Future Activity 5",
                    Date = DateTime.Now.AddMonths(5),
                    Description = "Activity 5 months in future",
                    Category = "drinks",
                    City = "London",
                    Venue = "Just another pub",
                },
                new Activity
                {
                    Title = "Future Activity 6",
                    Date = DateTime.Now.AddMonths(6),
                    Description = "Activity 6 months in future",
                    Category = "music",
                    City = "London",
                    Venue = "Roundhouse Camden",
                },
                new Activity
                {
                    Title = "Future Activity 7",
                    Date = DateTime.Now.AddMonths(7),
                    Description = "Activity 2 months ago",
                    Category = "travel",
                    City = "London",
                    Venue = "Somewhere on the Thames",
                },
                new Activity
                {
                    Title = "Future Activity 8",
                    Date = DateTime.Now.AddMonths(8),
                    Description = "Activity 8 months in future",
                    Category = "film",
                    City = "London",
                    Venue = "Cinema",
                }
            };

            // we are going to add these range of activities to the database. Like staging them for git
            await context.Activities.AddRangeAsync(activities);

            // Query to actually save the files to the database. 
            await context.SaveChangesAsync();
        }
    }
}
```

Since the file is going to be quite a lot to type out, I have included it here and it is from the course directly where I am getting this information. The `await context.Activities.AddRangeAsync(activities)` is actually similar to staging the files we want to add to the database. The `context.SaveChangesAsync()` method is where we are actually saving it to the database. We need to change the main method in the program.cs file now to seed are data into the database. Notice that the method is async, thus we should change our Main method to be async. 

```csharp
public static async Task Main(string[] args)
{
    var host = CreateHostBuilder(args).Build(); 

    using var scope = host.Services.CreateScope();

    var services = scope.ServiceProvider;

    try{
        var context = services.GetRequiredService<DataContext>();
        context.Database.MigrateAsync();
        await Seed.SeedData(context);
    }
    catch (Exception ex)
    {
        // We are getting the Ilogger service which takes a type where we are logging from. 
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during migration");
    }

    host.RunAsync(); // We must make sure to run our host or the program won't even start
}
```

We have changed a few things here to have async method. We changed the Migrate function to a MigrateAsync, and then we changed the `host.Run()` to a `host.RunAsync()`. We don't really need to do all this because the main function is only run once. Now it is time to run our code, and we can see that the we have a lot more output in our console when we run it.  This code actually cause our server to terminate unfortunately. We have to make sure that we await all the async calls. We won't get an error when we start up our server, but it will just stop working. You will actually get an important warning message which is: 

```\C#\Reactivities\API\Program.cs(26,17): warning CS4014: Because this call is not awaited, execution of the current method continues before the call is completed. Consider applying the 'await' ```

To solve this problem. Make sure you await all async calls. Here is the updated version. 

```csharp
    public static async Task Main(string[] args)
    {
        var host = CreateHostBuilder(args).Build(); 

        using var scope = host.Services.CreateScope();

        var services = scope.ServiceProvider;

        try{
            var context = services.GetRequiredService<DataContext>();
            await context.Database.MigrateAsync();
            await Seed.SeedData(context);
        }
        catch (Exception ex)
        {
            // We are getting the Ilogger service which takes a type where we are logging from. 
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred during migration");
        }

        await host.RunAsync(); // We must make sure to run our host or the program won't even start
    }
```

## Adding an API controller 

make a new class and derive from controllerBase class 
add [ApiController]
'[Route("[controller]")]'
The route of the api controller will be the route minus controller part
create a new controller called the activiteis contorller :  BaseApiController 
quikfix constructor
We are creating a simple get method and are not worrying about errors right now. 

The first thing we are going to do is add a base controller. So instead on deriving from `ControllerBase` for all of our endpoints we will have a base controller which will eliminate so of our boiler plate code. The original example endpoint that they had is as follows: 

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

Notice in this example that they have the `WeatherForecastController : ControllerBase` part. The new base controller that we will make will look like the following: 

```csharp
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] //api/activities
    public class BaseController: ControllerBase
    {
        
    }
}
```

Remember that the `[controller]` will be replace by the controller part. So, if we kept the WeatherForecastController part, and derived it from the BaseController, the endpoint would look like `api/weatherforecast` without the controller. [Exercise] I wonder if I could name my endpoints something else like `[endpoint]` if it would work the same way. So now, let's create our first endpoint for the test data that we had. Let's start with a brand new file and then derive from our base controller. There are few things we are going to do that will not be in the final product. We are going to directly interface with the `DataContext` file. For example, we are going to create a constructor that takes in as an argument the DataContext field and then create a readonly variable. Visual studio code automatically does this for which is cool. We are using a service to do dependency injection into our new controller class.  

```csharp
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {
        private readonly DataContext _context;
        public ActivitiesController(DataContext context)
        {
            _context = context;

        }
    }
}
```

Now we are ready to add some simple endpoints to our controller. We are going to add two different endpoints and then test them out in PostMan. The first endpoint will just a simple getter request for the list of activities and the second will be a simple getter for a specific activity by ID. We will not worry about catching errors right now, so that is not important. 

```csharp
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {
        private readonly DataContext _context;
        public ActivitiesController(DataContext context)
        {
            _context = context;

        }

        [HttpGet] // api/Activities
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await _context.Activities.ToListAsync();
        }

        [HttpGet("{id}")] //api/Activities/{id}
        public async Task<ActionResult<Activity>> GetActivity()
        {
            return await _context.Activities.FindAsync();
        }
    }
}
```

We have created two new endpoints for this controller. Notice how one takes and id in the endpoint. This is how your write a GET request using this framework. You write it with the attributes above and you can add certain things to them to change the endpoints. This is really exciting to create and transfer data in this way. I don't know about you, but transferring different data through endpoints to something is really cool. You also want to restart your server in order to for the endpoints to work. Sometimes, when make calls to the API, they won't work unless you restart your server. When using postamn, you can actually create variables for your requests to use. So a request might look like ```{{url}}/api/activities/d89a8275-2dcb-441e-91fa-3544a572495f```. The ```{{url}}``` is a variable you can set in postman. Just go to the edit collection part to set variables and make sure to save. Or you can just type in this url and right click to set it that way. The endpoints that we will be hitting are as follows: 

`{{url}}/api/activities/`

and 

`{{url}}/api/activities/{id}`

Notice how they both use Activities. The Activities part comes from the controller. I was having trouble getting the id one to work. I would get the activities and then take the id from one of them to use in the other endpoint and for some reasons it wasn't working for awhile, but finally one of the ids worked. 

## Saving changes into source control

Now we are going to setup source control for our project. If you don't already have a github account, go ahead and create one because we will use github for source control. Source control will allow you to go back to older versions of your code if your app stops working. The first command we will use is `git status` to see if we already have a git initialized. I don't expect you to have it already, but it is always, people do forget things. The next thing to do is to initialize git in your project. Make sure you are in the Reactivities folder and not in the API folder. The command is `git init`. There are many files in our project that we don't want to save because they are auto-generated, so it would just take up space. In order to ignore these files, we need a gitignore file with all the files not to save to source control. Luckily the dotnet framework has such a file already created for us. So after initializing the go ahead and run `dotnet new gitignore`. You can see what projects and other things you can created with the dotnet command by typing in `dotnet new -l` which will list all the projects. 

Finally, we want to add just one line to this gitignore file in order to not save our appsettings.json file. We are doing this because later in the project we will have special strings that are important that we never share. Unless you make a private github repo for this project, you never want to share important information in your code.

```.gitignore
## Ignore Visual Studio temporary files, build results, and
## files generated by popular Visual Studio add-ons.
##
## Get latest from https://github.com/github/gitignore/blob/master/VisualStudio.gitignore

appsettings.json

# User-specific files
*.rsuser
*.suo
*.user
```

So now go ahead and make a new repository in your github account (or whatever you are using for source control). I went ahead and made the repository [here](https://github.com/NathanSwindall/dotnet-tutorial). Then your will run the following commands: 

`git branch -M main` 
-to create a main branch<br/>

`git remote add origin https://github.com/NathanSwindall/dotnet-tutorial.git`<br/>
-to add it as a repo to your git Project

 `git push -u origin main` 
 -to push it to your account<br />

 For some reasons I was getting some weird error for the last command. I realized that I forgot to stage everything. You have to make sure you stage everything and then push it up as the initial commit. So do the following commands and then the last one. 

 `git add .`<br /> 
 This command will track all untracked changes.<br />

 `git commit -m "initial commit"`<br />
 This command will stage all the tracked files <br />

 `git push -u origin main` 
 Finally, this will push it to the repository<br />


## Final thoughts

This was just a quick run down for making a quick API with dotnet. I think future projects would be implementing the same project in F#. I really am curious how the architecture and design, and maybe the verbosity of the project would change with a functional first language. We could have done everything in one project, but in the projects that I use in my current company, a lot of the functionality are given their own projects, so I think its best practice to get used to splitting out the different areas into projects, and it also makes our code more modular. We can choose what projects depend on other projects which is a way of hopefully keeping away bugs, and in a way makes the project more readable. I want to add a section for this tutorial maybe in the future that is about the different aspects of using attributes. I feel like the best way to really digest the material in any chapter is to start creating your own stuff. Some useful exercises to do in order to make sure that you understand most of this skeleton API are as follows: 

<strong>(1)</strong> Model some data from the real world that you would want to see in a database and create a model for it in the Domain project. <br />
<strong>(2)</strong> Add a migration for this data into your database, and then check to see it in your SQLite database. <br />
<strong>(3)</strong> Make some seed data for your model like the one for Activities. <br />
<strong>(4)</strong> Make a controller for this new type of data, and then test it out in postman. <br />
<strong>(5)</strong> Spend some time looking at the code and messing around with it. Try going to the docs and adding features to your project. 

I went ahead and gave and example of going through these problems. Firstly, I came up with something I wanted to model which was a country. There are many different traits that could represent a country, or information that we would like to know about a such as the government type or main language spoken. 


```csharp
namespace Domain
{
    public class Country
    {
        public Guid Id { get; set; }
        public string CountryName { get; set; }
        public int Population { get; set; }
        public int GDP { get; set; }
        public string Language { get; set; }
        public string GovermentType { get; set; }
        public string Leader { get; set; }
    }
}
```

I came up with quite a few. Now it is time to make a migration in order to add this as a table to our database. I order to make a migration we need to add this model to our DataContext file which is in our Persistence project. 

```csharp 
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options) {}
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Country> Countries {get; set; }
    }
}
```

We could run the migration manually using the commands we had earlier. From the Reactivities folder, you can now run `dotnet ef migrations add AddCountries-p Persistence -s API`.Notice that I renamed the migration to something specific to the type of migration we are making, and also make sure that you do not have your server running or you will get an error. If you go to the split view of your SQLite table you will see that countries is added as an entry. The ony problem is that we don't have any data for our countries, and thus we need to add data. 

```csharp 
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    public partial class AddCountry : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    CountryName = table.Column<string>(type: "TEXT", nullable: false),
                    Population = table.Column<int>(type: "INTEGER", nullable: false),
                    GDP = table.Column<int>(type: "INTEGER", nullable: false),
                    Language = table.Column<string>(type: "TEXT", nullable: false),
                    GovermentType = table.Column<string>(type: "TEXT", nullable: false),
                    Leader = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Countries");
        }
    }
}
```

I realized that I have made a mistake when creating the model. I accidentally created a property with the name `GovermentType` instead of `GovernmentType`. Thus, I actually need to remove one of the migrations and recreate that migration with the correct property name. See, this is why we do exercises. We are not just blindly following a tutorial but actually putting to practice the elements we learned and then adding onto them by facing problems that are outside the scope of the tutorial. In order to remove the last migration you can do the following command `dotnet ef migrations remove --force -p Persistence -s API`. This gets really tricky when you have already applied the migration to your database, but since I am using SQLite, I don't think it should be a problem necessarily. I had to use the `--force` keyword because I ran into some errors without just using the remove part. I am curious if cd into the Persistence folder and then just use the -s flag for the project if that will be easier. I think too, if this happened in production, I would have to drop the table form the database, because migrations just seem to be a way for C# to make tables in SQL with C# native code. After removing the last migration, I created a new migration. 

You can create a new Seed file if you want and then just call both seed files for seeding your database, but I have decided to just make one seed file and created a list of data in the original `Seed.cs` file. Here are the following changes. 

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (context.Activities.Any() && context.Countries.Any()) return;
            
            var activities = new List<Activity>
            {
                new Activity
                {
                    Title = "Past Activity 1",
                    Date = DateTime.Now.AddMonths(-2),
                    Description = "Activity 2 months ago",
                    Category = "drinks",
                    City = "London",
                    Venue = "Pub",
                },
                new Activity
                {
                    Title = "Past Activity 2",
                    Date = DateTime.Now.AddMonths(-1),
                    Description = "Activity 1 month ago",
                    Category = "culture",
                    City = "Paris",
                    Venue = "Louvre",
                },
                new Activity
                {
                    Title = "Future Activity 1",
                    Date = DateTime.Now.AddMonths(1),
                    Description = "Activity 1 month in future",
                    Category = "culture",
                    City = "London",
                    Venue = "Natural History Museum",
                },
                new Activity
                {
                    Title = "Future Activity 2",
                    Date = DateTime.Now.AddMonths(2),
                    Description = "Activity 2 months in future",
                    Category = "music",
                    City = "London",
                    Venue = "O2 Arena",
                },
                new Activity
                {
                    Title = "Future Activity 3",
                    Date = DateTime.Now.AddMonths(3),
                    Description = "Activity 3 months in future",
                    Category = "drinks",
                    City = "London",
                    Venue = "Another pub",
                },
                new Activity
                {
                    Title = "Future Activity 4",
                    Date = DateTime.Now.AddMonths(4),
                    Description = "Activity 4 months in future",
                    Category = "drinks",
                    City = "London",
                    Venue = "Yet another pub",
                },
                new Activity
                {
                    Title = "Future Activity 5",
                    Date = DateTime.Now.AddMonths(5),
                    Description = "Activity 5 months in future",
                    Category = "drinks",
                    City = "London",
                    Venue = "Just another pub",
                },
                new Activity
                {
                    Title = "Future Activity 6",
                    Date = DateTime.Now.AddMonths(6),
                    Description = "Activity 6 months in future",
                    Category = "music",
                    City = "London",
                    Venue = "Roundhouse Camden",
                },
                new Activity
                {
                    Title = "Future Activity 7",
                    Date = DateTime.Now.AddMonths(7),
                    Description = "Activity 2 months ago",
                    Category = "travel",
                    City = "London",
                    Venue = "Somewhere on the Thames",
                },
                new Activity
                {
                    Title = "Future Activity 8",
                    Date = DateTime.Now.AddMonths(8),
                    Description = "Activity 8 months in future",
                    Category = "film",
                    City = "London",
                    Venue = "Cinema",
                }
            };

             var countries = new List<Country>
            {
                new Country
                {
                    CountryName = "France",
                    Population = 67413000,
                    GDP = 3322,
                    Language = "French",
                    GovernmentType = "Unitary semi-presidential republic",
                    Leader = "Emmanuel Macron"
                },
                new Country
                {
                    CountryName = "Ethiopia",
                    Population = 117876227,
                    GDP = 401,
                    Language = "Amharic",
                    GovernmentType = "Ethnofederalist parliamentary republic",
                    Leader = "Sahle-Work"
                },
                new Country 
                {
                    CountryName = "Afghanistan",
                    Population = 40218234,
                    GDP = 72,
                    Language = "Dari",
                    GovernmentType = "Unitary provisional theocratic islamic emirate",
                    Leader = "Hibatullah Akhundzada"
                }
            };

             // we are going to add these range of countries  to the database. Like staging them for git
            await context.Countries.AddRangeAsync(countries);
            
            // we are going to add these range of activities to the database. Like staging them for git
            await context.Activities.AddRangeAsync(activities);

            // query to actually save the changes. 
            await context.SaveChangesAsync();
        }
    }
}
```
Make sure to change the if statement that starts off the object, because the data will never be seeded into the Countries table if you don't do that. Now you can restart your server and you should have data in your SQLite table. 

Our final task is to create an API endpoint for the countries table. We will need to create a new Country controller that will have a get request for getting all the countries in a list and then a get request for get a specific country by id. For an extra challenge, create an endpoint that takes in a country with the a certain language, such as french, and only pull back the countries that have this specific language spoken there. The controller I came up with is as follows. 

```csharp
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class CountriesController : BaseController
    {
        private readonly DataContext _context;

        public CountriesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet] // api/Countries
        public async Task<ActionResult<List<Country>>> GetCountries()
        {
            return await _context.Countries.ToListAsync();
        }

        [HttpGet("{id}")] //api/Activities/{id}
        public async Task<ActionResult<Country>> GetCountry(Guid id)
        {
            return await _context.Countries.FindAsync(id);
        }

        [HttpGet("speak/{language}")] //api/Countries/speak/{language}
        public async Task<ActionResult<List<Country>>> GetCountriesThatSpeak(string language)
        {
            return await _context.Countries.Where((Country country) => country.Language.ToLower() == language.ToLower()).ToListAsync();
        }
    }
}
```

There are a few things to notice here. The first two endpoints are exactly like the ones we created for the activites endpoint except that we are using the words Country and Countries. We could try making the last endpont to have the word language in it as follows: 

```csharp
[HttpGet("{language}")] //api/Countries/{language}
public async Task<ActionResult<List<Country>>> GetCountriesThatSpeak(string language)
{
    Console.WriteLine(language);
    return await _context.Countries.Where((Country country) => country.Language.ToLower() == language.ToLower()).ToListAsync();
}
}
```
The problem is that this endpoint will clash with the id endpoint. The dotnet framework will treat "{id}" the same as "{language}". Thus, in order to get around this, we will have to actually extend the endpint route by another word or something to change it. For my solution, I changed the endpoint from "api/Countries/{language}" to "api/Countries/speak/{language}". In the `HttpGet` you can actually change the endpoint to really but whatever you like. Also, notice that instead of a `FindAsync` function that I use the `Where` clause. This is sort of like using the where in SQL, so if you are familiar with SQL, then using these functions shouldn't be too bad. Thus, this concludes are first introduction into the world of dotnet. 






