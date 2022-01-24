import React, {useEffect, useState} from "react";
import {Button, Header, Segment}    from "semantic-ui-react";
import {useStore}                   from "../../../app/stores/store";
import {observer}                   from "mobx-react-lite";
import {Activity}                    from "../../../app/models/activity";
import {useParams, useHistory, Link} from "react-router-dom";
import LoadingComponent              from "../../../app/layout/LoadingComponent";
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
    const { activityStore } = useStore();
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
            loadActivity(id)
                .then((activity) => SetActivity(activity!))
        }
    }, [id, loadActivity])

    async function handleFormSubmit(activity: Activity)
    {
        if (activity.id.length === 0)
        {
            //create activity
            activity.id = uuid();
            await activityStore.createActivity(activity);
        }
        else
        {
            //update activity
            await activityStore.editActivity(activity);
        }

        history.push(`/activities/${activity.id}`);
    }

    if (activityStore.isLoadingInitial)
        return <LoadingComponent content={'Loading activity...'}/>

    return (
        <Segment clearing>
            <Formik validationSchema={validationSchema}
                    enableReinitialize
                    initialValues={activity}
                    onSubmit={handleFormSubmit}>
                {({
                      handleSubmit, isSubmitting, dirty, isValid
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
                                    loading={activityStore.isLoading}
                                    disabled={isSubmitting || !dirty || !isValid} />
                            <Button as={Link}
                                    to='/activities'
                                    floated='right'
                                    type='button'
                                    content='Cancel' />
                        </Form>
                    )}
            </Formik>
        </Segment>
    )
})