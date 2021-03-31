---
layout: post
category: notes
image: /Notes/assets/images/PracticalHaskell.jpg
summary: Haskell - A purely functional language
date: 2021-03-12
author: Nathan Swindall
---


### **K-Means Clustering**

Implementing the k-means clustering algorithm in a purely functional language such as haskell isn't initially the easiest coding experience, but once you wrap your head around the intriciate details of it all, it is actually quite enjoyable. In order to implement the algorithm when need to know exactly what algorithm we are implementing. The alogrithm invovles sequestering points into a certain number of groups with the average point of the groups being the centroid. They say a picture is worth a thousands words and in this case, instead of boring you with more dialogue I will show a picture of what I mean. 

{% assign kmeans = "Notes/assets/images/kmeans.png" | relative_url %} 
<img src="{{kmeans}}">

As you can see from the picture above, there are clusters of data, and then a centroid for each group of data. The algorithm will cluster all the data into these groups and will give you the centroid (average of these points). 

There are few ways to go about this problem. We could represent each point by using a tuple. But this limits us to having our data as only tuples, and we would need to change the function if the tuple size changes. We could use a list, but this has its own problems of being too general and the list can change sizes which isn't necessarily a good thing. The best way to approach this problem is by making a class Vector. This will just specific enough that we can use any data type that is an instance of Vector, but not too general where we lose the power of our type system. 

```haskell
class Ord v => Vector v where 
    distance :: v -> v -> Double 
    centroid :: [v] -> v
```

We have two different functions here that every instance of the vector class should define, which are the distance and centroid function. The distance function will find the distance between two different vectors, while the centroid function will find the average vector out of a list of vectors. We need the `Ord` class constraint because they vectors need to have size and be ordered. 

The next class we will definite is a class that will allow some type to be turned into a vector. What I mean is, let's say that I had some numbers in one type of data, but I want to make it a vector that could easily be used in a K-Means cluster. Then, this data type would have to be vectorizable. This will be our next class to define. 

```haskell
class Vector v => Vectorizable e v where 
    toVector : e -> v
```

This class just has function that will take some type of data structure and turn it into a type that is an instance of the Vector class. This will come in handy later when we try to put different types of structures through the algorithm. If we try to compile the code now, we will get an error. This is because we need to enable the `MultiParamTypeClasses` parameter on the haskell compiler. The class declaration has two type variables in its declaration. Usually, this isn't allowed, but by adding 

```haskell
{-# LANGUAGE MultiParamTypeClasses #-}
```

to the top of the file we can get rid of the error. 

Let's create instances of these classes. Before we can create instances, we will have to enable another pragma on the compiler in order not to get errors. This pragma is `{-# LANGUAGE FlexibleInstances #-}`. 

```haskell
{-#LANGUAGE FlexibleInstances #-}
```
This makes it so that we can have flexible instances when writing our instances for the above classes. Let's