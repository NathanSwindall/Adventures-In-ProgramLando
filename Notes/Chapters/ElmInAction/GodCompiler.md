---
layout: post
category: notes
image: /Notes/assets/images/ElmInAction.jpg
summary: A fast and functional front-end technology
date: 2021-02-23
author: Nathan Swindall
---


On section 5 of the Elm in Action book, the author decides to split off the code. You can either use a record or make new data types in order to accomplish the same thing. In the elm code below. I opted for the more flexible route which was to have the filters in my Model type alias as a List { name: String, amount: Int}. This type would give more flexibility when it comes to adding different filters to the photogroove app. The author noted that this route was more prone to bugs because someone could mistype one of the strings. Your code will still compile just fun and you wouldn't get any errors, so you would have to search your code base for the bug. 

Unfortunately, I spent over two hours trying to figure out why my filter labels were not updating in the code after implementing this strategy. It Ironically turned out to be because I had an error in my javascript code that was due to a string being mistyped. This is the exact reason why the author of Elm In Action said not to use the filter List { name: String, amount: Int} type because as the project scales, a simple mistyped string could cause a huge headache for developers. 

His solution to this problem, while not being the most consise, was to make brand new types so that the compiler will always catch them at compile time. With this being the case, bugs like the one mentioned before won't happen in at least your elm code. Unfortunately, you can't say the same for you JavaScript code like for the example below. This is why you should maybe always code so that the compiler will be there to pick you up when things go wrong. 



```js
class RangeSlider extends HTMLElement {
    connectedCallback() {
        var input = document.createElement('input')
        this.appendChild(input);

        var jsr = new JSR( input, {
            max: this.max,
            values: [this.val],
            sliders: 1,
            grid: false

        })
        let rangeSliderNode = this;
      

        jsr.addEventListener("update", function(elem, value){ //Listens for "update" events from the JSR object
            let event = new CustomEvent("slide", { //creates a new slide event
                detail: {userSlideTo: value} //stores value inside event
            });
                rangeSliderNode.dispatchEvent(event); // dispatches the event from the <range-slider>
                
        })
    }
}

customElements.define('range-slider', RangeSlider)
```

```elm
module PhotoGroove3 exposing (..)


import Debug as D
import Array exposing (Array) 
import Browser
import Html exposing (..) 
import Html.Attributes as Attr exposing (class, classList, id, name, src, title, type_)
import Html.Events exposing (on, onClick)
import Http
import Json.Decode as JD exposing (Decoder, at, string, int, list, succeed )
import Json.Decode.Pipeline exposing (optional, required)
import Json.Encode as Encode
import Random 
import Box_Factory.Instructions exposing (waterAmount_if)



-- --Type aliases


type alias Photo = 
    { url: String
    , size: Int
    , title: String} 


type alias Model =      
    { status: Status
    , chosenSize : ThumbnailSize
    , filters : List {name : String, amount : Int}
    }



--Types

type Msg  
    = ClickedPhoto String
    | ClickedSize ThumbnailSize
    | ClickedSurpriseMe
    | GotRandomPhoto Photo 
    | GotPhotos (Result Http.Error (List Photo))
    | SlidFilter String Int



type ThumbnailSize 
    = Small
    | Medium
    | Large


type Status 
    = Loading 
    | Loaded (List Photo) String 
    | Errored String


-- --type annotations
urlPrefix : String 
urlPrefix = 
    "http://elm-in-action.com/"

urlPrefix2 : String 
urlPrefix2 = 
    "http://localhost:3001/images/"



view : Model -> Html Msg 
view model = 
    div [class "content"] <|  
        case model.status of
            Loaded  photos selectedUrl -> 
                viewLoaded photos selectedUrl model 
            Loading -> 
                []
            Errored errorMessage -> [text ("Error: " ++ errorMessage)]
        


viewLoaded : List Photo -> String -> Model -> List (Html Msg) 
viewLoaded  photos selectedUrl model = 
        [h1 [] [ text "Photo Groove"]
        , viewSurpriseButton
        , div [class "filters"]
           (List.map (viewFilter SlidFilter) model.filters)
        , h3 [] [ text "Thumbnail Size:"]
        , div [id "choose-size"]
            (List.map viewSizeChooser [Small, Medium, Large]) 
        , div [id "thumbnails", class (sizeToClass model.chosenSize)] 
            (List.map (viewThumbnail selectedUrl) photos)
        , img 
            [class "large"
            , src (urlPrefix2 ++ "large/" ++ selectedUrl) 
            ]
            []
        ]

viewThumbnail: String -> Photo -> Html Msg 
viewThumbnail selectedUrl thumb = 
    img
        [ src (urlPrefix2 ++ thumb.url) 
        , classList [( "selected", selectedUrl == thumb.url)]
        , onClick (ClickedPhoto thumb.url)  
        ]
        []


viewSurpriseButton =  
        button  
            [ onClick ClickedSurpriseMe]  
            [ text "Surprise Me!"]



viewSizeChooser: ThumbnailSize -> Html Msg 
viewSizeChooser size = 
    label [] 
        [ input [ type_ "radio", name "size"
            ,onClick (ClickedSize size)] []     
        , text (sizeToString size)
        ]


viewFilter : (String -> Int ->  Msg) -> {name : String, amount : Int} -> Html Msg  
viewFilter toMsg filter = 
    div [class "filter-slider"]
        [ label [] [text filter.name]
        , rangeSlider 
            [ Attr.max "11"
            , Attr.property "val" (Encode.int filter.amount) 
            , onSlide toMsg filter.name
            ] 
            []
        , label [] [text (String.fromInt filter.amount)]
        ]


sizeToString : ThumbnailSize -> String 
sizeToString size =  
    case size of 
        Small -> "small"
        Medium -> "med"
        Large -> "large"




sizeToClass : ThumbnailSize -> String 
sizeToClass size = 
    case size of 
        Small -> "small"
        Medium -> "med"
        Large -> "large"



initialModel : Model 
initialModel = 
    { status = Loading
    , chosenSize = Medium
    , filters = 
        [ { name = "Hue", amount = 5 }
        , { name = "Ripple", amount = 5}
        , { name = "Noise", amount = 5}
        ]
    }





update: Msg -> Model -> ( Model, Cmd Msg)  
update msg model = 
    case msg of 
        ClickedPhoto url -> 
            ( { model | status = selectUrl url model.status}, Cmd.none )
        ClickedSize size -> 
            ( { model | chosenSize = size }, Cmd.none )
        ClickedSurpriseMe -> 
            case model.status of 
                Loaded (firstPhoto :: otherPhotos) _ -> 
                    Random.uniform firstPhoto otherPhotos
                    |> Random.generate GotRandomPhoto
                    |> Tuple.pair model 
                Loaded [] _ -> 
                    ( model, Cmd.none)
                Loading -> 
                    ( model, Cmd.none)
                
                Errored errorMesssage -> 
                    ( model, Cmd.none)
        GotRandomPhoto photo ->
            ( {model | status = selectUrl photo.url model.status}, Cmd.none)
        GotPhotos (Ok photos) -> 
            case photos of
                [] -> ( {model | status = Errored "No photos!" }, Cmd.none)
                first::tail -> ({model | status = Loaded photos first.url}, Cmd.none)
        GotPhotos (Err httpError) ->
                ( {model | status = Errored "Server error!"}, Cmd.none)
        SlidFilter name amount -> 
            let
                transform filter = 
                    if filter.name == name then 
                        { name = name
                        , amount = D.log "amount" amount
                        }
                    else 
                        D.log "filter" filter
                filters = 
                    model.filters
                        |> List.map transform
            in
                ( { model | filters = filters }
                , Cmd.none)
            




selectUrl : String -> Status -> Status 
selectUrl url status = 
    case status of 
        Loaded photos _ -> 
            Loaded photos url 
        Loading -> 
            status
        Errored errorMessage -> 
            status


initialCmd : Cmd Msg 
initialCmd = 
        Http.get 
            { url = "http://localhost:3001/photos/list.json" 
            , expect = Http.expectJson GotPhotos (JD.list photoDecoder) 
            }

main: Program () Model Msg 
main = 
    Browser.element 
        { init = \flags -> ( initialModel, initialCmd) 
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none}




photoDecoder: JD.Decoder Photo 
photoDecoder = 
    JD.succeed Photo 
        |> required "url" JD.string 
        |> required "size" JD.int
        |> optional "title" JD.string "(untitled)"


rangeSlider : List (Attribute msg) -> List (Html msg) -> Html msg
rangeSlider attributes children = 
    node "range-slider" attributes children



onSlide : (String -> Int -> msg) -> String -> Attribute msg 
onSlide toMsg name = 
    at [ "detail", "userSlidTo"] int 
        |> JD.map (toMsg name)
        |> on "slide" 
```
