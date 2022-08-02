---
layout: post
category: notes
image: /Notes/assets/images/PracticalHaskell.jpg
summary: Using monads with k-clustering algorithm
date: 2022-07-20
author: Nathan Swindall
---


<link rel="stylesheet" href="/blog-tech/assets/markdown.css">

## Table of Contents 

- [Introduction](#introduction)
- [Building a Project](#building-a-project)
- [Creating Classes for Our New Vector](#creating-classes-for-our-new-vector)
- [Creating a clusterAssignmentPhase Function](#creating-a-clusterassignmentphase-function)
- [Recalculate the Centroids](#recalculate-the-centroids)
- [Creating a Stop Condition](#creating-a-stop-condition)




<div class="gradient">
	<h2 class="section__title" id="introduction"><strong>Introduction</strong></h2>
<div class="textBlurb"  markdown=1>

### Problems 

### Instruction

</div>
</div><br/>




<div class="gradient">
	<h2 class="section__title" id="building-a-project"><strong>Building a Project</strong></h2>
<div class="textBlurb"  markdown=1>


- [The Haskell Tool Stack](https://docs.haskellstack.org/) is useful for understanding and getting you started using stack with haskell which will create a project layout for you.
- You first want to upgrade your stack with the command `stack upgrade` to have the most updated dependencies. 
- Then to start a new project just run the command `stack new <project-name>` and cd into this folder. 
- To add a dependency, just list the dependencies you want to add in your package.yaml file. You can find many wonderful packages [here](https://hackage.haskell.org/). To further demonstrate this, look that the following example where I add the text package and then the microlens-platform package. 

```yaml
# common to point users to the README.md file.
description:         Please see the README on GitHub at <https://github.com/githubuser/chapter6#readme>

dependencies:
- base >= 4.7 && < 5
- text # so I can use Data.text.IO as test
- microlens-platform # so I can use a lens
- containers # for using Data.Map

```

- To have them installed, just run `stack build`. 
- In order to run just one script and not the whole project in ghci, you can use the command `stack ghci src/Lib.hs` from the base directory of the project
- In order to test out to see if everything works you can try a few simple functions

```hs 
import Lens.Micro.Platform

-- create a Person ADT
data Person = Person String String
                deriving (Show) -- derive show so it works in ghci

-- create some function
firstName :: Lens' Person String
firstName = lens (\(Person f _) -> f)
                 (\(Person _ l) newF -> Person newF l)

lastName :: Lens' Person String
lastName = lens (\(Person _ l) -> l)
                (\(Person f _) newL -> Person f newL)

nathan :: String
nathan = view firstName examplePerson 

swindall :: String
swindall = view lastName examplePerson

-- You can also use this way of getting the same result
anotherWay = examplePerson^.lastName 

```

- You can use `stack ghci src/Lib.hs` in order to test out the script


</div>
</div><br/>


<div class="gradient">
	<h2 class="section__title" id="creating-classes-for-our-new-vector"><strong>Creating Classes for Our New Vector</strong></h2>
<div class="textBlurb"  markdown=1>



```hs 
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE MultiParamTypeClasses #-}

class Ord v => Vector v where 
    distance :: v -> v -> Double 
	centroid :: [v] -> v -- We need ord for this definition because we need to know which centroids are closer. 

-- In order to make a class with two params 'e' and 'v', you must enable MultiParamTypeClasses
class Vector v => Vectorizable e v where 
    toVector :: e -> v

-- This instance uses FlexibleInstances.
-- If you didn't have FlexibleInstances on then you could not have (Double, Double) this is because 
{-
    All instance types must be of the form (T a1 ... an)
    where a1 ... an are *distinct type variables*,
    and each type variable appears at most once in the instance head.

    That means that, for example, while you can create an instance for [a] you can't create an instance for specifically [Int].; FlexibleInstances relaxes that:

    In the vector example you could have 
    instance Vector (a, a1) where
-}

instance Vector (Double, Double) where 
    distance (a,b) (c,d) = sqrt $ (c-a) * (c-a) + (d-b) * (d-b)
    centroid lst = let (u,v) = foldr (\(a,b) (c,d) -> (a + c, b + d)) (0,0) lst 
                       n = fromIntegral $ length lst 
                    in (u/n, v/n)

-- This instance uses FlexibleInstances
instance Vectorizable (Double, Double) (Double, Double) where 
    toVector = id

```

- The centroid definition is a little bit strange and it introduces some new functions 
- Let's go over it's definition

```hs 

-- We can use the definition like this 
myList :: [(Double,Double)] -- we must define this here because we only made an instance for (Double,Double)
myList = [(1.0,10.0),(2,3),(3.4,5.4)]

myCentroid :: (Double, Double)
myCentroid = centroid myList  --  = (6.133333333333333,6.133333333333333)


fromIntegral :: (Integral a, Numb) => a -> b 
-- this function will change the int we get back from the list and make it a Num type. 

-- We are just adding up all the x's and getting and average and adding up all the y's and getting and average. 
```

</div>
</div><br/>



<div class="gradient">
	<h2 class="section__title" id="creating-a-clusterassignmentphase-function"><strong>Creating a clusterAssignmentPhase Function</strong></h2>
<div class="textBlurb"  markdown=1>




- Because we are using classes, our function will work with any form of vector. So, our implementation will be very general to an vector length
- ClusterAssignmentPhase will be the phase where we have two centroids (We don't really know how to find these, but we just plug them into the function), and we assign all the points that are closest to these centroids. If it is closer to one centroid than the other, then we assign t to that one. Thus, we want a pay where the centroid will be the key, and then the value will be the points assigned to that centroid. 

- Here is our first attempt

```hs 
import qualified Data.Map as M -- make sure to add this. It's from the containers package 
import Data.List -- This will give the function minimumBy

... -- elided code 

clusterAssignmentPhase :: (Ord v, Vector v, Vectorizable e v)
                        => [v] -> [e] -> M.Map v [e]
clusterAssignmentPhase centroids points = 
        let initialMap = M.fromList $ zip centroids (repeat [])
        in foldr (\p m -> let chosenC = minimumBy  (compareDistance p) centroids 
                          in M.adjust (p:) chosenC m) 
                 initialMap points
        where compareDistance p x y = compare (distance x $ toVector p)
                                              (distance y $ toVector p)

```

- The functions isolated can be seen below 

```hs 

repeat :; a -> [a] -- makes an infinite array with that element 
repeat [] = [[][][][][][]....]

M.fromList :: Ord k => [(k, a)] -> M.Map k a

-- the zip function
zip :: [a] -> [b] -> [(a,b)]
a = [1,2,3,4,5]
b = [9,8,7,6,5,4,3]
zip a b = [(1,9),(2,8),(3,7),(4,6),(5,5)]

-- This is a confusing function but it is used to get rid of parentheses. It can sometimes act like (.)
($) :: (a -> b) -> a -> b

myCentroids :: [(Double, Double)]
myCentroids = [(1.0, 3.0), (5.0,4.0)]

myPoints :: [(Double, Double)]
myPoints = [(5.0, 6.0), (1.0,1.0),(2.0,7.0),(9.0,8.0)]

-- This will create our initial map where we will assign the points
initialMap :: M.Map (Double, Double) [a]
initialMap = M.fromList $ zip myCentroids (repeat []) = fromList [((1.0,3.0),[]),((5.0,4.0),[])]

-- compare
Data Ordering = LT | GT | EQ
compare :: Ord a => a -> a -> Ordering
compare 1 2 = LT 

-- testing the minimumBy
minimumBy :: Foldable t => (a -> a -> Ordering) -> t a -> a 

compareDistance :: (Vectorizable e v1, Vectorizable e v2) => e -> v1 -> v2 -> Ordering 
comapreDistance p x y = compare (distance x $ toVector p) (distance y $ toVector p)
compareDistance (1.0,3.0) (3.03,4.0) (10.0,1.0)

chosen :: (Foldable t, Vectorizable e a) => e -> t a -> a
chosen p centroids = minimumBy (compareDistance p) centroids 
chosen (3, 100) myCentroids = (5.0, 4.0)


-- M.adjust is used for updating a specific key with the result of the provided function
-- It takes a function that will change one part into another, but doesn't change it's 
-- type, then it takes 'k' which is the key to the map
M.adjust :: Ord k => (a -> a) -> k -> M.Map k a -> M.Map k a
M.adjust ("new " ++) 5 (fromList [(5,"a"), (3,"b")]) == fromList [(3,"b"),(5,"new a")]

```

- The fold can be a little confusing because it seems to actually switch the parameters around for the 
right fold. Thus, you should pay close attention to the following examples. 


```hs

foldr (+) 0 [1,2,3,4] = 10
foldr (/) 4 [1,2,3,4] = 1.5 -- Notice that the 4 is on the right of the operation for this and it starts on the right side
1/( (2/ ( 3/ ( 4/4 ))))
foldl (/) 4 [1,2,3,4] = .166666666 -- Notice that the 4 is on the left side for this and the calculation is different
((((4/1)/2)/3)/4)                  -- this means for an equation like (\a b -> a / b) the letter b would be the 4 in the equation.
4/4/3/2/1                          -- This is a little confusing because it looks like (\a b -> a /b ) 4 x and it would be a. But foldr switches them

-- Notice for this part that the initial Map and points are switch. This is because the operation will 
in foldr (\p m -> ...) initialMap points
-- It's like this example and we know that it first starts out with 4/4 and then 3 / answer. So 
-- it's taking the array components and having them on the left
foldr (\a b -> a / b) 4 [1,2,3,4] = 1/5 
foldl (\a b -> a /b) 4 [1,2,3,4] = 0.166666666 -- In this a is initially our empty case
-- (p:) is just being added to a list

-- my definition for foldl 
myFoldL f m [] = m
myFoldL f m (x:xs) = myFold f (f m x) xs

 -- definition for foldR
myFoldRight f m [] = m
myFoldRight f m (x:xs) = f x (myFoldRight f m xs) 
```



</div>
</div><br/>



<div class="gradient">
	<h2 class="section__title" id="recalculate-the-centroids"><strong>Recalculate the Centroids</strong></h2>
<div class="textBlurb"  markdown=1>




- We have a function that will assign a bunch of points to certain centroids which is our `clusterAssignmentPhase` function. For the algorithm, we will need a new function that will find a new centroid once the points `[e]` have all been assigned. This function will be called `newCentroidPhase`. It will return us two vectors when it is done. One will be the old centroid, and the other will be the new centroid. The list should only contain two items in a tuple in a list. 

```hs 

newCentroidPhase :: (Vector v, Vectorizable e v) => M.Map v [e] -> [(v,v)]
newCentroidPhase = M.toList . fmap (centroid . map toVector)

-- We will take this slow because the fmap function is a little confusing 
-- first we have the centroid . map to Vector 
-- So the map toVector takes a list [e] and turns them to [v]
-- Then the centroid finds the average point between all the new vectors that were made. 

myCentroidList :: [(Double, Double)]
myCentroidList = [(1.0,5.0), (1.4, 3.33),(2.0,1.0)] 

myCentroidMapping :: [(Double, Double)] -- really its just he identity function. So nothing changes for this example
myCentroidMapping = map toVector myCentroidList

-- in effect this function is just doing this 
centroidMap :: [(Double, Double)] -> (Double, Double)
centroidMap = centroid . map toVector

-- The fmap is a little strange but when you see that we are not being given a [e] type but the M.Map v [e] for an argument. 
-- fmap type signature is 

fmap (a -> b) -> f a -> f b

-- But the real question is how does this operate on a type of M.Map
-- Lets make a quick example 

easyMap :: M.Map Integer [Integer]
easyMap = M.fromList [(5, [1,2,3,4,5]), (6, [10,20,30,40,50])]

-- What would happen when we do the following function to easy map

upgradeEasyMap :: M.Map k [Integer] -> [(k, [Integer])]
upgradeEasyMap = M.toList . fmap (map (+1)) 

updgradeEasyMap easyMap 
-- We would get back 
= [(5,[2,3,4,5,6]),(6,[11,21,31,41,51])]

-- The fmap is just a way to run a function on the values of a M.Map while leaving the key untouched. 
```

</div>
</div><br/>



<div class="gradient">
	<h2 class="section__title" id="creating-a-stop-condition"><strong>Creating a Stop Condition</strong></h2>
<div class="textBlurb"  markdown=1>



- We know that the algorithm converges, but what if we want to after hitting some type of threshold. We should come up with an equation to test this out. 

```hs
shouldStop :: (Vector v) => [(v,v)] -> Double -> Bool 
shouldStop centroid threshold = 
    foldr (\(x, y) s -> s + distance x y) -/- centroids < threshold
```



</div>
</div><br/>

