


There are quite a few 2D bodies in godot. They are as follows: 

* KinematicBody2D
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


I noticed that you can edit the script of all bunnies, but I think you can edit the script also for an individual instance

You can also attach multiple scripts to a bunny which is pretty cool. 
We can actually mess witht eh up direction maybe and make a Vector2(0,1) so that down is up