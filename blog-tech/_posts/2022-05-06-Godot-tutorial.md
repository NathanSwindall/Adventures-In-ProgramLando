---
layout: post
category: tech
title: Godot
image: /Notes/assets/images/Godot1.png
summary: Create your own games in a simple game editor
date: 2022-05-06
author: Nathan Swindall
---

<link rel="stylesheet" href="/blog-tech/assets/markdown.css">
## <strong>Godot Game engine</strong>

The godot game engine is an open source game engine that uses a special python inspired script to make it easy for people new to programming to create their own games. The game engine is also compatible with C# out of the box, and with a little bit of work, you can also use other scripting languages as well. The docs are located [here](https://docs.godotengine.org/en/stable/index.html). I decided to try out the 2D [tutorial](https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html), which was fairly easy to follow. Though, sometimes the C# implementation isn't explained fully in the docs to the desired amount, but they do a good job. I do feel that at times the tutorial does have the problem which a lot of tutorials have which is that they just dump a lot of code onto you. Even my tutorials have this problem. Since I am really into functional programming, I wanted to see what it was like to code a game in a functional language, and since F# and C# have such great interoperability, it seemed only natural to use this language. Fortunately, there is a great blog article [here](http://www.lkokemohr.de/fsharp_godot.html) that helps you set up the project. Though, I will admit that I have run into quite a few pitfalls when it came to the initial setup for the F# sharp scripts. It requires something that seems a little hacky at first, but once you get settled in, it's not too bad. 


## <strong>The initial setup</strong>

I won't go over all the details here for the initial, but if you follow the Godot tutorial up to the first creation of a C# script for the 2D tutorial, you will be able to follow along. In the Godot 2d tutorial it should look like this: 

<p></p>
{%- assign initSetup = "blog-tech/assets/images/godotFs/initialSetup.png" | relative_url-%}
<img src ="{{initSetup}}">
<p></p>

The initial Folder setup will be as follows. Notice that I have made a scenes folder where my `Player.tscn` was saved in a folder called scenes and that the `Player.cs` was saved in a folder called Scripts. You could have everything in the same folder, but I find it easier to split them up this way.

<p></p>
{%- assign FolderSetup = "blog-tech/assets/images/godotFs/FolderSetup.png" | relative_url-%}
<img src ="{{FolderSetup}}">
<p></p>

You will want to make your C# script also empty

```csharp 
using Godot;
using System;

public class Player 
{}
```

Now that we have the setup all out of the way for our initial, we are going to want to setup our F# project. In order to set it up you will want to make a folder to hold the .fsproj file. This serves two purposes. One is to make the organization of our project better, and also, it seems that this method will not work unless the .fsproj and .csproj are in different folders. I originally had them in the same folder because I thought that would be the best way to organize them, but unfortunately I could not get it to work. 

So the first command we will run from the `CreepsFs` folder will be: 

`dotnet new classLib -lang "F#" -o GodotFs` 

This command will make and Fsharp project in your godot game, and now our folder setup looks like this. 


<p></p>
{%- assign AddedFsproj = "blog-tech/assets/images/godotFs/AddedFsproj.png" | relative_url-%}
<img src ="{{AddedFsproj}}">
<p></p>

There are a few things to notice in the files your have created. For example, in the Fsproj file that I have created, the framework that is being target is `net6.0`.


```cs
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
  </PropertyGroup>

  <ItemGroup>
    <Compile Include="Library.fs" />
  </ItemGroup>

</Project>

```
For the csproj file, the target framework `net472`.

```cs
<Project Sdk="Godot.NET.Sdk/3.3.0">
  <PropertyGroup>
    <TargetFramework>net472</TargetFramework>
  </PropertyGroup>
</Project>
```


Thus, in order to make them compatible, I ended up changing them to match each other, specifically the fsproj framework to match the csproj file.  Now we need to add this project to the sln and the csproj file. The following commands will do that for us. Now we are going to want to make sure that we add our fsproj to the solution file that Godot has auto-generated for us. Thus, run this command: 

`dotnet sln add GodotFs`

Then, we are going to add our fsproj file as a reference to our our csproj file. 

`dotnet add reference GodotFs`

Now that we are done with this setup work, we will make a new folder for our FSharp scripts to go in called ScriptsFs. Make sure you are creating this in the directory of your CreepsFs file. Let's create a Player script file in FSharp. Don't worry too much about the contents of it. The most important right now is getting all the connections for everything. 

```cs
namespace PlayerFSharp

open Godot

type PlayerFs() = 
    inherit Area2D() 

    [<Export>]
    let speed = 400 

    override this._Ready() = 
        GD.Print("Hello from F#!")
```

You also need to add your fSharp scripts to your fsproj file. Just add the following line to it. 

```cs
 <ItemGroup>
    <Compile Include="Library.fs" />
    <Compile Include="../ScriptsFs/PlayerFSharp.fs"/>
  </ItemGroup>
```

If we were to go build our fsproj by using the command `dotnet build` in the GodotFs folder, we would get quite a few different errors. These errors are caused by not referencing the Godot assemblies in our fsproj. Thus, add the following code to your fsproj file. 

```csharp
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net472</TargetFramework>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
  </PropertyGroup>

  <ItemGroup>
    <Compile Include="Library.fs" />
    <Compile Include="../ScriptsFs/PlayerFs.fs"/>
  </ItemGroup>

   <ItemGroup>
    <Reference Include="GodotSharp">
      <HintPath>..\.mono\assemblies\Release\GodotSharp.dll</HintPath>
    </Reference>
  </ItemGroup>

</Project>
```

<p style="border: 5px solid #0d2f5c!important; border-radius: 16px; padding: 5px; background-color: lightblue !important; font-family: 'Lucida Console', 'Courier New', monospace;">
I have been using visual studio code, and I have been running into a lot of problems with it detecting the changes in my project files. They will be automatically marked with errors if you do not rebuild them after making the above changes, so make sure to rebuild both your project files for the FSharp and CSharp files. Then, it also might help to close your Visual Studio Code, and reopen it just in case because this actually fixed the highlighting problem for me. My folder tree looks something like the following. <a href="https://nathanswindall.com/">here</a>
</p>




<p></p>
{%- assign FSharpFullSetup = "blog-tech/assets/images/godotFs/FSharpFullSetup.png" | relative_url-%}
<img src ="{{FSharpFullSetup}}">
<p></p>




