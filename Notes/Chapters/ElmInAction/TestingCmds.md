---
layout: post
category: notes
image: /Notes/assets/images/ElmInAction.jpg
summary: A fast and functional front-end technology
date: 2021-03-04
author: Nathan Swindall
---

### **Testing Commands In Elm**


At the time of writing this article, there is no way to test commands for elm. If you are working through the Elm In Action book, the author does offer one solution to this problem which is to setup a way to indirectly test a commands by making a new `Commands` type. I've noticed so far in this book there have been a few errors in the book where he makes some mistakes in the code, but you can kind of figure them out easily if you are building the app along with him. This error in the current edition was one that I ran into quite a few problems. 

I am not sure if he meant for the code for testing commands to run in our current code base at this point in the book (Chapter 6 Testing), but the code he gives does not work at all and has some errors. 

```elm
type Commands 
     = FetchPhotos Decoder String
     | SetFilters FilterOptions
```

There are a few problems with this code. One is that these aren't all the commands that you are using in your update function. Second is that Decoder actually takes a type variable, and if you put this code into your main elm app you will get an error telling you this. The way I corrected this was by actually figuring out what types each of these customer data types needs. 

For example, the `FetchPhotos Decoder String`, should be `Fetch (Decoder (List Photo)) String`. This is because the Decoder we get back will be decoded a JSON file that has list of photos. The other commands that we are missing in the defintion are a command for `Cmd.none`, which I made a constructor fucntion `NoCommand` and then another command for our random numbers. The code is as follows. 

```elm
type Commands 
    = FetchPhotos (Decoder (List Photo)) String 
    | SetFilters FilterOptions
    | RandomPhotoCmd (Random.Generator Photo)
    | NoCommand 

```
We will then need to create a function that takes our `Command` type and transforms them into a `Cmd Msg` type. The author included only the two options that were in his defintion for `Commands`.

```elm
toCmd : Commands -> Cmd Msg 
toCmd commands = 
    case commands of 
        FetchPhotos decoder url -> Http.get { url = url, expect = Http.expectJson GotPhotos decoder } 
        Setfilters options -> setFilters options
```

But since we update the commands to include two more commands, we need to update the function a little bit to have those commands also. 

```elm
toCmd : Commands -> Cmd Msg 
toCmd commands = 
    case commands of 
        FetchPhotos decoder url ->
            Http.get { url = url, expect = Http.expectJson GotPhotos decoder}
        SetFilters options ->
            setFilters options
        RandomPhotoCmd random -> 
            Random.generate GotRandomPhoto random
        NoCommand ->
            Cmd.none
```


He mentioned that we should change our update function's type signature to `update : Msg -> Model -> (Model, Commands)`. If we do this though, we also have to make sure each case returns the type (Model, Commands). 

```elm
update: Msg -> Model -> ( Model, Commands)  
update msg model = 
    case msg of 
        ClickedPhoto url -> 
            applyFilters { model | status = selectUrl url model.status}
        ClickedSize size -> 
            ( { model | chosenSize = size }, NoCommand )
        ClickedSurpriseMe -> 
            case model.status of 
                Loaded (firstPhoto :: otherPhotos) _ -> 
                    Random.uniform firstPhoto otherPhotos
                    |> RandomPhotoCmd
                    |> Tuple.pair model 
                Loaded [] _ -> 
                    ( model, NoCommand)
                Loading -> 
                    ( model,NoCommand)
                
                Errored errorMessage -> 
                    ( model, NoCommand)
        GotRandomPhoto photo ->
            applyFilters {model | status = selectUrl photo.url model.status}
        GotPhotos (Ok photos) -> 
            case photos of
                [] -> ( {model | status = Errored "No photos!" }, NoCommand)
                first::tail -> applyFilters {model | status = Loaded photos first.url}
        GotPhotos (Err httpError) ->
                ( {model | status = Errored "Server error!"}, NoCommand)
        GotActivity activity -> 
                ( { model | activity = activity}, NoCommand)
        SlidHue hue -> 
            applyFilters {model | hue = hue }
        SlidRipple ripple -> 
            applyFilters { model | ripple = ripple}
        SlidNoise noise -> 
            applyFilters { model | noise = noise }
```

If you make this change to your code. You will still get quite a few red lines as the compiler has noticed some other areas that need to change. This is one thing I love about the elm compiler. It shows you all the places you have a type mismatch. In this case, our `applyFilters` function in the `update` function returns a `Cmd Msg` but it should return our new `Command` data type. This is another simple fix, so let's go ahead and change this function. 

```elm
applyFilters : Model -> ( Model, Commands) 
applyFilters model = 
    case model.status of 
        Loaded photos selectedUrl -> 
            let
                filters = 
                    [ { name = "Hue", amount = toFloat model.hue /11}
                    , { name = "Ripple", amount = toFloat model.ripple /11}
                    , { name = "Noise", amount = toFloat model.noise /11}
                    ]
                url = 
                    urlPrefix2 ++ "large/" ++ selectedUrl
            in
                ( model, SetFilters { url = url, filters = filters})
        Loading -> 
            ( model, NoCommand)
        Errored errorMessage -> 
            ( model, NoCommand)
            
```

Now, since we change our update functions type signature, it doesn't fit with our main function. Specifically with the update key value pair. The update value pair needs a type of `Cmd Msg`, so we need to make a function that gets the return result from the update function and return the proper `Cmd Msg` type. The author wrote a perfect function for this part. 

```elm
updateForProgram : Msg -> Model -> (Model, Cmd Msg)
updateForProgram msg model = 
    let
        ( newModel, commands) = update msg model
    in
    ( newModel, toCmd commands)
```

Lastly, we need to add our new function to the update key in our main function and our app should work now. 

```elm
main: Program Float Model Msg 
main = 
    Browser.element 
        { init = init
        , view = view
        , update = updateForProgram
        , subscriptions = subscriptions
        } 
```

