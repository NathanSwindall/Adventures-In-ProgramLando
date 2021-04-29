---
layout: post
category: notes
image: /Notes/assets/images/ElmInAction.jpg
summary: A fast and functional front-end technology
date: 2021-04-13
author: Nathan Swindall
---


```elm
import Json.Decode as Decode exposing (Decoder, int, list, string)
import Html exposing (..)
import Html.Attributes exposing (class, src)
import Debug as D exposing (..)
import Http

type alias Model = { root : Folder }


type Folder = 
    Folder
        { name : String 
        , subfolders : List Folder
        }


testModel : Model
testModel = 
     { root = 
            Folder 
                { name = "Photos"
                , subfolders = 
                    [ Folder 
                        { name = "2016"
                        , subfolders = 
                            [ Folder 
                                { name = "outdoors"
                                , subfolders = []}
                            , Folder 
                                { name = "indoors"
                                , subfolders = []
                                }
                            ]
                        }
                    , Folder 
                        { name = "2017"
                        , subfolders = []
                        }
                    ]
                }
        }

viewFolder : Folder -> Html Msg
viewFolder (Folder folder) = 
    let
        subfolders = 
            List.map viewFolder folder.subfolders
    in 
    div [ class "folder"]
        [ label [] [ text (D.log "name" folder.name)]
        , div [ class "subfolders"] (D.log "subfolders" subfolders)
        ]
```


```elm
subfolder "Photos subfolders"
subfolder "2016 subfolders"
subfolder "outdoors subfolders"
basecase []
subfolder "indoors subfolders"
basecase []
subfolder "2017 subfolders"
basecase []

```


```elm
type Folder = 
    Folder
        { name : String 
        , subfolders : List Folder
        }
```




```elm
Folder 
    { name = "Photos"
    , subfolders = 
        [ Folder 
            { name = "2016"
            , subfolders = ...
            }
        , Folder 
            { name = "2017"
            , subfolders = []
            }
        ]
    }
```

```elm
subfolder = 
    List.map viewFolder [Folder { name = "2016" ...}, Folder { name = "2017" ...}]
```

```elm
viewFolder (Folder {name = 2016 ..})
```

```elm 
subfolder = 
    List.map viewFolder [Folder {name = "outdoors"...}, Folder {name = "indoors"...}]
```

This is the base case and is for the outdoors folder
```elm
subfolder = List.map viewFolder []
```

```html
<div class="folder">
    <label>outdoors</label>
    <div class="subfolders"></div>
</div>
```

It's form unevaluated
```elm
 div [ class "folder"]
        [ label [] [ text "outdoors"]
        , div [ class "subfolders"] []
        ]
```

This is for the `indoors` folder
```elm
subfolder = List.map viewFolder []
```

It's form unevaluated
```elm
 div [ class "folder"]
        [ label [] [ text "indoors"]
        , div [ class "subfolders"] []
        ]
```

```html
<div class="folder">
    <label>indoors</label>
    <div class="subfolders"></div>
</div>
```

Go back to level two which is 2016, and we can now evaluate it fully with out more recursive calls
```elm
 div [ class "folder"]
        [ label [] [ text "2016"]
        , div [ class "subfolders"] [ div ... "outdoors" ... div ... "indoors"]
        ]
```








