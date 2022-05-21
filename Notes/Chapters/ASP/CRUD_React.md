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



## <strong>Introduction</strong>
Take a look at our folder structure
    -Way to structure our code to give it organization
Look at TypeScript interfaces 
    -Look at using interfaces to give us all the necessary stuff for typescript
Semantic UI Components 
    -Add styling and laying stuff out
Basic forms in React 
    -How to use form in react with oneway binding 

## <strong>Folder structure in React</strong>

How do we organize our folder structure in React 
reactjs.org/docs/faq-structure.html
Don't overthink 
Avoid too much nesting 
We are doing features option 
create a folder structure as follows 
in the src folder for the client-app 
create an app folder and a feature folder 
in the app folder create a layout folder.
app folder for all crosscutting concerns 
features folder for all of our features we build 
Move the App.tsx file into the layouts folder. 
An option will pop up. You want to chose always update imports. 
Move index.css into the layouts folder, and change the name to styles.css 
This will be our global style sheet for all of our styles 
Remove App.css, App.tests.tsx and logo.svg
fix the imports in index.tsx for the style sheet. 
Remove the logo import from the App.txs file 
Remove the app.css from the app.tsx file. 
Check for errors and make sure the activities are still be displayed. 
its called layout folder 


## <strong>Adding an Activity interface</strong>
Go to localhost:5000/swagger/index.html to see your endpoints.
In the app folder create a new folder called models 
Now create a file called Activity.ts which will be an interface 
You can copy the json from the swagger and put it into jsontots.com and get back and interface. 

```ts 
export interface Activity {
    id: string; 
    title: string; 
    date: string; 
    descritpion: stirng; 
    category: string;
    city: string; 
    venue: string; 
}
```

You could call it IActivity.ts and go from the standards of c# if you want. 
Now go back to the code in your App.tx file and update some areas in your code to get typesafety 

```js
const [activities, setActivities] = useState<Activity[]>([]); 

useEffect(() => {
    axios.get<Activity>('http://localhost:500/api/activities').then( response => {
        setActivities(response.data)
    })
})

return (
    <div>
        <Header as='h2' icon='user' content='Reactivities' />

        <List> 
        {activities.map(activity -> (
            <List.Item key={activity.id}>
                {activity.title}
            </List.Item>
        ))}
)
```

Now when adding Activity here, you will have type safety 

## <strong>Adding a Nav bar</strong>

Add new file to the layout folder called NavBar.tsx

```js
import React from 'react';
import { Button, Container, Menu} from 'semantic-ui-react'

export default function NavVar() {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo">
                </Menu.Item>
                <Menu.Item name="Activities" />
                <Menu.Item>
                    <Button positive content="Create Activity" />
                <Menu.Item>
            </Container>
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

```js 
return ( 
    <div>
        <NavBar />
        <List>
            ...
)
```

Now go to your running app and see if it is working. The NavBar doesn't look great right now, but it will 


## <strong>Adding some style to the nav bar</strong>

Right now our NavBar looks kind of bad. We are going to do a few things. First we are going to add a Margin between the log of the NavBar and Reactivities. Then, we are going ot color the NavBar to have a cool fade effect on it. Finally, we are going to move the Activities away from the edge and under out logo part. 

### <strong>NavBar margin and fade</strong>

In order to change the margin, we will add styles the react way. Unlike in html, we will treat the css properties like objects. Thus, we will add <code class="code-style2">style={{marginRight: '10px'}}</code> to our main code. 
```js 
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
```
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