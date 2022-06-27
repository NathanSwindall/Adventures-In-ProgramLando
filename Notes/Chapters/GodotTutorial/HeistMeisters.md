---
layout: post
category: notes
image: /Notes/assets/images/Godot1.png
summary: An easy game to get the basics of Godot in C#
date: 2022-06-25
author: Nathan Swindall
---


Contents 

- [Character Template](#character-template)
- [Needed Assets](#assets)
- [The Player Character](@the-player-character)
- [The Player Character Movement](@the-player-character-movement)

<link rel="stylesheet" href="/blog-tech/assets/markdown.css">

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
<li>Dark - can switch from normal vision to night vision (with penalties) </li>
<li>Can't hurt guards. You're a thief, not an assassin. ( You could make it where you hurt the guards, but for now not FUTURE IDEAS!!!) </li>
</ul>
</div><br/><br/>


<div class="gradient">
	<h2 class="section__title" id="assets"><strong>Assets</strong></h2>
<div class="tblurb"  markdown=1>

The following links are the assets that you will need for this game. Make sure to put it into your game folder. 
<ul>
<li><a href="(https://opengameart.org/content/50-rpg-sound-effects">50 sound effects for RPG/fantasy/adventure games</a></li>
<li><a href="https://opengameart.org/content/stealth-music">Stealth Music</a></li>
<li><a href="https://opengameart.org/content/ui-pack-space-extension">Ui Pack Space Extension</a></li>
<li><a href="https://opengameart.org/content/topdown-shooter">topdown-shooter</a></li>
</ul>

</div>
</div><br/>


<div class="gradient">
	<h2 class="section__title" id="character-template"><strong>Character Template</strong></h2>
<div class="tblurb"  markdown=1>

We are going to have multiple characters in this game that will all have similar qualities. This is the perfect opportunity for creating reusable code. With GDscript it is easy. The following code does this for us. We are going to create a simple template character now who we will derive from.  In order to do this create a new node in Godot, and have the following parent child relationship. Make sure to pick the child not selectable on the parent node (KinematicBody2D). You can save this in a folder labeled Character as something like TemplateCharacter.tscn.

<br/>

{%- assign child_not_selectable = "blog-tech/assets/images/heist/child_not_selectable.png" | relative_url-%}
<img src ="{{child_not_selectable}}">

- KinematicBody2D ([doc](https://docs.godotengine.org/en/stable/classes/class_kinematicbody2d.html))
  - Sprite
  - CollisionShape2D

Then we are going to add a script to this with the following code:

```python 
extends KinematicBody2D

const SPEED = 10 
const MAX_SPEED = 100 
const FRICTION = 0.1 
```

Unfortunately, I haven't figured out a way in order to create exactly this aspect in C#. I was hoping I could use the variable easily from a parent class to another, but it isn't as straight forward. What I did was create a static class that just held my constants in it, which sort of defeats the purpose of using this template character, but we might add further functionality for this character which would be useful. Thus, I have come up with two different ways of making it possible to copy this above behavior. I could make a static class that includes all the constants I will use, or I can create a class that has a getter. I have opted for both, just in case I find out later that one of methods is more useful for something. 
<br/>
Here is the class way:

```cs
using Godot;
using System;

public class TemplateCharacter : KinematicBody2D
{
	// Declare member variables here. Examples:
	// private int a = 2;
	// private string b = "text";
	public const int SPEED = 10; 
	public const int MAX_SPEED = 100; 
	public const double FRICTION = 0.1;

	// Called when the node enters the scene tree for the first time.
	public override void _Ready()
	{
	}

	public int Speed { get {return SPEED; } }
	public int MaxSpeed { get {return MAX_SPEED;}}
	public  double Friction { get { return FRICTION;}}

}

```

<br/>
Here is the static class way:

```cs
namespace HesitMeistersCSharp.Utils
{
    public static class Constants
    {
        public const int SPEED = 20; 
        public const float MAX_SPEED = 200; 
        public const float FRICTION = 0.1f;

        public const string MOVEUP = "move_up";
        public const string MOVEDOWN = "move_down";
        public const string MOVERIGHT = "move_right";
        public const string MOVELEFT = "move_left";
    }
}
```

The static class is in a utils folder I created for the project, while I put the TemplateCharacter.cs into the Characters folder:<br/>

{%- assign TemplateCharacter = "blog-tech/assets/images/heist/TemplateCharacter.png" | relative_url-%}
<img src ="{{TemplateCharacter}}">

</div>
</div><br/>



<div class="gradient">
	<h2 class="section__title" id="the-player-character"><strong>The Player Character</strong></h2>
<div class="tblurb"  markdown=1>
Now that we have the template character, we can go ahead and derive a new character from it. We are going to create a new node by pressing the "+" button and then pressing the button indicated in this image below. We will then open the TemplateCharacter.tscn that we just made. <br/>

{%- assign CreatePlayer1 = "blog-tech/assets/images/heist/CreatePlayer1.png" | relative_url-%}
<img src ="{{CreatePlayer1}}"> <br/>

From this section we are going to delete the script of this new inherited scene, and replace it with a new script that inherits from our base script. When doing this with GDScript, it's pretty easy with the interface for adding a new script. We just say that we want to inherit from out template character class. <br/>

{%- assign CreatePlayer2 = "blog-tech/assets/images/heist/CreatePlayer2.png" | relative_url-%}
<img src ="{{CreatePlayer2}}"> <br/>

Once your are done, you will get something like this: 

```python
extends "res://Characters/TemplateCharacter.gd"
```

Unfortunately, with C# classes, I am unable to get the Gui to work to find the correct path, so you have to manually extend the C# class in order to do it. It seems to work well, when all the classes are in the same file. So, I can write a script like this to inherit from another script.

```cs
using Godot;
using HesitMeistersCSharp.Utils;

public class Player : TemplateCharacter //
{

}
```

</div>
</div><br/>

<div class="gradient">
	<h2 class="section__title" id="the-player-character-movement"><strong>The Player Character Movement</strong></h2>
<div class="tblurb"  markdown=1>
The first thing we are going to have to do is set keys to certain directions. In order to do this you can go to the project settings and change the input mapping adding the variables <code class="code-style2">move_up</code>, <code class="code-style2">move_down</code>, <code class="code-style2">move_right</code>, and <code class="code-style2">move_left</code>. <br/><br/>
<br/>
{%- assign movement1 = "blog-tech/assets/images/heist/movement1.png" | relative_url-%}
<img src ="{{movement1}}"> <br/>

In order to make them easy to work worth in code, I added them to the <code class="code-style2">Constants.cs</code> class that I mentioned earlier. There are a few different functions we need to work on in our script in order to get movement. Make sure that you have added the hitbox on the CollisionShape2D, and the sprite file to the Sprite node in the Godot Editor. We are trying to achieve movement here, and we need to see something on the screen in order to do that. So to our player file we will add a few things: First we will need a member variable for the movement vector. Every player has to have a vector where they are currently moving. Then we will override the <code class="code-style2">_Ready()</code> function, and the <code class="code-style2">_PhysicsPocess(float delta)</code> function. <br/>

```cs
public Vector2 motion = new Vector2(); ////

	// Called when the node enters the scene tree for the first time.
	public override void _Ready()
	{
		
	}

	public override void _PhysicsProcess(float delta)
	{
		this.updateMovement();
		this.MoveAndSlide(this.motion);
	}
```

The <code class="code-style2">this.MoveAndSlide(this.motion)</code> is a function that is inherited from KinematicBody2D and takes our characters movement vector, but we will need to write the updateMovement function ourselves. I have decided to use the constant module instead of actually inherited the constants from the template character. If I wanted to inherit the constants from the template character, I would use <code class="code-style2">this.Speed</code>, but I currently like the constants way better. <br/>

```cs
public void updateMovement()
	{
		// Make it so your player is always looking at the mouse 
		this.LookAt(this.GetGlobalMousePosition());

		// Y direction
		if (Input.IsActionPressed(Constants.MOVEDOWN))
		{
			this.motion.y = Mathf.Clamp(this.motion.y + Constants.SPEED, 0, Constants.MAX_SPEED );
		}
		else if (Input.IsActionPressed(Constants.MOVEUP)) 
		{
			this.motion.y = Mathf.Clamp(this.motion.y - Constants.SPEED,  -Constants.MAX_SPEED , 0);
		}
		else
		{
			motion.y = Mathf.Lerp(motion.y, 0, Constants.FRICTION);
		}

		// X direction
		if (Input.IsActionPressed(Constants.MOVELEFT))
		{
			this.motion.x = Mathf.Clamp(motion.x - Constants.SPEED, -Constants.MAX_SPEED, 0 );
		}
		else if (Input.IsActionPressed(Constants.MOVERIGHT))
		{
			this.motion.x = Mathf.Clamp(motion.x + Constants.SPEED,0, Constants.MAX_SPEED );
		}
		else 
		{
			motion.x = Mathf.Lerp(motion.x, 0, Constants.FRICTION);
		}

	}
```

There are three things to notice here: we have an if/else statement for y, and x, and then we have a function we call to lookat the global postion of the mouse in here. Also, notice that we are using the <code class="code-style2">Clamp</code> function in the if/else statement, and then also we are using the <code class="code-style2">Lerp</code> function. The clamp function will prevent our x motion from getting too fast, and lerp function will slow our motion down instead of just stopping suddenly and feeling jerky. <br>

```cs
Mathf.Lerp(float from, float to, float weight)
Mathf.Clamp(initial value, min, max) 

```



If you'd like to see the GDScript for everything we have written, it is as follows: <br/>

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


</div>
</div><br/>





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


<div class="gradient">
	<h2 class="section__title" id="starting-small"><strong>Starting Small</strong></h2>
<div class="tblurb"  markdown=1>





</div>
</div><br/>
