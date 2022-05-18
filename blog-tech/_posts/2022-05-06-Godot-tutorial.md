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

- [Initial Setup](#the-initial-setup)
- [Handling Signals](#handling-signals)

## <strong>Godot Game engine</strong>

<p class="textBlurb">
The godot game engine is an open source game engine that uses a special python inspired script to make it easy for people new to programming to create their own games. The game engine is also compatible with C# out of the box, and with a little bit of work, you can also use other scripting languages as well. The docs are located <a href="https://docs.godotengine.org/en/stable/index.html">here</a>. I decided to try out the 2D <a href="https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html">tutorial</a>, which was fairly easy to follow. Though, sometimes the C# implementation isn't explained fully in the docs to the desired amount, but they do a good job. I do feel that at times the tutorial does have the problem which a lot of tutorials have which is that they just dump a lot of code onto you. Even my tutorials have this problem. Since I am really into functional programming, I wanted to see what it was like to code a game in a functional language, and since F# and C# have such great interoperability, it seemed only natural to use this language. Fortunately, there is a great blog article  <a href="http://www.lkokemohr.de/fsharp_godot.html">here</a> that helps you set up the project. Though, I will admit that I have run into quite a few pitfalls when it came to the initial setup for the F# sharp scripts. It requires something that seems a little hacky at first, but once you get settled in, it's not too bad. 
</p>


## <strong>The initial setup</strong>

<p class="textBlurb">
I won't go over all the details here for the initial, but if you follow the Godot tutorial up to the first creation of a C# script for the 2D tutorial, you will be able to follow along. In the Godot 2d tutorial it should look like this: <br/><br/>

{%- assign initSetup = "blog-tech/assets/images/godotFs/initialSetup.png" | relative_url-%}
<img src ="{{initSetup}}">

</p>

 {%- assign FolderSetup = "blog-tech/assets/images/godotFs/FolderSetup.png" | relative_url-%}
<p class="textBlurb">
The initial Folder setup will be as follows. Notice that I have made a scenes folder where my `Player.tscn` was saved in a folder called scenes and that the `Player.cs` was saved in a folder called Scripts. You could have everything in the same folder, but I find it easier to split them up this way.<br/>

<img src ="{{FolderSetup}}">
<br/><br/>

You will want to make your C# script also empty<br/>
</p>



```csharp 
using Godot;
using System;

public class Player 
{}
```
<p class="textBlurb">
Now that we have the setup all out of the way for our initial, we are going to want to setup our F# project. In order to set it up you will want to make a folder to hold the .fsproj file. This serves two purposes. One is to make the organization of our project better, and also, it seems that this method will not work unless the .fsproj and .csproj are in different folders. I originally had them in the same folder because I thought that would be the best way to organize them, but unfortunately I could not get it to work.<br/> 
<br/>
So the first command we will run from the `CreepsFs` folder will be: <br/>
<br/>
<code class="code-style">dotnet new classLib -lang "F#" -o GodotFs`</code><br/><br/>

This command will make and Fsharp project in your godot game, and now our folder setup looks like this.<br/><br/>
{%- assign AddedFsproj = "blog-tech/assets/images/godotFs/AddedFsproj.png" | relative_url-%}
<img src ="{{AddedFsproj}}"> <br/><br/>
There are a few things to notice in the files your have created. For example, in the Fsproj file that I have created, the framework that is being target is <code class="code-style">net6.0`</code>.
</p>




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
<p class="textBlurb">
For the csproj file, the target framework <code class='code-style'>net472`</code>.
</p>

```cs
<Project Sdk="Godot.NET.Sdk/3.3.0">
  <PropertyGroup>
    <TargetFramework>net472</TargetFramework>
  </PropertyGroup>
</Project>
```

<p class="textBlurb">
Thus, in order to make them compatible, I ended up changing them to match each other, specifically the fsproj framework to match the csproj file.  Now we need to add this project to the sln and the csproj file. The following commands will do that for us. Now we are going to want to make sure that we add our fsproj to the solution file that Godot has auto-generated for us. Thus, run this command: <br/><br/>

<code class="code-style">dotnet sln add GodotFs</code><br/><br/>

<code class="code-style">
Then, we are going to add our fsproj file as a reference to our our csproj file. 
</code> <br/><br/>

<code class="code-style">
dotnet add reference GodotFs
</code> <br/><br/>

Now that we are done with this setup work, we will make a new folder for our FSharp scripts to go in called ScriptsFs. Make sure you are creating this in the directory of your CreepsFs file. Let's create a Player script file in FSharp. Don't worry too much about the contents of it. The most important right now is getting all the connections for everything. 
</p>

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
<p class="textBlurb">
You also need to add your fSharp scripts to your fsproj file. Just add the following line to it. 
</p>

```cs
 <ItemGroup>
    <Compile Include="Library.fs" />
    <Compile Include="../ScriptsFs/PlayerFSharp.fs"/>
  </ItemGroup>
```

<p class="textBlurb">
If we were to go build our fsproj by using the command `dotnet build` in the GodotFs folder, we would get quite a few different errors. These errors are caused by not referencing the Godot assemblies in our fsproj. Thus, add the following code to your fsproj file. 
</p>

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

<p class="textBlurb">
I have been using visual studio code, and I have been running into a lot of problems with it detecting the changes in my project files. They will be automatically marked with errors if you do not rebuild them after making the above changes, so make sure to rebuild both your project files for the FSharp and CSharp files. Then, it also might help to close your Visual Studio Code, and reopen it just in case because this actually fixed the highlighting problem for me. My folder tree looks something like the following. <br/><br/>
{%- assign FSharpFullSetup = "blog-tech/assets/images/godotFs/FSharpFullSetup.png" | relative_url-%}
<img src ="{{FSharpFullSetup}}">
</p>

<div class="textBlurb">
Another interesting thing you can also do for development is adding interactive script file that will use F# interactive. I decided to add this file in order to test out new functions. I was having trouble developing certain functions for translating movement, and starting messing around with these functions in interactive mode and suddenly I was able to get the desired outcome. It's really simple to add an interactive file. Just add an FSharp file with the extension .fsx somewhere in your code base, and now you can use this file to rapidly develop functions for your code. The only problem I have run into is that I want to load certain functions and properties from the Godot Library into the script. Firstly, I need to show you the folder structure I have for the file: <br/><br/>

{%- assign InteractiveFSharp = "blog-tech/assets/images/godotFs/InteractiveFSharp.png" | relative_url-%}
<img src ="{{InteractiveFSharp}}"><br/><br/>

I am currently working with a windows machine, so this may or may not work on another operating system. Now, in order to use the Godot Library in the interactive script, you will need to load in the assembly for Godot. Your assembly for Godot should be located somewhere in your mono folder that was automatically created when you created the game with the Godot GUI. I will go ahead and show you the first bit of the code I developed using the script. 
</div>

```cs
#r "..\\.mono\\assemblies\\Release\\GodotSharp.dll"

open Godot

let square x = x * x

let position = new Vector2(2.0f,2.0f)
let position2 = new Vector2(5.0f, 5.0f)

let vecComp (minVec: Vector2) (maxVec: Vector2) (posVec: Vector2) = 
    let isLessMaxXORGreaterMinX = posVec.x >= minVec.x && posVec.x <= maxVec.x
    let isLessMaxYOrGreaterMinY = posVec.y >= minVec.y && posVec.y <= maxVec.y 
    isLessMaxXORGreaterMinX && isLessMaxYOrGreaterMinY

```

<div class="textBlurb">
You Can see from the above how I loaded in the assembly for Godot, and now I can use Godot functions in my interactive mode. The only problem is that some stuff such as sprites does not load on my machine. I am not sure if it is because my machine has certain safety features on it that make it hard for processes to use administration privileges or not. I want to test it out on another one of my computers and maybe if I become not so lazy (even though I type out this whole blog), I will test it out. You can still use some functions easily in interactive mode such as <code class="code-style">GD.Print("From Godot Library")</code>. 
</div>

## <strong>Changing C# to F# Code</strong>

<div class="textBlurb">
Godot has a easy to follow tutorial for making both a Godot game in C# and GDScript. I decided to go through this tutorial for C# awhile ago because I wanted to make video games in a faster language, and if my understanding is correct, then C# should run faster. Unlike GDScript, C# is in a way a compiled language, but in the same vein as a language such a Java is compiled. Not as fast as C, or C++, but still better performance than other languages such as Python which GDScript seems to be based off of. When you finish the tutorial for the 2D game, which can be found <a href="https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html"></a> you should have a script with some of these features (Though to be honest, I didn't finish the whole tutorial so my script is a little smaller). I thought it would be a good exercise to go through this script first and change everything in it from C# to F#. 
</div>

```csharp
using Godot;
using System;

public class Player : Area2D
{
	[Export]
	public int Speed = 400; // How fast the player will move (pixels/sec)

	[Signal]
	public delegate void Hit();
		
	public Vector2 ScreenSize; // size of the game window

	// Called when the node enters the scene tree for the first time.
	public override void _Ready()
	{
		ScreenSize = GetViewportRect().Size;
		Hide();
	}
	
	public override void _Process(float delta)
	{
		var velocity = Vector2.Zero; 
		
		if (Input.IsActionPressed("move_right"))
		{
			velocity.x +=1;
		}
		
		if (Input.IsActionPressed("move_left"))
		{
			velocity.x -= 1;
		}

		if (Input.IsActionPressed("move_down"))
		{
			velocity.y = 1;
		}

		if (Input.IsActionPressed("move_up"))
		{
			velocity.y -= 1;
		}

		var animatedSprite = GetNode<AnimatedSprite>("AnimatedSprite");

		if (velocity.Length() > 0)
		{
			 velocity = velocity.Normalized() * Speed; 
			 Console.WriteLine(velocity.x);
			 Console.WriteLine(velocity.y);
			 animatedSprite.Play();
		}

		else 
		{
			animatedSprite.Stop();
		}

		// delta is the amount of time between frames. This will make it so with different framerates the time is consistent. 
		Position += velocity * delta; // property already on Class
		Position = new Vector2( 
			x: Mathf.Clamp(Position.x, 0, ScreenSize.x),
			y: Mathf.Clamp(Position.y, 0, ScreenSize.y)
		);

		if (velocity.x !=0)
		{
			animatedSprite.Animation = "walk";
			animatedSprite.FlipV= false; 

			// See the note below about boolean assignment 
			animatedSprite.FlipH = velocity.x < 0;
		}

		else if (velocity.y !=0)
		{
			animatedSprite.Animation = "up";
			animatedSprite.FlipV = velocity.y > 0;
		}
	}

	// This is a signal function. We are using the Hit() function we made earlier to be this function
	private void _on_Player_body_entered(object body)
	{
		Hide(); // player disappears after being hit. 
		EmitSignal(nameof(Hit));

		// Must be defrred as we can't change physics properties on a physics call back 
		GetNode<CollisionShape2D>("CollisionShape2D").SetDeferred("diabled", true);
	}

	public void Start(Vector2 pos)
	{
		Position = pos; 
		Show();
		GetNode<CollisionShape2D>("CollisionShape2D").Disabled = false;
	}

}

```
<div class="textBlurb">
There are quite a few different areas in this C# class to look at, but obviously the first is just the class itself. You can pretty much write the exact same code in both F# and C#, but just using the syntax features of these languages. For example, C# variables by default are mutable, and in F# sharp they are immutable. In other words, you can reassign values to C# variables, but if you were to do the same things in F# it wouldn't work. You might think it's working, but trust me, and I hope I am already saving you a bunch of headaches I had to deal with, but it will not work... unless you use the keyword <code class="code-style">mutable</code> in the code. So, to write mutable C# code in F#, you just need to sprinkle on a little extra keywords and you have yourself some nice and simple mutable code. 
</div>


## <strong>Handling Signals<strong>


## <strong>Heist Meisters Design</strong>
<div class="textBlurb">


Essential Experience 
<ul>
<li>Expert thief who sneaks </li>
<li>Dark and dangerous - lost of tension </li>
<li>Get out undetected </li>
</ul><br/><br/>

Gameplay Factors 
<ul>
<li>Top Down </li>
<li>Can be seen briefly - detection rises fast and falls slowly </li>
<li>Dark - can switch from normla vision to night vision (with penalties) </li>
<li>Can't hurt guards. You're a thief, not an assassin. ( You could make it where you hurt the guards, but for now not FUTURE IDEAS!!!) </li>
</ul>
</div>


### <strong>Assets</strong>

- [50 sound effects for RPG/fantasy/adventure games](https://opengameart.org/content/50-rpg-sound-effects)
- [Stealth Music](https://opengameart.org/content/stealth-music)
- [Ui Pack Space Extension](https://opengameart.org/content/ui-pack-space-extension)
- [topdown-shooter](https://opengameart.org/content/topdown-shooter)

### <strong>CharacterTemplate</strong>

Add KinematicBody2D [doc](https://docs.godotengine.org/en/stable/classes/class_kinematicbody2d.html)
Add a sprite picture from the menu
Add a CollisionShape2D 
Add script

```python 
const SPEED = 10 
const MAX_SPEED = 100 
const FRICTION = 0.1 
```

Now we can inherit from this base class when making other characters

### <strong>The Player Character</strong>

add move_up, move_down, move_right, and move_left to the input Map in project settings 
Create and inherited scene from your templateCharacter.tscn 
Then, if you want, change the sprite, and delete the script for it. 
Now, make a new script and have it inherit from the baseClass (templateCharacter class)
Maybe it would be better to name it Base. 
  -How would I do the inheritance in F#

Add a variable

```python
extends "res://Characters/TemplateCharacter.gd"
var motion = Vector2()

func _physics_process(delta)
  update_movement()
  move_and_slide(motion)

func update_movement(): 
  look_at()
  # y direction
  if Input.is_action_pressed("move_down"):
    motion.y = clamp(motion.y + SPEED, 0 , MAX_SPEED)
  elif Input.is_action_pressed("move_up"):
    motion.y = clamp(motion.y + SPEED, -MAX_SPEED, 0)
  else: 
    motion.y = lerp(motion.y, 0, FRICTION)
  # x direction
  if Input.is_action_pressed("move_left"):
    motion.y = clamp(motion.y + SPEED, 0, MAX_SPEED)
  elif Input.is_action_pressed("move_right"):
    motion.y = clamp(motion.y + SPEED, MAX_SPEED, 0)
  else: 
	motion.x = lerp(motion.x, 0, FRICTION)
```

The arguments for the clamp function are (initial value, min, max)
What is the difference between _physics_process and _process.

The lerp function will give us something to slide into. 
loat Mathf.Lerp(float from, float to, float weight) 

## <strong>Autotiles are Awesome Bitmasks</strong>

Pros and Cons of Autotiling 
- Make making levels much faster 
- Very easy to tweak levels 
- Can set up collision, occlusion and navigation in one place 

Cons 
- Initial set up is a fiddly and time consuming 

Make Add 2dnode with a sprite child 
put the tile sheet as tecture 
convert to tileset and save in new folder called tiles save as tres 

Now make a new 2Dscene and call is BaseLevel (he calls it tmeplate level)
Now add a tileMap as a child 
In the inspector add the tile map you just created into it. 
Now save in a levels folder. 
Edit the tile map and make it 64 x 64 instead of 32 by 32

We are going to click on the autotile option 
we want 3x3 minimal becuase it doesn't take into account the diagonals. 
What happens if we do go with a three by three. Now we sectected a region and make a bitmask for it
Now you should be able to pain the walls with your tile map. 
If you get weird lines in your system, then make sure you imported it right. 
Go to project settings and change the enviroment background to black. 

Challenge, make your own tile mapped floor. 
The percentages can make random floors which is cool. 

## <strong>Setting up Collisions in an Autotile</strong>