import React, {ChangeEvent, useEffect, useState} from "react";
import {Button, Form, Segment}                   from "semantic-ui-react";
import {useStore}                                from "../../../app/stores/store";
import {observer}                                from "mobx-react-lite";
import {Activity}                                from "../../../app/models/activity";
import {useParams, useHistory}                   from "react-router-dom";
import LoadingComponent                          from "../../../app/layout/LoadingComponent";
import {v4 as uuid}                              from "uuid";

const categoryOptions =
    [
        {key: 1, text: 'Culture', value: 'culture'},
        {key: 2, text: 'Film', value: 'film'},
        {key: 3, text: 'Food', value: 'food'},
        {key: 4, text: 'Meeting', value: 'meeting'},
        {key: 5, text: 'Music', value: 'music'},
        {key: 6, text: 'Travel', value: 'travel'},
    ]

const defaultActivity: Activity = {
    id: '',
    title: '',
    date: new Date(),
    description: '',
    category: '',
    city: '',
    venue: ''
}

export default observer(function ActivityForm()
{
    const {activityStore, pageStatesStore} = useStore();
    const {loadActivity} = activityStore;
    const {id} = useParams<{ id: string }>();
    const history = useHistory();

    const [activity, SetActivity] = useState(defaultActivity);

    useEffect(() =>
    {
        if (id)
        {
            pageStatesStore.isLoading = true;
            loadActivity(id).then((activity) =>
            {
                SetActivity(activity!)
            })
                .catch((error) =>
                {
                    console.log(error);
                })
                .finally(() =>
                {
                    pageStatesStore.isLoading = false;
                })
        }
    }, [id, loadActivity, pageStatesStore, history])

    async function handleSubmit()
    {
        pageStatesStore.isSubmitting = true;

        try
        {
            if (activity.id.length === 0)
            {
                //create activity
                activity.id = uuid();
                activityStore.createActivity(activity).then(() => history.push(`/activities/${activity.id}`));
            } else
            {
                //update activity
                activityStore.editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
            }
        }
        catch (error)
        {
            console.log(error)
        }
        finally
        {
            pageStatesStore.isSubmitting = false;
        }
    }
    
    function handleCancel()
    {
        const path = `/activities${activity.id.length === 0 ? "" : "/"+activity.id}`
        history.push(path);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
        const {name: key, value} = event.target;
        SetActivity({...activity, [key]: value})
    }

    function setActivityProperty(key: string, value: string | undefined)
    {
        SetActivity({...activity, [key]: value ?? ''})
    }

    
    
    if (pageStatesStore.isLoading)
        return <LoadingComponent content={'Loading activity...'}/>

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
                            type={'date'}
                            label={'Date'}
                            placeholder={"Date"}
                            value={activity.date.toString().split('T')[0]}
                            name={"date"}
                />
                <Form.Select onChange={(e,
                                        {name, value}) => setActivityProperty(name, value?.toString())}
                             label='Category'
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

                <Button type={'submit'}
                        content={'Submit'}
                        positive
                        floated={"right"}
                        loading={pageStatesStore.isSubmitting}/>
                <Button onClick={() => handleCancel()}
                        type={'button'}
                        content={'Cancel'}
                        floated={"right"}/>
            </Form>
        </Segment>
    )
})