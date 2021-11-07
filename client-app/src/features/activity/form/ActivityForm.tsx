import React, {ChangeEvent, SyntheticEvent, useState} from "react";
import {Activity} from "../../../app/models/activity";
import {Button, Form, Segment} from "semantic-ui-react";

interface Properties
{
    selectedActivity: Activity | undefined;
    closeForm: () => void;
    createOrEditActivity: (activity: Activity) => void;
}

export default function ActivityForm({selectedActivity, closeForm, createOrEditActivity}: Properties)
{
    const activityInitialState = selectedActivity ?? {
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    }
    
    const [activity, SetActivity] = useState(activityInitialState);
    
    function handleSubmit()
    {
        createOrEditActivity(activity);
    }
    
    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
        const {name: key, value} = event.target;
        SetActivity({...activity, [key]:value})
    }
    
    function setActivityProperty(key: string, value: string | undefined)
    {
        SetActivity({...activity, [key]: value ?? ''})
    }
    
    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete={'off'}>
                <Form.Input onChange={handleInputChange}
                            label={'Title'} 
                            placeholder={"Title"} 
                            value={activity.title}
                            name={"title"}
                />
                <Form.TextArea onChange={handleInputChange}
                               label={"Description"} 
                               placeholder={"Description of the activity"}
                               value={activity.description}
                               name={"description"}
                />
                <Form.Input onChange={handleInputChange}
                            label={'Date'} 
                            placeholder={"Date"}
                            value={activity.date}
                            name={"date"}
                />
                <Form.Select onChange={(e, 
                                        {name, value}) => setActivityProperty(name, value?.toString())}
                              label = 'Category' 
                              options={categoryOptions} 
                              placeholder={'Category'} 
                              value={activity.category} 
                              name={"category"}
                />
                <Form.Input onChange={handleInputChange}
                            label={'City'} 
                            placeholder={"City"}
                            value={activity.city}
                            name={"city"}
                />
                <Form.Input onChange={handleInputChange}
                            label={'Venue'} 
                            placeholder={"Venue"}
                            value={activity.venue}
                            name={"venue"}
                />
                
                <Button type={'submit'} content={'Submit'} positive floated={"right"} />
                <Button onClick={closeForm}
                        type={'button'} content={'Cancel'} floated={"right"} />
            </Form>
        </Segment>
    )
}

const categoryOptions =
[
    { key: 1, text: 'Culture', value: 'culture' },
    { key: 2, text: 'Film', value: 'film' },
    { key: 3, text: 'Food', value: 'food' },
    { key: 4, text: 'Meeting', value: 'meeting' },
    { key: 5, text: 'Music', value: 'music' },
    { key: 6, text: 'Travel', value: 'travel' },
]