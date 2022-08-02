---
layout: post
category: notes
image: /Notes/assets/images/dotnet.png
summary: Hooking up our client app with the Server using Axios
date: 2022-07-11
author: Nathan Swindall
---

<link rel="stylesheet" href="/blog-tech/assets/markdown.css">

## Table of Contents 

- [Introduction](#introduction)
- [Setting Up Axios](#setting-up-axios)
- [Axios Types](#axios-types)
- [Adding Loading Indicators](#adding-loading-indicators)
- [Posting Data to the Server](#posting-data-to-the-server)
- [Deleting Activity on the Server](#deleting-activity-on-the-server)


<div class="gradient">
	<h2 class="section__title" id="introduction"><strong>Introduction</strong></h2>
<div class="tblurb"  markdown=1>

In this section we are going to be adding quite a few different functionalities. 

- <strong>Configure Axios</strong>
    - We are going to make it so that we have some default settings when working with our api enpoints. Instead of having to type out all the endpoints, we will use certain defaults. 
- <strong>Using Generic Types</strong>
    - Generic types will help us to not have to go so deep in every return object. It will make our request easier to deal with 
- <strong>Using Axios Interceptors </strong>
    - The application is too fast, thus in order to look at interceptors, we will add delays that will help us add functionality when a request is made and received. This will help us setting up loading features. 
- <strong>Hooking up all our requests to the API </strong>
    - Using all the endpoints that we made earlier in order to have the data persist. 

</div>
</div><br/>


<div class="gradient">
	<h2 class="section__title" id="setting-up-axios"><strong>Setting Up Axios</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- We don't want to make all the different requests in many different components. We want to decouple our requests and abstract them away into a centralized location. 
- In order to do this, we will make a file where we can export these different requests. 

### Instruction

- In our client-app folder in the src/app folder we will make a new folder called 'api'
- In this folder, make a new file called agent.ts 
- We are going to first import axios and then add a default base url to the axios object. We will hard code it now, but later we will change this, so that we can actually use the app on the actual web. 

```jsx 
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api'
```

- If you noticed in our original code below, we are actually getting the 'response.data' from the axios request. 

```jsx 
useEffect(() => {
    axios.get<Activity>('http://localhost:5000/api/activities').then((response: any) => {
      setActivities(response.data);
    })
  }, [])
```

- Let's add code to get this to make it less cumbersome getting the data. 

```jsx 
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api'

const responseBody = (response: AxiosResponse) => response.data

```

- Now let's add all of our requests to an object called requests, that we can use to fire off a request and then make can Activities object to make a get request to activities. After this will be the agent object with the Activities request we just made which we will export. I know this seems like a lot, but it will be more understandable with code. 

```jsx 
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api'

const responseBody = (response: AxiosResponse) => response.data

const requests = {
	get: (url: string) => axios.get(url).then(responseBody),
	post: (url: string, body: {}) => axios.post(url, body).then(responseBody), // remember that for a post we are sending out data
	put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
	del: (url: string) => axios.delete(url).then(responseBody),
}


const Activities = {
	list: () => requests.get('/activities') // notice we don't need the whole url because we set the base url on the axios object
}

const agent = {
	Activities
}

export default agent; // we are exporting just the agent object

```

- Now let's hook this new centralized requests location up to our App.tsx component to make sure everything works properly. We can delete the axios import in this App.tsx file now that we have abstracted it away. 

```jsx 
// from App.tsx 
import agent from '../api/agent';

	... // elided code 


	useEffect(() => {
    	agent.Activities.list().then( response => {
      setActivities(response);
    })
  }, [])


```
- Make sure that we still get our Activities in our app after changing the above. 



</div>
</div><br/>

<div class="gradient">
	<h2 class="section__title" id="axios-types"><strong>Axios Types</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- When we are using the agent in our App.tsx file, we don't have any type safety unfortunately. We need to add type safety. 
- The current date we are getting back from out response is a string with some unnecessary information. We want to clip off this unnecessary information. 

### Instruction

- The first thing we are going to do is make our requests generic. In order to make something be able to use generics `<T>`, we need to add this generic marker to the beginning of our functions, and to the part that we want to be generic. See the code as follows. 

{% raw %}

```jsx
// from agent.ts
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api'

const responseBody = <T> (response: AxiosResponse<T>) => response.data; // notice it is at the beginning

const requests = {
	get: <T> (url: string) => axios.get(url).then(responseBody), // new code
	post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody), // new code
	put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody), // new code
	del: <T> (url: string) => axios.delete<T>(url).then(responseBody), // new code
}

const Activities = {
	list: () => requests.get<Activity[]>('/activities') // new code
}
```
{% endraw %}

- Now we have the type safety in place and if we go an hover over our App.tsx file, we can see that we have the type safety now. 
- The next problem we have is with the date. First, go to the ActivityForm.tsx and change the date form input to have type date on it. 

```jsx 
// from ActivityForm.tsx 

<Form.Input type='date' placeholder='Date' value ={activity.date} name='date' onChange ... // code elided
```

- Currently the date format that we are using looks like a string like '2020-09-30T13:44:08.311074'. If we go and look at the network tab in the developers tools and pull up the activities requests, we can see that this is the case. 
- We want to eliminate this information after the main yyyy/mm/dd date. In order to do this we will edit the response after receiving it. 

```jsx 
// from App.tsx 
import agent from '../api/agent';

	... // elided code 


	useEffect(() => {
    	agent.Activities.list().then( response => {
			let activities: Activity [] = []; // create an empty activities list to store the activities with the updated date
			response.forEach(activity => {
				activity.date = activity.date.split('T')[0]; // take the first object of the split by 'T' which will be the date we want. 
				activities.push(activity);
			})
      setActivities(activities);
    })
  }, [])


```

</div>
</div><br/>

<div class="gradient">
	<h2 class="section__title" id="adding-loading-indicators"><strong>Adding Loading Indicators</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- The page loads too fast which is unrealistic. We are going to simulate loading data from a server by using a sleep function, and then using semanitc-UI's dimmer and loading components. 
- This will require using promises and the update async/await syntax and axios interceptors

### Instruction

- The first thing are going to do is create a sleep function and an interceptor for our response object. The interceptor will be a function we run before getting any response back. We will first create a sleep function and then run this sleep function before getting our response. All this will be done in our agent file

```jsx 
// agent.ts 

import { Activity } from '../models/activity';

const sleep = (delay: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, delay)
	})
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(response => {
	return sleep(1000).then(() => {
		return response;
	}).catch((error) => {
		cnsole.log(error);
		return Promise.reject(error)
	})
})
```

- We can covnert the interceptor function to an async await function too 

```jsx
axios.intercetpors.response.use(async response => {
	try {
		await sleep(1000);
		return response
	} catch (error) {
		console.log(error);
		return await Promise.reject(error)
	}
})
```

- In the folder structure, we are going to create a new loading component. so in the layout folder in your app, create a new component called LoadingComponent. The put the following code in it. 

```jsx
import React from 'react';

interface Props {
	inverted?: boolean; // because we are setting as default
	content?: string; // because we are setting as default
}

export default function LoadingComponent({inverted = true, content = "Loading ..."}: Props ){
	return (
		<Dimmer active={true} inverted={inverted}>
			<Loader content={content} />
		</Dimmer>
}
```

-- Now go back to your App.tsx and add a new state variable for the loading component. 

```jsx 
// From App.tsx 
const [editMode, setEditMode] = useState(false);
const [Loading , setLoading] = useState(true); // new code

useEffect(() => {
	... // elided code 
	setActivities(activities);
	setLoading(false); // new code: When we finish loading the activities we turn of false
})

	... // eliding code 
function handleDeleteActivity ... // elided function 

if (loading) return <LoadingComponent content='Loading app'>

return ( ... //elided code

```

- Now go and test out the loading component in your app


</div>
</div><br/>

<div class="gradient">
	<h2 class="section__title" id="posting-data-to-the-server"><strong>Posting Data to the Server</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- Update the create and edit button to work with out api 
- Add loading when we submit the button to the Server.

### Instruction

- In the agent.ts file, add the following axios requests to your Activities object. 

```jsx 
// agent.ts 
const Activities = {
	list: () => requests.get<Acitvity[]>('/activities/'),
	details: (id: string) => requests.get<Activity>(`/activities/${id}`),
	create: (activity: Activity) => requests.post<void>('/activities', activity),
	update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`,activity)
	delete: (id: string) => axios.delete<void>(`/activities/${id}`)
}

```
- The strange part about the above code is that we don't use 'requests' with the delete and update, but axios, which kind of overrides some of the code we have written. 


- Next, in the App.tsx file, we are going to create a new state variable called submitting, and set it to false initially because we aren't submitting anything. 

- Then we are going to rewrite the handleCreateOrEditActivity handler to include the two different handler conditions with our new submit state variable.

- Finally, make sure to pass this submitting state variable to the ActivityDashboard

```jsx 
// From App.tsx 
const [ loading, setLoading ] = useState(true);
const [ submitting, setSubmitting] = useState(false);  // new state

... //elided code

function handleCreateOrEditActivity(activity: Activity){
	setSubmitting(true); // new code: we are making a new submission
	// if id, then we update this is specific activity
	if(activity.id){
		agent.Activities.update(activity).then(() => {
			setActivities([...activities.filter(x => x.id !== activity.id, activity]) // new code: filters out our activities from update activities and then adds the new activity
			setSelectedActivity(activity) // set new activity to the one just updated
			setEditMode(false) // we are done editing
			setSubmitting(false) // we are done submitting
		})
	// if no id, we have to create a new activity in the database with a new uuid
	} else {
		activity.id = uuid(); // create new id for the created activity
		agent.Activities.create(activity).then(() => {
			setActivities([...activities, activity])
			setSelectedActivity(activity)
			setEditMode(false);
			setSubmitting(false)
		})
	}


	... // elided code
		<ActivityDashboard
		... // elided code
		deleteActivity={handleDeleteActivity}
		submitting=(submitting)
		>
}

```

- Now let's pass the submitting down through our ActivityDashboard component to the activityForm component.

- Add the submitting variable to our interface 

```jsx 
// Activity Dashboard 
submitting: boolean;

... // elided code 
export default function ActivityDashboard(activities, selectedActivity, deleteActivity,
		selecteActivity, cancelActivity, editMode, openForm,
		closeForm, createOrEdit, submitting)

... // elided code 
<ActivityFrom 
	closeForm={closeForm}
	activity={selectedActivity}
	createOrEdit={createOrEdit}
	submitting={submitting}
>
```

- Now in ActivityForm component, go ahead an add submitting to the interface, the parameter list. 
- Then add submitting to the submit button 

```jsx 
// ActivityForm 

<Button loading={submitting} floated='right' positive type='submit' content='Submit'>
```

- Now test out the code



</div>
</div><br/>

<div class="gradient">
	<h2 class="section__title" id="deleting-activity-on-the-server"><strong>Deleting Activity on the Serve</strong></h2>
<div class="tblurb"  markdown=1>

### Problems 

- Fix the delete handler to take into account our actual backend delete endpoint 
- Make sure to pass submitting down to ActivityList and hook it up to the button 
- Fix the bug with all the delete buttons having a loading icon when we delete an activity

### Instruction

- In our App.tsx file we are going to add the delete endpoint code to our handler. 

```jsx
// handleDeleteActivity
function handleDeleteActivity(id: string){
	setSubmitting(true);
	agent.Activities.delete(id).then(() => {
		setActivities([...activities.filter(x => x.id !== id)])
		setSubmitting(false);
	})
}
```

- The spread syntax is a little confusing, as filter returns a new array. Thus, why should we wrap the array in the spread operator ([...])
- Here is an example of a console application below. They both seem to return an array. 

```js

let arr = [{a: 1}, {a: 2}, {a: 3}, {a: 5}]
arr.filter(x => x.a !== 2)
// (3) [{…}, {…}, {…}]

[...arr.filter(x => x.a !== 1)]
// (3) [{…}, {…}, {…}]
```

- We are already passing the submitting down to the ActivityDashboard, but now go to the ActivityDashboard file and pass the submitting variable through the ActivityList. 

```jsx
// ActivityDashboard.tsx
<ActivityList activities={activities}
	selectActivity={selectActivity}
	deleteActivity={deleteActivity}
	submitting={submitting}
	/>
```

- Now make sure to add the submitting type to the Props type in the ActivityList.tsx file

```jsx
// from activityList
interface Props {
	activities: Activity[];
	selectActivity: (id: string) => void; 
	deleteActivity: (id: string) => void;
	submitting: bolean;
}
```

- We have been this process a million times, but now add submitting to the parameter list in the ActivityList.tsx file 

```jsx 
// ActivityList
export default function ActivityList({activities, selectActivity, deleteActivity, submitting}: Props) {
```

- Next let's add the submitting variable to the delete button

```jsx
// ActivityList
<Button loading={submitting} onClick={() => deleteActivity(activity.id)} .... 
```

- Now let us go and test out the delete button. You will notice that there is a huge problem when we try it out. The loading component is used for all the delete buttons and not the button we want it for. How do we fix this? Well, there is an easy way to fix it. We just have to make the button unique. 
- First we will add a state variable for the ActivityList.tsx file and create a new handler function for the deleting an activity

```jsx 
// ActivityList
export default function ActivityList({activities, selectActivity, deleteActivity, submitting}: Props) {
	const [target, setTarget] = useState(''); // set the state to empty

	function handleActivityDelete(e: any, id: string){
		setTarget(e.target.name);
		deleteActivity(id);
	}
	
```

- Next, we will give our button a name, so that every button has a unique name. The best name we could give our button is the Activity.id because no activity has the same id. 

```jsx 
// ActivityList 
<Button
	name={activity.id} // new 
	loading={submitting} // we added this earlier 
	onClick={(e) => handleActivityDelete(e,activity.id)}  // changed the code to use our new handleActivityDelete handler
	floated='right'
	content='Delete'
	color='red'
	/>

```

- There is still one mor minor issue. Notice that in the above we put any, which is really bad coding practice. We should instead use something else that is more specific. If we hover our mouse over the 'e' in the onClick function we can see what type it is, but this isn't exactly the type that we should put in our function. The type will actually be: `SyntheticEvent<HTMLButtonElement>`. Thus, we need to change our code slightly to handle this type. 

```jsx 
// ActivityList
export default function ActivityList({activities, selectActivity, deleteActivity, submitting}: Props) {
	const [target, setTarget] = useState(''); // set the state to empty

	function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string){
		setTarget(e.currentTarget.name);
		deleteActivity(id);
	}
	
```

- There is one last part that we want to add. We need to update the loading part of the function. We need to make sure that the loading is only true with the unique button that we have. We can do this by setting the loading property on the button. 

```jsx 
// ActivityList. tsx 
loading={submitting && target === activity.id}
```

- This section is now done. 

</div>
</div><br/>
