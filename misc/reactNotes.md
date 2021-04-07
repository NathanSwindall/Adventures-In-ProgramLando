


```css
.card-list {
  width: 85vw;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
}
```

This css code above uses the grid display. More information on the grid display can be found at [this](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout) link. The `fr` in the grid-template column makes it so the available space inside the grid is taken up equally by the columns. Thus if we have `1fr 1fr 1fr` we have three columns that are all the same length. 




