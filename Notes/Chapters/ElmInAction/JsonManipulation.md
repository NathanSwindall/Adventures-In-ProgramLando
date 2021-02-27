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

