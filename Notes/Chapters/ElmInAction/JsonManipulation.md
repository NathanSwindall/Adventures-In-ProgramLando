---
layout: post
category: notes
image: /Notes/assets/images/ElmInAction.jpg
summary: A fast and functional front-end technology
date: 2021-02-23
author: Nathan Swindall
---

## **JSON Manipulation**

This tutorial will be on decoding different strings into javaScript types. For example, like turning a string into a list, or a string into an object in JavaScript. This is important because often times you will get a JSON string that you need to turn into an object or some other type in order to use the data in your app. The simplest place to start is with primitives. 

```elm
import Json.Decode


myString = Json.Decode.decodeString Json.Decode.string "\"nathan\""
myBool = Json.Decode.decodeString Json.Decode.bool "true"

myFloat = Json.Decode.decodeString Json.Decode.float "3.7373"

myNull = Json.Decode.decodeString (Json.Decode.null "null") "null"

```

There are three things you need in order to decode a string. You need the JsonDecode.decodeString function, a decoder which is like the template for how the item you are decoding is laid out, and the string you are trying to decode. You can see the type signature for the function Json.Decode.decodeString below. 

```elm
Json.Decode.decodeString : Json.Decode.Decoder a -> String -> Result Json.Decode.Error a
```

So the function takes a decoder which can be of many different forms. This is what the 'a' stands for. Then it takes the string and returns the result. We get a result type back because the decoding on the string could fail. 

Other than primitives we can also decode a list, but we have to use a special decoder which is `Json.Decode.list`. Unlike the primitive decoders, this decoder takes an argument itself because we need to know the type inside the list. The type signature for the `Json.Decode.list` is below. 

```elm
Json.Decode.list : Json.Decoder.Decoder a -> Json.Decode.Decoder (List a)
```

So `Json.Decode.list` takse a decoder of type 'a' (remember this is the variable type) and then returns the type `List a`. Let's say we wanted to decode a boolean list. In order to do this we would do the following code. 

```elm
myListBools =
    Json.Decode.decodeString (Json.Decode.list Json.Decode.bool) "[true,false,ture]"
```


Now that we have done a list, it's time to move onto JSON objects which are little bit trickier. For a JSON object, they have fields so we will have to use the `Json.Decode.field` function to decode the field. Say we have a simple object like the following:

```js
{ "email": "Nathan@example.com"}
```

We have one field in this example, so we will need to use the field function for email. When working with new functions it is always a smart idea in elm to look at the function signature. Usually, I spend some time in the repl working with each different function in order to get an idea of what it is doing. So when we put this function into the reple we get the signature like the following. 

```elm
Json.Decode.field : String -> Json.Decode.Decoder a -> Json.Decode.Decoder a
```

So this function will take a string and then another decoder object in order to get what that field is holding. The second argument, which is a `Json.Decode.Decoder a` is what the field is holding. For our easy example, the email field is holding an email which is a string. Thus, for the second argument we would use Json.Decode.string. 

```elm
myEmailObject = "{\"email\": \"cate@nolf.com\"}"

myObjectDecoder: Json.Decode.Decoder String 
myOjbectDecoder = 
    Json.Decode.field "email" Json.Decode.string


getEmailField = Json.Decode.decodeString myOjbectDecoder

myEmail = getEmailField myEmailObject
```
When we run this code we will get the following back.

```elm
> myEmail
Ok "cate@nolf.com" : Result Json.Decode.Error String
```

So this function will get an email back for you from the above object. Unfortunately, if you have been around the internet for awhile, you will know that JSON strings usually have many fields, and sometimes you don't know exactly how many fields the JSON object will have depending on what the server is giving you back. 

But before we move on, there is actually a better way of writting all the JSOn string files. Once we get to longer examples you will set that objects with multiple keys actually get quite unwieldy. Instead of the forward slash notation, we can use """ """ triple quotes. 

```elm
myEmailObject = """ {"email":"cate@nolf.com"}"""
```
Then if we use this, we will get the same result with out function. 


There are actually special functions so that we can decode more than one field at a time. For example we can use the `Json.Decode.map2` function. Let's say we have the following JSON string to decode. 

```json
{"x": 4,
 "Y": 5 }
```

We can create a special decoder to use with this JSON.

```elm
objectMultiDecoder =
        Json.Decode.map2
            (\x y -> (x, y))
            (Json.Decode.field "x" Json.Decode.int)
            (Json.Decode.field "y" Json.Decode.int)
```

Now let's create a function that will decode an JSON object with this specific structure. 

```elm
decodedTwoFields = Json.Decode.decodeString objectMultiDecoder
```

Decoding the string
```elm
xandyDecoded = decodedTwoFields """{"x":4,"y":5"}
```

Unfortunately, there isn't a mapX for all the different fields out there, and what if sometimes you will get a field that is there and a field that is not there. Your code would fail sometimes and not fail other times. Fortunately, there is a library that can help us with this and it is the `NoRedInk/elm-json-decode-pipeline`( `elm install NoRedInk/elm-json-decode-pipelin`). 

We will add some more import statements to use the `required` and  `optional` functions from this library.

```elm
import Json.Decode exposing (Decoder, int, list, string, succeed)
import Json.Decode.Pipeline exposing (optional, required)
```

The new JSON file we will be decoding: 

```json
{ "url": "www.manning.com",
  "size": 3,
  "title": "Elm-in-action"}
```

Here is a list JSON of that same JSON
```json
[{ "url": "www.manning.com",
  "size": 3,
  "title": "Elm-in-action"}.
{ "url": "www.manning.com",
  "size": "www.manning.com",
  "title": "Elm-in-action" }]
```

We want to decode both of these. We can first try the original way, and because it has three diffferent fields we can use the `JSON.Decode.map3` with this JSON. Our first function will be the following. 

```elm
photoDecoder : Json.Decode.Decoder Photo
photoDecoder = 
    Json.Decode.map3 
        (\url size title -> { url = url, size = size, title = title})
        (Json.Decode.field "url" Json.Decode.string)
        (Json.Decode.field "size" Json.Decode.int)
        (Json.Decode.field "title" Json.Decode.string) 
```

Testing it out yields the following
```elm
threeFieldJson = """{ "url": "www.manning.com","size": 3,"title": "Elm-in-action"}"""
photoDecoded = Json.Decode.decodeString photoDecoder threeFieldJson
```

```elm
> photoDecoded = Json.Decode.decodeString photoDecoder threeFieldJson
Ok { size = 3, title = "Elm-in-action", url = "www.manning.com" }
    : Result Json.Decode.Error { size : Int, title : String, url : String }
```

Now, let's try with the new way using the function `succeed`, `required`, and `optional` functions. The `succedd` type is as follows. 

```elm
> Json.Decode.succeed
<function> : a -> Json.Decode.Decoder a
```

We see that it takes some type variable and turns the type variable into a decoder. Now let's make a type alias for some type of Json we might get back from a server. 

```elm
type alias CustomerInfo = 
    { name : String
    , city : String
    , age : Int
    , social : Int
    }
```

Now let's use the succeed function on this type class to see the type we get back. 


```elm
> Json.Decode.succeed CustomerInfo
<internals>
    : Json.Decode.Decoder (String -> String -> Int -> Int -> CustomerInfo)
```

We see that we get a decoder of a function which is sort of useless. What we want is the type `Json.Decode.Decoder CustomerInfo`.Actually, the succeed function is a quite confusing because what it is really doing is almost ignoring the Json string and giving you back it's value. This is probably easier to explain with an example

```elm
>Json.Decode.decodeString (Json.Decode.succeed 42) "[1,2,3]"
Ok 42 : Result Json.Decode.Error number
> Json.Decode.decodeString (Json.Decode.succeed 42) "true"   
Ok 42 : Result Json.Decode.Error number
> Json.Decode.decodeString (Json.Decode.succeed 42) "hello"  
Err (Failure ("This is not valid JSON! Unexpected token h in JSON at position 0") <internals>)
```

If you want a good article that explains the succeed function well check out [this](https://korban.net/posts/elm/2018-07-10-how-json-decode-pipeline-chaining-works/) article. What the succeed is doing here is saying that given valid JSON data as a string, I will return the number 42. 


