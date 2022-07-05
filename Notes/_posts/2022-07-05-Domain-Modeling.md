---
layout: post
category: notes
title: Domain Modeling Made Functional
image: /Notes/assets/images/DDD.jpg
summary: Tackle Software Complexity with Domain-Driven Design and F# 
date: 2022-07-05
author: Nathan Swindall
---

<link rel="stylesheet" href="/blog-tech/assets/markdown.css">





<div class="gradient">
<h2 class="section__title" id="deleting-an-activity"><strong>Deleting an Activity</strong></h2>
<div class="tblurb">


<h3>Creating a F# Project </h3>
<p>The first thing we are going to do is create a simple F# project so that we can easily add many different packages if the need ever arises</p>
<ul>
<li>Create a new folder that will hold all the your project. I have names my DDD for domain driven design</li>
<li>Then we are going to create a solution file for our new project to house all the necessary libraries and started code. I haven't decided whether or not I should create a console project, but I went ahead and set it up for a nice simple console project solution. So run 

<p><code class="code-style2">dotnet new sln -o Domain Design</code></p>

</li>

<li>Next we are going to create a app folder for our main app, and then a library folder for our library. Things might change in the future, but I'm trying to get something down. So run 

<p><code class="code-style2">dotnet new classlib -lang "F#" -o src/Library</code></p> and 

<p><code class="code-style2">dotnet new console -lang "F#" -o src/App</code></p></li>

<li>Now we have all the folders, but they aren't connected. Let's first add both the app and library projects to the solution file, thus run 

<p><code class="code-style2">dotnet sln add src/Library</code></P> 
and 

<p><code class="code-style2">dotnet sln add src/App</code></p>
</li>

<li>
Now that we have added everything, we need to go an actually edit the proj file for the App proj, in order to use what we need to use. It's also worth noting that we can add a reference to the Library proj into the app project so that we don't have to keep adding different scripts to out project. In order to add a reference you can do the following code from in the app folder. Make sure to build all the projects so that you get intelisyntax. 

<p><code class="code-style2">dotnet add reference ../Library</code></p>

<div markdown=1>
```cs
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net6.0</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <Compile Include="../Library/Library.fs" />
    <Compile Include="Program.fs" />
  </ItemGroup>

</Project>
```

</div>
</li>

<li>
Now, if we want to test it out, all we have to do is create a function in the library module like so
<div markdown=1>

```cs
namespace Library

module Say =
    let hello name =
        printfn "Hello %s" name
```
</div>
</li>

<li>Then we can pull it in and use in the program.fs file. 
<div markdown=1>

```cs
open Library.Say


hello "Nathan Swindall"
```
</div>
</li>

</ul>


<h3>Instructions</h3>
<ul>
<li>Create a new folder in the activities folder call details. This is where we will put a new component called ActivityDetails.tsx</li>
<li >Create a new template for it

<div markdown=1>
```py 
import re
myVar = 10 
```
</div>
</li>
</ul>


</div>
</div><br/>













<div class="gradient">
<h2 class="section__title" id="deleting-an-activity"><strong>Tempalte</strong></h2>
<div class="tblurb">

<div markdown=1>

## ipsum

"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

- ipsum
- ipsum 2


```cs
namespace Library

module Say =
    let hello name =
        printfn "Hello %s" name

```



</div>

<p>This is a code example</p>
<code class="code-style2">This is a code example</code>

</div><br/>

