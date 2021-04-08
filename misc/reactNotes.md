


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


```css

.card-container {
  /* You will use this for having the picture, name, and email in column */
  display: flex;
  /* flex-direction makes it into a column */
  flex-direction: column;
  background-color: #95dada;
  border: 1px solid grey;
  /* border radius is for curving the edges */
  border-radius: 5px;
  /* padding is for creating betting inside the block */
  padding: 25px;
  /* makes the cursor a pointer when over the block */
  cursor: pointer;
  /* This is for font smoothing in mozilla and oxs
  It doesn't really do anything special */
  -moz-osx-font-smoothing: grayscale;
  /* This will show the back face, but we don't really need 
  the back face */
  backface-visibility: hiddne;
  /* The translateZ() CSS function repositions an element along 
  the z-axis in 3D space, i.e., closer to or farther away from the viewer.
   Its result is a <transform-function> data type. */
  /* It doesn't really do anything here */
  transform: translateZ(0);
  /* This will makes the transform slower */
  transition: transform 0.25s ease-out;
}

.card-container:hover {
  transform: scale(1.05);
}

/* -moz-osx-font-smoothing: grayscale; is for text smoothing but it doesn't
really make a difference */


```




