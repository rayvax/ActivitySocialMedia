import React, {useEffect, useState} from "react";
import {Button, Header, Segment}    from "semantic-ui-react";
import {useStore}                   from "../../../app/stores/store";
import {observer}                   from "mobx-react-lite";
import {Activity}                   from "../../../app/models/activity";
import {useParams, useHistory}      from "react-router-dom";
import LoadingComponent             from "../../../app/layout/LoadingComponent";
import {v4 as uuid}                 from "uuid";
import {Formik, Form}               from "formik";
import * as Yup                     from "yup"
import TextInput                    from "../../../app/common/form/TextInput"
import TextAreaInput                from "../../../app/common/form/TextAreaInput";
import SelectInput                  from "../../../app/common/form/SelectInput";
import {categoryOptions}            from "../../../app/common/options/сategoryOptions";
import DateInput                    from "../../../app/common/form/DateInput";

const defaultActivity: Activity = {
    id: '',
    title: '',
    date: null,
    description: '',
    category: '',
    city: '',
    venue: ''
}

export default observer(function ActivityForm()
{
    const {
        activityStore,
        pageStatesStore
    } = useStore();
    const {loadActivity} = activityStore;
    const {id} = useParams<{ id: string }>();
    const history = useHistory();

    const [activity, SetActivity] = useState(defaultActivity);

    const validationSchema = Yup.object({
        title: Yup.string().required("The activity title is required"),
        description: Yup.string().required("The activity description is required"),
        date: Yup.string().required(),
        category: Yup.string().required(),
        city: Yup.string().required(),
        venue: Yup.string().required(),
    })

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

    function handleCancel()
    {
        const path = `/activities${activity.id.length === 0 ? "" : "/" + activity.id}`
        history.push(path);
    }
    
    async function handleFormSubmit(activity: Activity)
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

    if (pageStatesStore.isLoading)
        return <LoadingComponent content={'Loading activity...'}/>

    return (
        <Segment clearing>
            <Formik validationSchema={validationSchema}
                    enableReinitialize
                    initialValues={activity}
                    onSubmit={handleFormSubmit}>
                {({
                      handleSubmit
                  }) =>
                    (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete={'off'}>
                            <Header content={"Activity Details"} sub color={"teal"}/>
                            <TextInput placeholder={"Title"}
                                       name={"title"}
                            />
                            <TextAreaInput placeholder={"Description of the activity"}
                                           name={"description"}
                                           rows={3}
                            />
                            <SelectInput placeholder={'Category'}
                                         name={"category"}
                                         options={categoryOptions}
                            />
                            <DateInput placeholderText={"Date"}
                                       name={"date"}
                                       showTimeSelect
                                       timeCaption={"time"}
                                       dateFormat={"MMMM d, yyyy hh:mm"}
                            />

                            <Header content={"Location Details"} sub color={"teal"}/>
                            <TextInput placeholder={"City"}
                                       name={"city"}
                            />
                            <TextInput placeholder={"Venue"}
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
                    )}
            </Formik>
        </Segment>
    )
})