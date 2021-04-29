---
layout: post
category: notes
image: /Notes/assets/images/Godot1.png
date: 2021-02-23
author: Nathan Swindall
---


There are quite a few 2D bodies in godot. They are as follows: 

* KinematicBody2D
    * Controls the character
* RigidBody2D
* StaticBody2d


```python
extends KinematicBody2D


# Declare member variables here. Examples:
# var a = 2
# var b = "text"
var motion = Vector2(0,0) # has the fields x and y
const SPEED = 500


# Called when the node enters the scene tree for the first time.
func _physics_process(delta): # used for physics enginer
	if Input.is_action_pressed("left"):
		motion.x = -SPEED
	elif Input.is_action_pressed("right"):
		motion.x = SPEED 
	else:
		motion.x = 0
	move_and_slide(motion) # takes a vector2 object
```


# Animation Frames

When creating a 2D platformer, you often want to add animation to your player. Godot makes this really simple with the `AnimateSprite` class which is a class under the Node2D class. You will need to create a new child under the main `Node2D` node. If you already have a `Sprite` child node, you can get rid of this node. Then, for the animations such as `jump`, `walk`, and `idl`, you will put these into their respective animation frames and pick the FPS for how fast you want the animation to change. There are limitless possibilities to what you can do. The below code is a function I created to map the different animations with the global `Vector2` motion object. You must make sure that you include this function in the _physics_process(delta) function or the animations will not run. I have included the example of my current _physics_process function below too. 


```python

func animateBunny():
	if motion.y < 0:
		$AnimatedSprite.play("jump")
	elif motion.x > 0:
		$AnimatedSprite.play("walk")
		$AnimatedSprite.flip_h = false
	elif motion.x < 0:
		$AnimatedSprite.flip_h = true # flip the animation
		$AnimatedSprite.play("walk")
	else:
		$AnimatedSprite.play("idle")
```

```python
func _physics_process(delta): # used for physics engine
	apply_gravity()
	jump()
	move()
	animateBunny()

```


On interesting feature the above code examples is the `$` in front of the `AnimatedSprite` object. The `$` gives access to the children below the main Node2D node. Also, we can access different properties on this node. For example, in the first code above, I used the `AnimatedSprite.flip_h` part to flip the animation for 'walk'. This makes it so that when the player changes direction that the bunny also changes to the corresponding direction. 


# Encapsulation

A lot of times it is good to encapsulate certain features away so that your whole code doesn't break when something goes wrong. In the previous code we have animation which is included with the bunny. What might be a better strategy is to abstract the animation away into its own category. There is a new keyword we can do this with which is `signal`. The way we will set this up is to put a script on the PlayAnimation, which is an `AnimatedSprite` type. The script will be just like the above script, but now it is in a different place. First, you have to add the `AnimatedSprite` as a child to bunny, and then save the branch as its own scene. I don't think we really have to make it its own scene, but it works this way. 


```python
extends AnimatedSprite

func _on_Bunny_animate(motion):
	if motion.y < 0:
		play("jump")
	elif motion.x > 0:
		play("walk")
		flip_h = false
	elif motion.x < 0:
		flip_h = true # flip the animation
		play("walk")
	else:
		play("idle")
```


The tricky part is that you must connect the scripts. It seems that there might be some kind of even handler taking place so that the bunny script will emit the signal we defined and then the playerAnimation will hear this signal and do its thing. To connect the `Bunny` script to the `PlayerAnimation` script. You can connect them by going to the Node tab which is right next to the inspector tab in Godot. You will need the following declaration at the top of your `Bunny` script though.

```python
signal animate
```

Under the Node tab, a function called `animate()` will appear. You will connect this to `PlayerAnimation` scene that you just made. Once connected the function `_on_Bunny_animate()` will show up. Because we want to change the animation with the direction of the bunny, you will need to pass the Vector2 `motion` object with it. In order to emit the signal from the `Bunny` script you need add the following function to your bunny script. 

```python
func animateBunny():
	emit_signal("animate",motion)
```

Now you can call this function in your main `_physics_process(delat)` function. Notice that you are passing the motion object in your function and how you are using a string for the signal variable you put at the top of your file. 


# TileMaps

In Godot, TileMaps are very useful because they allow you to easily create platform games with out much effort. 

(picture of tile map)

In order to create a tile map you will have to do a few things. The first thing you will need is a bunch of sprites you want to create the tile map with. Luckily you can go to a website like (Kenny's Game Assets)[https://www.kenney.nl/]. You can use these to create your own tile maps. I chose (these)[https://www.kenney.nl/assets/background-elements-redux] to make another interesting tile map. This set comes with a lot of great things. One thing to note that is when you are structing your children in Godot, the first children will be the furthest back. For example, if we have something like the following:

```python
Node2D
	ForestBackground
	Bunny
```

The background will show up behind the bunny. If we have it the other way around then the bunny will be behind the background which isn't what we want. 

Now on to the actual tile making process. In order to make a tile map you will need to make a `Node2D`. Then under this node you will put a bunch of sprites. The easiest way to put the sprites in to your file is to just drag all them over. The example I made uses some cakes from Kenny's website which are really cool. 

(TileMap PICC)


After bringing in the sprites you will need to add a `StaticBody2D` to them along with a `collisionPolygon2D`. This is because they can't just be a sprite. They also have to have physics interactions with them. To give a good picture of what I mean, just take a look at the following. 


(TileMap2 PICC)