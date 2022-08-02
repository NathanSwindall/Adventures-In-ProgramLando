---
layout: post
category: notes
image: /Notes/assets/images/dotnet.png
summary: Creating a CRUD application using React
date: 2022-05-18
author: Nathan Swindall
---


<link rel="stylesheet" href="/blog-tech/assets/markdown.css">

## Table of Contents 

- [Introduction](#introduction)
- [Folder structure in React](#folder-structure-in-react)
- [Adding an Activity Interface](#adding-an-activity-interface)
- [Adding a Nav bar](#adding-a-nav-bar)
    - [Adding some style to the nav bar](#adding-some-style-to-the-nav-bar)
    - [NavBar margin and fade](#navbar-margin-and-fade)
- [Add padding to body and reorganize](#add-padding-to-body-and-reorganize)
- [Creating an Activity dashboard](#creating-an-activity-dashboard)
- [Creating an activity list](#creating-an-activity-list)
- [Creating a Details View](#creating-a-details-view)
- [Creating an Activity Form](#creating-an-activity-from)
- [Selecting an Activity to View](#selecting-an-activity-to-view)
- [Displaying the Create/Edit Form](#displaying-the-create-edit-form)
- [Editing an Activity and From Basics in React](#editing-an-activity-and-form-basics-in-react)
- [Handle Create and Edit Submissions](#handle-create-and-edit-form-submissions)
- [Using a GUID From the Activity Id](#using-a-guid-from-the-activity-id)
- [Deleting an Activity](#deleting-an-activity)


<div class="gradient">
	<h2 class="section__title" id="Introduction"><strong>Introduction</strong></h2>
<div class="tblurb"  markdown=1>

In this section we are going to create a more beautiful front end using many different features of Semantic UI and also separating our code into different components and folder structures. By the time you finish it, you will have a good looking front end that will show you different activities, but it will not persist data to the backend. 

### Topics Covered 

<strong>React Folder Structure</strong>
- A React way to structure our code to give it organization

<strong>TypeScript interfaces </strong>
- Look at using interfaces to give us all the necessary typing for typescript

<strong>Semantic UI Components </strong>
- Add styling and laying out our page using an easy to use library

<strong>Basic forms in React </strong>
- How to use forms in react with one-way binding 

</div>
</div><br/>



<div class="gradient">
	<h2 class="section__title" id="folder-structure-in-react"><strong>Folder structure in React</strong></h2>
<div class="tblurb"  markdown=1>

How to organize our folder structure in [React](https://reactjs.org/docs/faq-structure.html)

- <strong>Don't overthink it</strong>
- <strong>Avoid too much nesting</strong>

### Instructions 

Create the folder structure as follows 

- In the src folder for the client-app, create and app folder and a feature folder 
    - The app folder is for all crosscutting concerns while the features folder is for all out new features we build
- In the app folder create a layout folder. 
- Move the App.tsx file into the layouts folder 
- An option will pop up and you want to chose update imports 
- Move the index.css into the layouts folder, and change the name to style.css 
    - This will be our global style sheet for all of our styles 
- Remove App.css, App.tests.tsx and logo.svg 
- Fix the imports in index.tsx for the style sheet. 

```jsx 
import React from 'react';
import ReactDOM from 'react-dom';
import './app/layout/styles.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';

```
- Remove the logo import from the App.txs file 
- Remove the App.css import from the App.tsx file. Your imports should look like this 

```jsx 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';
```
- Check for errors and make sure the activities are still displayed. 
- The folder structure should look like this 

<p>
{%- assign ReactFolderStructure= "Notes/assets/images/Dotnet/ReactFolderStructure.png" | relative_url-%}
<img src ="{{ReactFolderStructure}}">
</p>

</div>
</div><br/>


<div class="gradient">
	<h2 class="section__title" id="adding-an-activity-interface"><strong>Adding an Activity interface</strong></h2>
<div class="tblurb"  markdown=1>

### Problem 

- We want to add a new activity interface to bring type-safety to our component
- Working on type safety with json files back from server

### Instructions

- Go to localhost:5000/swagger/index.html to see your endpoints.
- In the app folder create a new folder called models 
- Now create a file called Activity.ts which will be an interface 
- You can copy the json from the swagger and put it into jsontots.com and get back and interface. 

```ts 
export interface Activity {
    id: string; 
    title: string; 
    date: string; 
    descritpion: string; 
    category: string;
    city: string; 
    venue: string; 
}
```
- You could call it IActivity.ts and go from the standards of c# if you want, but we won't be doing that with our React models. 
- Now go back to the code in your App.tx file and update some areas in your code to get type-safety. You will also need to import your interface into your App.tsx file in order to use it. 

```jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';
import { Activity } from "../models/Activity" // new code

function App() {
  const [activities, setActivities] = useState<Activity[]>([]) // new code

  useEffect(() => {
    axios.get<Activity>('http://localhost:5000/api/activities').then((response: any) => { // new code
      setActivities(response.data);
    })
  }, [])

  return (
    <div >
      <Header as='h2' icon='users' content='Reactivities' />
      <List>
        {activities.map((activity: Activity) => ( // added some code here. 
            <List.Item key={activity.id}>
                {activity.title} 
            </List.Item>
        ))}
      </List>
    </div>
  );
}
```
- Now when adding Activity here, you will have type safety 

</div>
</div><br/>



<div class="gradient">
	<h2 class="section__title" id="adding-a-nav-bar"><strong>Adding a Nav bar</strong></h2>
<div class="tblurb"  markdown=1>


Add new file to the layout folder called NavBar.tsx
The Container just adds padding for you

```jsx
import React from 'react';
import { Button, Container, Menu} from 'semantic-ui-react'

export default function NavBar() {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo"/>
                </Menu.Item>
                <Menu.Item name="Activities" />
                <Menu.Item>
                    <Button positive content="Create Activity" />
                </Menu.Item>
            </Container>
        </Menu>
    )
}
```
There are a few things to note here.
Inverted means the colors on the NavBar are switched or 'inverted'. 
There are some other properties that come free like fixed. 
For the button positive means the color will be green. 
Notice how some of the items have a closing bracket and no closing bracket. 
Now we need to add the code to our app.tsx file. 
Just remove the Header tab and add a self closing NavBar to it like the following 

```jsx 
return ( 
    <div>
        <NavBar />
        <List>
            ...
)
```

Now go to your running app and see if it is working. The NavBar doesn't look great right now, but it will 


### <strong>Adding some style to the nav bar</strong>

Right now our NavBar looks kind of bad. We are going to do a few things. First we are going to add a Margin between the log of the NavBar and Reactivities. Then, we are going to color the NavBar to have a cool fade effect on it. Finally, we are going to move the Activities away from the edge and under out logo part. First, we need to add our images to a brand new folder called assets in your public directory in your client-app folder. Just past all the images you need here. Now the img should work with our app. the images are on my github if you need them. If you don't have them, don't worry about it. 

### <strong>NavBar margin and fade</strong>

In order to change the margin, we will add styles the react way. Unlike in html, we will treat the css properties like objects. Thus, we will add <code class="code-style2">style=marginRight: '10px'</code> to our main code. 
{% raw %}
```jsx
export default function NavVar() {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities" />
                <Menu.Item>
                    <Button positive content="Create Activity" />
                <Menu.Item>
            </Container>
        </Menu>
```
{% endraw %}

We also want to apply a nice gray background and get the fade with our css. To do this we will clear out the styles.css file in the layout folder and delete everything. Then we will add styling for the body of our app. 

```css
body {
    background-color: #EAEAEA !important;
}

.ui.inverted.top.fixed.menu {
    background-image: linear-gradient(135deg, rgb(24,42,115) 0%, rgb(33,138,174) 69%, rgb(32,167,172)) !important;
}
```

The class targeting is very confusing for this. It seems to contain the all the properties our Menu. I think it would probably be a good thing to mess around with it to get a better idea of how the linear-gradient works, and how we are targeting the specific element we are trying to style. We put the important at the end to make sure that no styles are overriding these styles. 


</div>
</div><br/>

### <strong>Add padding to body and reorganize</strong>

<div class="tblurb">
<h3>Problems </h3>
<ul>
<li>The Margins are off.</li>
<li>We have an empty div for our App.tsx when we view it from our inspector around our List file.</li>
</ul>

<h3>Instructions</h3>

<ul>
<li>Add a Container component around our List component for padding in our App.tsx file. Add some style to it for padding</li>
<li>Erase the div element that surrounds all this and add a Framgment component or <></li>
<div  markdown=1 >

{% raw %}
```jsx
return (
    <>
        <NavBar />>
        <Container style={{marginTop: '7em'}}>
            <List> 
                {activities.map(activity => (
                    <List.Item key={activity.id}>
                        {activity.title}
                    </List.Iem>
                ))}
            </List>
        </Container>
    <>
)

```
{% endraw %}

</div>
</ul>
</div>

<br/>




### <strong>Creating an Activity dashboard</strong>

<div class="tblurb" markdown=1>
<h3>Problems </h3>
<ul>
<li>Create a new component called ActivityDashboard that will hold our activities List that we made earlier in our App.tsx</li>
<li><strong>Passing Props</strong></li>
</ul>

<h3>Instructions</h3>

<ul>
<li>Create a new folder in our features called activities and then another folder inside that folder called dashboard </li>
<li>Inside the activities folder create a new component called ActivityDashboard.tsx</li>
    <ul>
    <li>Notice the capitalization of the component and folder structure</li>
    </ul>
<li>Write out the basic template for the component
<div  markdown=1 >

```jsx
import React from 'react';

export default function ActivityDashboard() {
    return (

    )
}
```
</div>
</li>
<li>Add Grid component in order to make grids and then add a column with a width of '10'</li>
<li>Paste the List part of the App.tsx into the grid column part and delete the list from App.txs 


<div  markdown=1 >

```jsx
import React from 'react';
import {Grid, List} from 'semantic-ui-react';

export default function ActivityDashboard() {
    return (
        <Grid>
            <Grid.Column width="10">
                <List> 
                    {activities.map(activity => (
                        <List.Item key={activity.id}>
                            {activity.title}
                        </List.Iem>
                    ))}
                </List>
            </Grid.Column>
        </Grid>
    )
}
```
</div>


</li>
<li>Add the ActivityDashboard component to our App.txs file with activities as a property and holding the activities we get from State


<div  markdown=1 >

```jsx
return (
    <>
        <NavBar />
        <Container style=>
            <ActivityDashboard acitivities={activities}>
        </Container>
    <>
)
```
</div>
</li>
<li>We will get an error saying our ActivityDashboard does not have intrinsic properties for activities</li>
<li>To get rid of this we need to work with Props. Thus add a props interface to the ActivityDashboard file with an "activities: Activity[]" field</li>
<li>Add the destructed Prop object as a parameter to our ActivityDashboard component

<div  markdown=1 >

```jsx
import React from 'react';
import {Grid, List} from 'semantic-ui-react';
import {Activity} from '../../../app/models/activity';

interface Props {
    activities: Activity[];
}

export default function ActivityDashboard({activities}: Props) {
    return (
        <Grid>
            <Grid.Column width="10">
                <List> 
                    {activities.map(activity => (
                        <List.Item key={activity.id}>
                            {activity.title}
                        </List.Iem>
                    ))}
                </List>
            </Grid.Column>
        </Grid>
    )
}
```
</div>
</li>
</ul>
</div>
<br/>



## <Strong>Creating an activity list</strong>

<div class="tblurb">
<h3>Problems </h3>
<ul>
<li>We want to use the rest of our JSON values that we receive from our GET request</li>
<li>We want to replace List tag in the ActivityDashboard component with a card that contains all the items from our JSON and it looks nice</li>
<li><strong>Passing Props</strong></li>
</ul>

<h3>Instructions</h3>

<ul>
<li>Create a new component in the dashboard folder called ActivityList 
<div  markdown=1 >

{% raw %}
```jsx
import React from 'react';

export default function ActivityList(){
    return (

    )
}
```
{% endraw %}
</div>

</li>

<li>We are going to pass the props down another level, so we will need a props interface on the normal template that has activities
    <ul>
    <li>Notice the capitalization of the component and folder structure</li>
    </ul>

<div  markdown=1 >

{% raw %}
```jsx
import React from 'react';
import { Activity } from '../../../app/models/activity'

interface Props {
    activities: Activity[]
}

export default function ActivityList({activities}: Props){ // destructure the Props interfaces. It has type Props
    return (

    )
}
```
{% endraw %}
</div>


</li>

<li>The first component in this component will be a Segment component. Make sure to bring it in with SemantictUi. This will give us some padding and background color</li>
<li>We are going to be creating a card which is a Item.Group of items that will display each one of our activities very nicely</li>
<li>So in the Segment tag, add an Item.Group tag with a divided attribute that will add a horizontal line between each item</li>
<li>Now go ahead and map over the activities array and put each activity in an Item tag. Remember that React needs a unique key when iterating over items so make the key attribute equal to the activity.id
<div  markdown=1 >

{% raw %}
```jsx
import React from 'react';
import { Item, Segment } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'

interface Props {
    activities: Activity[]
}

export default function ActivityList({activities}: Props){ // destructure the Props interfaces. It has type Props
    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}
```
{% endraw %}
</div>


</li>
<li>Next we will make the content for the item tag. So go ahead and add an Item.Content tag</li>
<li>We are going to add an Item.Header tag, an Item.Meta tag, and an Item.Description tag that will have the information that we got from the API
   <ul>
        <li>The <code class="code-style2">as='a'</code> will make the header tag act as a link</li>
    </ul>
 
<div  markdown=1 >

{% raw %}
```jsx
import React from 'react';
import { Item, Segment } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'

interface Props {
    activities: Activity[]
}

export default function ActivityList({activities}: Props){ 
    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {actvity.venue}
                            </Item.Description>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}
```
{% endraw %}
</div>


</li>
<li>Add another tag below the Item.Description tag called Item.Extra</li>
<li>Now we are going to add a Button and Label. The button will be floated right. The name of the button will be "View" which is done by the contents attribute, and the color of the button will be blue. The label will be a basic label and the content (name of the item) will be the activity.category

<div  markdown=1 >

{% raw %}
```jsx
import React from 'react';
import { Item, Segment, Button, Label } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'

interface Props {
    activities: Activity[]
}

export default function ActivityList({activities}: Props){ 
    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {actvity.venue} </div>
                            </Item.Description>
                            <Item.Extra>
                                <Button floated='right' content='View' color='blue'>
                                <Label basic content={activity.category}>
                            </Item.Extra>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}
```
{% endraw %}
</div>


</li>
<li>Now go back to the ActivityDashboard.tsx file and delete everything between the Grid.Column component and then add the new ActivityList component that you made. Also, pat yourself on the back</li>
</ul>
</div>
<br/>






<div class="gradient">
	<h2 class="section__title" id="creating-a-details-view"><strong>Creating a details View</strong></h2>
<div class="tblurb"  markdown=1>

<h3>Problems </h3>
<ul>
<li>Create a details card next to our dashboard</li>
</ul>

<h3>Instructions</h3>
<ul>
<li>Create a new folder in the activities folder call details. This is where we will put a new component called ActivityDetails.tsx</li>
<li>Create a new template for it

<div markdown=1>

```jsx
import React from 'react';

export default function ActivityDetails(){

}
```
</div>

</li>
<li> We are going to be using the Card template from the website, so you can just go ahead and take the code from it which is the following. 

<div markdown=1>

```jsx
<Card>
    <Image src='/images/avatar/large/matthew.png' wrapped ui={false} />
    <Card.Content>
      <Card.Header>Matthew</Card.Header>
      <Card.Meta>
        <span className='date'>Joined in 2015</span>
      </Card.Meta>
      <Card.Description>
        Matthew is a musician living in Nashville.
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <a>
        <Icon name='user' />
        22 Friends
      </a>
    </Card.Content>
  </Card>
)
```

</div>


</li>
<li> Then we are going to change a bunch of properties and add a props interface in order to have the card pull correctly from our api 

<div markdown=1>

```jsx
import { Card, Icon, Image} from 'semantic-ui-react';
import { Activity} from '../../../app/models/activity';

interface Props {
    activity: Activity
}

export default function ActivityDetails({activity}: Props) {
    return (
        <Card fluid>
            <IMage src={'/assets/categoryImages/${activity.category}.jpg'}>
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button basic color='blue' content='Edit'>
                    <Button basic color='grey' content='Cancel'>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}
```

</div>
</li>
<li>Now we are going to add another Grid.Column to our ActivityDashboard

<div markdown=1>

```jsx
export default function ActivityDashboard({activities}: Props){
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities} />
            </Grid.Column>
            <Grid.Column width='6'>
                {activities[0] && 
                <ActivityDetails activity={activities[0]} />}
            </Grid.Column>
        </Grid>
    )
}
```

</div>

</li>
</ul>

<h3>Notes</h3>
There are few things that we have learned from this section. First, we learned we can just take code from the semantic-ui website and use it in our own app. This is always allowable. Sometimes, are person might now understand all the code that is inside a module, but it's good to abstract certain concepts out. A lot of the code is pretty self-explanatory luckily and the documentation is always there if you need it. We are once again using the deconstruction of the Props object in the function declaration. Try removing the keyword <code class="code-style2">fluid</code> in the Card part to see what it does. It just makes the details expand to a bigger size which is what we want. There is also the special back ticks used in the src of the Image tag that will allow us to use javascript in the string construction. We have to hard code <code class="code-style2">activities[0]</code> right now, but we will come back to this in the future. 


</div>
</div><br/>


<div class="gradient">
	<h2 class="section__title" id="creating-an-activity-from"><strong>Creating an Activity Form</strong></h2>
<div class="tblurb"  markdown=1>


### Problems 

- We want to create an activity form so that the user can edit the data for the Activity 

### Instructions 

- First we are going to create a new folder in the activities folder called form 
- Create a new file in that new folder called ActivityForm.tsx 
- We are creating a new component so we will need the following code. 

```jsx 
import React from 'react';
import {Button, Form, Segment } from 'semantic-ui-react';

export default function ActivityForm() {
    return (
        <Segment>
            <Form>
                <Form.Input placeholder='Title' />
                <Form.TextArea placeholder='Description' />
                <Form.Input placeholder='Category' />
                <Form.Input placeholder='Date' />
                <Form.Input placeholder='City' />
                <Form.Input placeholder='Venue' />
                <Button floated="right" positive type='submit' content="Submit" />
                <Button floated="right" type='button' content="Cancel" />
            </Form>
        </Segment>
    )
}
```
- Now add the ActivityForm component below the ActivityDetails component on the ActivityDashboard component. Remember that you will need to import the activity form too. 

```jsx
export default function ActivityDashboard({activities}: Props){
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities} />
            </Grid.Column>
            <Grid.Column width='6'>
                {activities[0] && 
                <ActivityDetails activity={activities[0]} />}
                <ActivityFrom /> 
            </Grid.Column>
        </Grid>
    )
}
```
- There is one problem and that is that our buttons have popped out of the segment. We can fix that by adding 'clearing to the top segment part 

```jsx
export default function Activity() {
    return (
        <Segment clearing>
```

</div>
</div><br/>



<div class="gradient">
	<h2 class="section__title" id="selecting-an-activity-to-view"><strong>Selecting an Activity to View</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- When we click view activity, it unfortunately does not work
- Working with passing functions and updating interfaces in typescript 

### Instructions 

- In our App.txs file we are going to create some new properties. Remember that App.txs is at the top so we can pass everything down from there. The state will be initially undefined because we don't have any activity chosen currently. Maybe another design would always chose the first activity, but what happens if you don't have any activities for a user. We will have to make sure that the UseState can be either an Activity or undefined. We can do this by using the \| operator.  

```jsx 
const [activities, setActivities] = use<Activity []>([]);
const [selectedActivity, setSelectedActivity] = useState<Activity | undefined >(undefined)
```

- Make two functions called handleSelectedActivity and handleCancelSelectActivity. We will pass these function as props to other components in our system. Remember that the state arrays included a setter function which is 'setSelectedActivity in this case and for a cancel one went want to set it as undefined. 

```jsx 
function handleSelectActivity(id: string ) {
    setSelectedActivity(activities.find(x => x.id === id))
}

function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
}
```

- See how we are passing activities into the 'handleSelectedActivity' function. It will take an id that we can use to find in our activities array. 
- Now let's pass these as props in our ActivityDashboard component. 

```jsx 
<ActivityDashboard
    activities={activities}
    selectedActivity={selectedActivity}
    selectActivity={handleSelectActivity}
    cancelSelectActivity={handleCancelSelectActivity}
    />
```

- Notice how we are passing the functions. We are not using the '()' parentheses version. You will get can error here because the props are not in our Dashboard interface. We need to go change that in our dashboard. 

```jsx
interface Props {
    activities: Activity[];
    selectedActivity: Activity;
    selectActivity: (id: string) => void; 
    cancelSelectActivity: () => void;
}
```

- Notice that for these props that we added a function type signature for two of them because we are passing a function. Now let's edit the Activity Dashboard component to pass these props. 

```jsx
export default function ActivityDashboard({activities, selectedActivity // new code
                selectActivity, cancelSelectActivity}: Props){
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities}
                              selectActivity={selectActivity} // new code
                              />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity &&   // new code
                <ActivityDetails activity={selectedActivity}  // new code
                                 cancelSelectActivity={cancelSelectActivity} // new code
                                 />} // new code
                <ActivityFrom /> 
            </Grid.Column>
        </Grid>
    )
}
```
- We will once again get a few errors, but for different components this time which are the ActivityList component and ActivityDetails component and we will need to edit their interfaces. We will start with the ActivityList component. We can press f12 to get to that component. It will have the same signature we gave it in the ActivityDashboard

```jsx
// For ActivityList
interface Props {
    activities: Activity[];
    selectActivity: (id: string) => void; 
}
```

- We can use the selectActivity now in the ActivityList component. We are going to deconstruct it in the function parameters and then add it to a button for a onClick event so that by clicking the button we can set the activity. 

```jsx
export default function ActivityList({activities, selectActivity }: Props){  // added new code here
    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {actvity.venue} </div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => selectActivity(activity.id)} floated='right' content='View' color='blue'> // added new code here
                                <Label basic content={activity.category}>
                            </Item.Extra>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}
```

- Notice that for the button we had to wrap the function into an arrow function with now argument. This is because if we hadn't done that, the function would have been called on being rendered. Make sure that whenever you do this that your function are being called on render. 

- Now, let's fix the ActivityDetails component. First we need to fix the interface for it. 

```jsx
interface Props {
    activity: Activity;
    cancelSelectActivity: () => void; // new code
}
```

- Now let's add the onclick to the main part of the code in the ActivityDashboard component. 


```jsx

export default function ActivityDetails({activity}: Props) {
    return (
        <Card fluid>
            <IMage src={'/assets/categoryImages/${activity.category}.jpg'}>
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button basic color='blue' content='Edit'>
                    <Button onClick={cancelSelectActivity} basic color='grey' content='Cancel'> // new code
                </Button.Group>
            </Card.Content>
        </Card>
    )
}
```

- We don't need to use the parentheses here because we don't have any parameters. It will not execute the function on being rendered. 
- Still when we try to run the app, we will not have a working app. This is because we have a type problem in our ActivityDashboard component. We need to change the interface to be able to handle undefined. 


```jsx
interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined; // new code
    selectActivity: (id: string) => void; 
    cancelSelectActivity: () => void;
}
```


</div>
</div><br/>



<div class="gradient">
	<h2 class="section__title" id="displaying-the-create-edit-form"><strong>Displaying the Create/Edit Form</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- Open a blank fill-in Activity form when we click the Create Activity button on the NavBar
- When we click edit on the Activity view, we want to close the activity view and just have the fill-in form 

### Instructions

- Start in the App.tsx component and add the following new state and handlers 

```jsx 
const [editMode, setEditMode] = useState(false);  // new code

function handleSelectActivity(id: string ) {
    setSelectedActivity(activities.find(x => x.id === id))
}

function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
}

function handleFormOpen(id?: string){ // new code
    id ? handleSelectActivity(id) : handleCancelSelectActivity(); 
    setEditMode(true)
}

function handleFormClose() {
    setEditMode(false)
}
```

- We don't need to say the type for the new state variable because it is inferred by our type system. 
- The 'handleFormOpen' function will set our Activity state variable if there is an id, but if there isn't we will set our state variable to undefined. If it is already undefined then we are just setting it to undefined again. 
- Now we are going to pass the 'handleFormOpen', 'handleFormClose', and the 'editMode' state down to our Activity Dashboard. This will make it so that we need to update our interface in it. 

```jsx 
<ActivityDashboard
    activities={activities}
    selectedActivity={selectedActivity}
    selectActivity={handleSelectActivity}
    cancelSelectActivity={handleCancelSelectActivity}
    editMode={editMode} // new code
    openForm={handFormOpen} // new code
    closeForm={handleFormClose}
    /> // new code
```

- We will get some errors telling us that we need to edit the interface in the ActivityDashboard component. Let's add our new props to the ActivityDashboard interface and to the function parameters. We don't need to make the id in the openfrom function undefined because we will expect and id always. This part confuses me a little bit. 


```jsx
// ActivityDashboard
interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void; 
    cancelSelectActivity: () => void;
    editMode: boolean; // new code 
    openForm: (id: string) => void; // new code
    closeForm: () => void; // new code

}

export default function ActivityDashboard({activities, selectedActivity, 
        selectActivity, cancelSelectActivity, editMode, openForm, closeForm}: Props) { // new code
```

- Now we are going to pass our props once again down to the 'ActivityDetails' component and the 'ActivityForm' component


```jsx
// From ActivityDashboard
export default function ActivityDashboard({activities, selectedActivity 
                selectActivity, cancelSelectActivity, editMOde, openForm, closeForm}: Props){
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities}
                              selectActivity={selectActivity} 
                              />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity &&   
                <ActivityDetails activity={selectedActivity} 
                                 cancelSelectActivity={cancelSelectActivity} 
                                 openForm={openForm} // new code
                                 />} 
                {editMode  && // new code
                <ActivityFrom closeForm={closeForm} actvity={SelectedActivity}/>}  // new code
            </Grid.Column>
        </Grid>
    )
}
```

- The ActivityDetails component interface and the ActivityForm interface will need to be edited for our new props 

```jsx 
// From ActivityDetails

interface Props {
    activity: Activity;
    cancelSelectActivity: () => void; 
    openForm: (id: string) => void; // new code
}

export default function ActivityDetails({activity, cancelSelectActivity, openForm}: Props) { // new code
```

- Now that we have access to the openForm from the top level, we can use it. 

```jsx
// From ActivityDetails
export default function ActivityDetails({activity, cancelSelectActivity, openForm}: Props) {
    return (
        <Card fluid>
            <IMage src={'/assets/categoryImages/${activity.category}.jpg'}>
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button onClick={() => openForm(activity.id)} basic color='blue' content='Edit'> // new code
                    <Button onClick={cancelSelectActivity} basic color='grey' content='Cancel'>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}
```

- Right now, all we have done so far is make it so that our edit button will open up a form when the edit button on the ActivityDetails form is pressed. The behavior that we want is for the ActivityDetails form to also close when we press the edit button. 
- But before we do that, we will fix the other problems with the props for the ActivityForm. We need to create an interface in that component. 

```jsx
// From ActivityForm
interface Props = {
    activity: Activity | undefined 
    closeForm: () => void;
}

export default function ActivityForm({activity, closeForm}: Props) { 
```

- The activity prop can be undefined, which was stated in the previous section in this tutorial. 
- Let's move our focus to the button on the NavBar for creating and Activity


```jsx 
// Form App.tx 

<NavBar openForm={handleFormOpen}>
```
- Now we need to add another interface to our 'NavBar' component and the appropriate parameters

{% raw %}
```jsx 
// From NavBar.tsx 
interface Props {
    openForm: () => void;
}

export default function NavBar({openForm}: Props) {
    return (
        <Menu inverted fixed ='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}>
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities'/>
                <Menu.Item >
                    <Button onClick{openFrom} positive content='Create Activity'>
                </Menu.Item>
            </Container>
        </Menu>
    )
}
```
{% endraw %}

- If we try to run the app right now, It won't exactly work because we still have some stuff to do. 
- Let's go to the ActivityForm because we haven't added all the props. 


```jsx 
// From ActivityFrom
export default function ActivityForm({activity, closeForm }) {
    return (
        <Segment>
            <Form>
                <Form.Input placeholder='Title' />
                <Form.TextArea placeholder='Description' />
                <Form.Input placeholder='Category' />
                <Form.Input placeholder='Date' />
                <Form.Input placeholder='City' />
                <Form.Input placeholder='Venue' />
                <Button floated="right" positive type='submit' content="Submit" />
                <Button onClick={closeForm} floated="right" type='button' content="Cancel" /> // new code
            </Form>
        </Segment>
    )
}
```

- The above will fix the cancel button not working, now we want to fix the view staying open when we press the edit button. To fix this, we need to go to the ActivityDashboard activity 


```jsx
// From ActivityDashboard
export default function ActivityDashboard({activities, selectedActivity 
                selectActivity, cancelSelectActivity, editMOde, openForm, closeForm}: Props){
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities}
                              selectActivity={selectActivity} 
                              />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity &&  !editMode &&
                <ActivityDetails activity={selectedActivity} 
                                 cancelSelectActivity={cancelSelectActivity} 
                                 openForm={openForm} // new code
                                 />} 
                {editMode  && // new code
                <ActivityFrom closeForm={closeForm} actvity={SelectedActivity}/>}  // new code
            </Grid.Column>
        </Grid>
    )
}
```

</div>
</div><br/>



<div class="gradient">
	<h2 class="section__title" id="editing-an-activity-and-form-basics-in-react"><strong>Editing an Activity and Formm Basics in React</strong></h2>
<div class="tblurb"  markdown=1>

### Problem 

- When form right now is only updating the html DOM, and not actually react state
- Working with state in a downstream component.
- Using an Alias for a a variable in React 

### Instructions 

- Add a new initial state in our form component. It will test for whether it got an activity with data passed in as a prop from a parent component. If the activity is null then we will put create an initial state. The '??' means 'if null use this'

```jsx
// from ActivityForm
export default function ActivityForm({activity, closeForm}: Props ){
    
    const initialState = activity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }
}
```

- Add a variable below that which will be an activity state variable. Our state will change for the activity when a user types in to the form. This is why we need a state variable. It will be just like adding a state variable to the App.tsx file. 

```jsx 
// From ActivityForm

const [activity, setActivity] = useState(initialState) // Notice that we are using the initial state to set up our activity state

return (
    
```

- An error will now occur because we are getting a new prop variable labeled 'activity' and we are creating a state variable called 'activity'. React doesn't know which one is which, so we will have to use a new feature we haven't learned before which is using an alias. We will name the prop variable that we got from the parent component as 'selectedActivity'. 


```jsx
// from ActivityForm
export default function ActivityForm({activity: selectedActivity, closeForm}: Props ){ // new code
    
    const initialState = selectedActivity ?? { // new code
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }
}
```

- Let's add two new handlers so tha we can finally update the state in react and not have it just updating and html dom element. The two handlers will be 'handleOnSubmit' and 'handleOnChange'. The 'handleOnSubmit' will go on the main Form component , but right now we will not write the full implementation. We will just use a console.log. The 'handleOnSubmit', we will write the full implementation.

```jsx 
// From ActivityForm 
import React, { ChangeEvent, useState } from 'react'; // new code 
... // just eliding some code here

export default function ActivityForm({activity: selectedActivity, closeForm}: Props ){
    
    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }
const [activity, setActivity] = useState(initialState)

function handleSubmit() {  // new function
    console.log(activity)
}

function handleInputChange(event: ChangeEvent<HTMLInputElement>) { // new function
    const {name, value} = event.target
    setActivity({...activity, [name]: value}) // this is just the spread operator so that we can target certain properties on the activity object
}



return (
    <Segment>
        <Form onSubmit={handleSubmit} > // new code
            <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />  // new code
            <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/> // new code
            <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/> // new code
            <Form.Input placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/> // new code
            <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/> // new code
            <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/> // new code
            <Button floated="right" positive type='submit' content="Submit" />
            <Button onClick={closeForm} floated="right" type='button' content="Cancel" /> // new code
        </Form>
    </Segment>
)
```
- Notice that we are using the fields name and value on the different From elements. The value is what should be in the input boxes. We are also using the spread operator in the 'handleInputChange' function which is just an easy way of changing properties on a certain object. 

- Everything is pretty much done except that we need to change the type of our function 'handleInputChange`. This is because one of our values is a different type. We need to change the HTMLInputElement an or type with HTMLTextAreaElement

```jsx 
function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) { // new function
    const {name, value} = event.target
    setActivity({...activity, [name]: value}) 
}

```


` Now test out the code to make sure you don't have any errors

</div>
</div><br/>


<div class="gradient">
	<h2 class="section__title" id="handle-create-and-edit-form-submissions"><strong>Handle Create and Edit Submissions</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- The current 'handleOnSubmit function is just a console.log function and doesn't actually update our react dom. 
- Create a function that will update our dom and allow us to edit the activities 

### Instructions 

- In the App.tsx file create a new handler function called 'HandleCreateOrEditActivity' below the other activities. This is quite a lot and we will be changing it shortly, but for now, we will use this. 

```jsx 
// From App.tsx 

function handleCreateOrEditActivity(activity: Activity){ // This function will be used with on Submit
    // check if we have an activity id
    activity.id 
        ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
        : setActivities([...activities, activity])
    setEditMode(false); // we are done editing the activity so we can turn off edit mode
    setSelectedActivity(actvity) // set current activityDetails to this activity
}
```

- The spread operator (...) is a little confusing. I will give an example to help better understand it. Let's say we had the following terminal session in the browser

```jsx 
> let activities = [{id : 1, a:1}, {id :2, a :2}, {id : 3, a : 1}, {id :4, a : 2}]
> let activity = {id: 4, a: 1000}

> let filteredActivities = activities.filter(x => x.id !== activity.id)
< [{id : 1, a:1}, {id :2, a :2}, {id : 3, a : 1}]
// notice it is a way of getting rid of the id that matches the activity id. So now are array doesn't have an element with that id 

> [...activities.filter(x => x.id !== activity.id), activity]
< [{id : 1, a:1}, {id :2, a :2}, {id : 3, a : 1}, {id :4, a : 1000}]
// you can see that the operation just changed the element with id 4 to be included on the array and it removed the old element with id 4
```

- Pass down the function all the way to our ActivityForm.tsx

```jsx
// From App.tsx 
<ActivityDashboard
    activities={activities}
    selectedActivity={selectedActivity}
    selectActivity={handleSelectActivity}
    cancelSelectActivity={handleCancelSelectActivity}
    editMode={editMode} 
    openForm={handFormOpen} 
    closeForm={handleFormClose}
    createOrEdit={handleCreateOrEditActivity}
    /> 

```

- Now edit the Activity Dashboard interface 

```jsx 
// ActivityDashboard
interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void; 
    cancelSelectActivity: () => void;
    editMode: boolean; 
    openForm: (id: string) => void; 
    closeForm: () => void; 
    createOrEdit: (activity: Activity) => void // new code

}


export default function ActivityDashboard({activities, selectedActivity 
                selectActivity, cancelSelectActivity, editMOde, openForm, closeForm, createOrEdit}: Props){ // new code
    return (
        ... // eliding code
                <ActivityFrom closeForm={closeForm} actvity={SelectedActivity} createOrEdit={createOrEdit}/>}  // new code
            </Grid.Column>
        </Grid>
    )
}
```

- Now let's go edit the Activity Form to have this function 

```jsx 
interface Props {
    activity: Activity | undefined 
    closeForm: () => void; 
    createOrEdit: (activity: Activity) => void 
}


... // eliding code 

export default function ActivityForm({activity, selectedActivity, closeform, createOrEdit}: Props ){

    ... //eliding code 

    function hadnledSubmit(){
        createOrEdit(activity)
    }
```

- Now test out the code. 

### Future Problems 

- When we edit an Activity, it goes to the bottom of the page. 
- The name is horrible and we aren't actually connected to our backend to make changes yet. 

</div>
</div><br/>





<div class="gradient">
	<h2 class="section__title" id="using-a-guid-from-the-activity-id"><strong>Using a GUID From the Activity Id</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- Delete unused imports. There are quite a lot of files that we have changed and added parts in new places, so not the imports aren't used. 
- Install uuid which will give us unique ids on the client side. 
- uuid doesn't come out of the box with typescript, so we need to install the typescript types with uuid. 
- Add the uuid to the components. 

### Instruction

- In App.txs, delete the unused Header and List imports 
- In ActivityDashboard.tsx, delete the unused List import 
- In ActivityDetails.tsx, delete the unused Icon import 
- Using <code class="code-style2">npm install uuid</code> install uuid. 
- For App.tsx, add the uuid import 

```jsx 
import {v4 as uuid} from uuid; 
```

- We are going to get an error because we need to install the typescript types for uuid. To install run the command that it tells you to run when you hover over the problem, which is <code class="code-style2">npm i --save-dev @types/uuid</code>
-Now, to the handleCreateOrEditActivity in the App.tsx file, add the following code 

```jsx
function handleCreateOrEditActivity(activity: Activity){
    activity.id 
        ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
        : setActivities([...activities, {...activity, id: uuid()}]);
    setEditMode(false);
    setSelectedActivity(activity);
}
```



</div>
</div><br/>



<div class="gradient">
	<h2 class="section__title" id="deleting-an-activity"><strong>Deleting an Activity</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- Create the delete functionality on the client side for getting rid of views

### Instructions 

- In the App.tsx file create a new function called handleDeleteActivity below the other handlers in App.tsx

```jsx
// App.tsx
function handleDeleteActivity(id: string){
    setActivities([...activities.filter(x => x.id !== id)])
}
```

- The function uses the spread operator and is just filtering out the id that we are deleting. We are going to want to pass the function all the way down to the ActivityList.tsx file. Thus, we need to do everything we have been doing before. 

- Add the function as a Prop on the ActivityDashboard componenet 

```jsx
// From App.tsx 
<ActivityDashboard
    activities={activities}
    selectedActivity={selectedActivity}
    selectActivity={handleSelectActivity}
    cancelSelectActivity={handleCancelSelectActivity}
    editMode={editMode} 
    openForm={handFormOpen} 
    closeForm={handleFormClose}
    createOrEdit={handleCreateOrEditActivity}
    deleteActivity={handleDeleteActivity} // new code
    /> 

```

- Now go to the dashboard component and add it as a prop. This will require you to change the interface, the parameters and then passing into the ActivityList component. 

```jsx 
// ActivityDashboard
interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void; 
    cancelSelectActivity: () => void;
    editMode: boolean; 
    openForm: (id: string) => void; 
    closeForm: () => void; 
    createOrEdit: (activity: Activity) => void 
    deleteActivity: (id: string) => void;
}


export default function ActivityDashboard({activities, selectedActivity, deleteActivity // new code
                selectActivity, cancelSelectActivity, editMOde, openForm, closeForm, createOrEdit}: Props){ 
    return (
            <Grid.Column width='10'>
                <ActivityList 
                    activities={activities} 
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity} // new code
                    />
            </Grid.Column>
            ... // eliding code
     
}
```

- Now go to our ActivityList and add the new deleteActivity 

```jsx
// ActivityList
interface Props {
    activities: Activity[]; 
    selectActivity: (id: string ) => void;
    deleteActivity: (id: string) => void; // new code
}

export default function ActivityList({activities, selectActivity, deleteActivity}): Props){ // new code
```

- Now go and add a new button. We can just copy the button down, and then edit a few of the properties 

```jsx 
  <Button onClick={() => selectActivity(activity.id)} floated='right' content='View' color='blue'> 
  <Button onClick={() => deleteActivity(activity.id)} floated='right' content='Delete' color='red'> // added new code here
```

</div>
</div><br/>





<div class="gradient">
	<h2 class="section__title" id="template"><strong>Template</strong></h2>
<div class="tblurb"  markdown=1>



</div>
</div><br/>














