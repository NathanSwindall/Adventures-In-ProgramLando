---
layout: post
category: notes
image: /Notes/assets/images/PracticalHaskell.jpg
summary: Haskell - A purely functional language
date: 2021-03-12
author: Nathan Swindall
---

### **Haskell Classes**

If you are coming from an OOP background then haskell classes might feel a bit weird at first. They are actually closer to interfaces rather than classes in OOP, but they don't match up perfectly with interfaces either. They can limit the types a function can take and you can create difference 'instances' of classes that behave differently depending on the type. Once again, these 'instances' aren't like any instances you will see in OOP languages. 

Let's start out with a basic example.

```haskell
--class declarations
class LifeStatus n where 
    name :: n -> String
    worth :: n -> Double
```

Here we have a class called `LifeStatus` that gives the type signature for a function that an 'instance' of `LifeStatus` should employ. Let's quickly create an instance so not to be left in the confusing cold dark for much longer. But first, lets create our own types in order to use `LifeStatus` with. 

```haskell
data King k = King k deriving Show
data Queen q = Queen q deriving Show
```

If you don't know what the `deriving Show`, it's just so the computer knows how to print our data type to the computer. 

Now we will create an instance of `LifeStatus` that is for the `King` data type and for the `Queen` data type. 

```haskell
instance Show k => LifeStatus (King k) where 
    name (King k) = "Here art thou King " ++ show k ++ "!"
    worth _ = 500000.99

instance Show q => LifeStatus (Queen q) where 
    name (Queen q) = "This be not thy Kings mistress, but thy wife " ++ show q ++ "!"
    worth _ = 500000.97
```

The cool thing about these instances, is that we can create one function that operates on different types. Usually you will have a function that will do something on one type, or if you have a polymorphisitic function like `map` it can take different types, but with instances you can define the behavior of your function easily on different types. For example, if we didn't make a class and instances for the data types `King` and `Queen` then we would have to have separate functions that do that for us. Also, the `Show => k` is just limiting our type variable `k` to a type that can be printed. If we didn't have it, then we might have a type that can't be put into a string, and the haskell compiler will yell at you.

```haskell
nameKing :: Show k => King k -> String 
nameKing (King k) = "Here art thou King " show k ++ "!"
```

This adds a lot of flexibility for your own types and how they behave adding further code resue to your programs which makes refactoring... SO much nicer. 

Not let's create some more types. We are going to create types for possible clients of time machines using the record syntax to add fields. 
```haskell
--Data declarations
data Person = Person { firstName :: String, lastName :: String}
            deriving (Show, Ord)

data Client i = GovOrg { clientId :: i, clientName :: String}
              | Company { clientId :: i, clientName :: String
                        , person :: Person, duty:: String }
              | Individual { clientId :: i, person :: Person}
              deriving (Show)

data TimeMachine = TimeMachine  { manufacturer :: String
                                , modelNum :: Integer
                                , companyName :: String
                                , direction :: TravelDirection
                                , price :: Double}
                                deriving Show

data TravelDirection = Past
                     | Present 
                     | Future 
                     | PastFuture
                     deriving Show
```

There are a few default classes in haskell that you can automatically derive for your data types. These are classes like `Show` which you see above. There are other like `Ord` which makes your data types able to be ordered, and `Eq` so that you can tell when your custom data types are equal. Sometimes though, the default behavior is not something we want. Instead, we can actually define our own instances of these classes for our data types. For example, let's define `Eq` for our `Client i` data type. 

```haskell
instance Eq a => Eq (Client a) where 
    Individual {clientId=c1, person=p1} == Individual {clientId=c2,person=p2} = 
        c1 == c2 && p1 == p2 
    Company {clientId=c1, clientName=cn1, person=p1,duty=d1} == 
        Company {clientId=c2, clientName=cn2, person=p2,duty=d2} =
        c1 == c2 && cn1 == cn2 && p1 == p2 && d1 == d2 
    GovOrg {clientId=c1,clientName=cn1} == GovOrg {clientId=c2, clientName=cn2}=
        c1==c2 && cn1 ==cn2
    _  == _  = False

instance Eq Person where 
    Person {firstName=fn, lastName=ln}==Person {firstName=fn1, lastName=ln1} = 
        fn == fn1 && ln == ln1
```

You will notice that in order to define the instance for this data type we have to limit the type variable `a` to a type that already is an instance of the `Eq` class. This is becausse in order for something to be an instance of the `Eq` class, the pieces (types) that make up the data structure must be an instance of the `Eq` class. This is also the case with the `Person` data type. We needed to it an instance of the `Eq` class so that `Client` could be one. 

We are just doing simple pattern matching on the above instance definition to show if something is equal. For instnance definitions, sometimes you don't need to define every function in the class definition. This is the case for `Eq`. You only need to definie one of the functions and it is a complete definition. 

The next instance we are going to make of our `Client` data type is of the `Ord` class. We want the clientName take precedence over which data type would me higher or lower. If clientName is similar, then we will say the type constructor `Individual` is higher than `Company` which is higher than `GovOrg`. 

```haskell
{-# LANGUAGE RecordwildCards #-}
getClientName cl = case cl of 
                   Individual {person=Person {..}} -> firstName ++ " " ++ lastName
                   _ -> clientName cl   

compareType :: Client i -> Client i -> Ordering
compareType (Individual _ _) (Individual _ _) = EQ 
compareType (Individual _ _) _ = GT 
compareType _ (Individual _ _) = LT
compareType (Company _ _ _ _) (GovOrg _ _) = GT
compareType (GovOrg _ _) (Company _ _ _ _) = LT
compareType _ _ = EQ


instance Eq a => Ord (Client a) where 
    compare c1 c2 = 
        let name1 = getClientName c1 
            name2 = getClientName c2 
        in 
            if name1 == name2 then
                compareType c1 c2  
            else if name1 <= name2 then LT 
            else GT
```

The `Ord` class uses a special data type called `Ordering` that has the constructor functions `GT|LT|EQ` which stand for greater than, less than, and equal. In this example, I used helper functions to make the definition more concise in a way. The getClientName function uses a special compiler extension so you must add `{-# LANGUAGE RecordwildCards #-}` to the top of your haskell script. This makes it possible to match using {..} instead of writing out a bunch of boiler plate code. 

The getClientName function uses the record function `clientName` to get the clientName from either the `GovOrg` type, or `Company` type, but in order to get a name for the individual, we need to pattern match and create it ourselves. 

The compare function is used to give the precedence hiearchy to the different function constructors. 

Now let's create another class called `Priceable` which will implement one function to get the price of our data type. 

```haskell
class Priceable p where 
    getPrice :: p -> Double 
```

The instance for our time machine of this class is as follows:

```haskell
instance Priceable (TimeMachine) where 
    getPrice TimeMachine {..} = price
```
One again, we are using the `RecordwildCards` extension in order to make our lives easier and just pulling out the `price` field from our record to give us an easy to implement instance. Let's know create another instance of `Priceable` but this time on a new data type 

```haskell
data TravelGuide = TravelGuide { title :: String 
                               , authors :: [String]
                               , price :: Double }
                   deriving (Show, Eq, Ord)
```

Its actually pretty much the same code to create an instance of `Priceable` for this data type using the wild cards again. Now you have two implementations of instances for the `Priceable` class. 

```haskell
instance Priceable (TravelGuide) where 
    getPrice TravelGuide {..} = price
```
Time to test out these bad boy classes and instances, but we are going to need some test data. Luckily, I have made some declarations for you. 

```haskell
testInd :: Client Integer 
testInd = Individual {person=Person {firstName="Nathan", lastName="Swindall"},clientId=1}

testGov :: Client Integer
testGov = GovOrg {clientId=123, clientName= "Nasa"}

testCompany :: Client Integer
testCompany = Company {clientId=1
                      ,clientName="Nasa"
                      , person=Person{firstName="a", lastName="b"}
                      , duty="director"}

testTM :: TimeMachine
testTM = TimeMachine { manufacturer="People's Republic"
                     , modelNum = 123 
                     , companyName = "China"
                     , direction = Future
                     , price = 22102.29
                     }
```

Let's say we wanted to find the total price of a list of `TravelGuide` or a list of `TimeMachine`. In order to do this without classes, you would first make a function for the `TravelGuide` and then a function for `TimeMachine`. Now, with classes, you only need a single function in order to work on both of these data types. Thus, you are saving yourself space and pain by combining a like pattern into one function. 

```haskell
totalPrice :: Priceable p => [p] -> Double 
totalPrice [] = 0
totalPrice (p:ps) = getPrice p + totalPrice ps

```

We just say the type variable has to be an instance of the `Priceable` class and now we have ourselves and reusable function for both the `TravelGuide` and `TimeMachine`


