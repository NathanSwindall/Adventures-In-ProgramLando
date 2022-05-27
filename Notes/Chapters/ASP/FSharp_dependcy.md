---
layout: post
category: notes
image: /Notes/assets/images/FSharp.png
summary: FSharp Dependency Injection
date: 2022-05-23
author: Nathan Swindall
---

<link rel="stylesheet" href="/blog-tech/assets/markdown.css">

## <strong>Frustration with Null</strong>

<div class="tblurb">
Lately, I have been doing more backend work in my current job which relies heavily on certain design patterns used in C#. Overall, they work well and the architecture we have chose to design our backend works great for code refactorization and adding new features, but there is always something that bothers me with how we constantly have to do a large amount of null checks when ever something passes through a controller down to the service layer and through other layers. I noticed this same problem when using typescript. Even when I know that a certain state will never exist, the typescript compiler always marks something as an error because technically this error is "possible". I know overall, these are just minor gripes compared to the amount of bugs typescript and C# catch before run time thanks to their statically typed nature. This is why I though it would be cool to mix both F# and C#. I could use F# for the business logic make certain states just impossible thanks to the amazing sum types. <br/><br/>

I am currently using the Mediator pattern in a simple app that I am constructing, and thought that it would be cool to implement this pattern in F#. I've heard that for the most part that anything you can do in C#, you can do in F#... though I have to admit they do make you go through some extra hoops if you what to switch from the functional first style to the more ubiquitous style of OOP. I did learn some very useful things as I went a long, but of course there were many frustrations. Below is the code that I wanted to replicate in F#. 
</div><br/><br/>


### Here is the class object that is sent from the Mediator
```cs
namespace Application.Countries
{
    public class List
    {
        public class Query : IRequest<List<Country>>{}

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

### Here is the api endpoint that has the mediator.send function. 

```cs
[HttpGet] // api/Countries
public async Task<ActionResult<List<Country>>> GetCountries()
{
    return await Mediator.Send(new List.Query());
}
```

<div class="tblurb">
This doesn't seem like it would be to terribly difficult. I was thinking that the magic that works with dependency injection where you can just put something in the constructor and <em>Boom!! ... Wham a JAM</em> everything just kind of works. When I first discovered dependency injection, I was so amazed at it beauty and ease at adding important parameters and how lovely it is to test, but my love and interest for functional programming is a little bit stronger. <br/><br/>

I started off by making a fsproj in my application level on my Reactivities app that has a tutorial on this website. The application level has a folder called Countries for storing the different classes to be used with the mediator pattern. I decided to try to implement something similar with F#. I created a folder with to stash the FSharp proj folder based of the command //dotnet new classlib -lang "F#", and then created a //FCounries folder that is prefixed with F because this will be the FSharp version. <br/><br/>\

{%- assign FSharpMediator= "Notes/assets/images/Dotnet/FSharpMediator.png" | relative_url-%}
<img src="{{FSharpMediator}}"><br/><br/>

There are some other classes in there too, but I am focusing really only on the //List.fs class. To recreate the pattern I though to myself, well there two classes within another class, and these inner classes inherit from some interfaces found in the Mediator package. Spoilers, I found out later that you can not nest types (which are the F# equivalent) in F# like you can with classes in C#. 
</div>
