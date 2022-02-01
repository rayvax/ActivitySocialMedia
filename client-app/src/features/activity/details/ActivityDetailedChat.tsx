import {observer}                                 from 'mobx-react-lite'
import React, {useEffect}                         from 'react'
import {Segment, Header, Comment, Loader} from 'semantic-ui-react'
import {profileImagePlaceholder, profilePath}     from "../../../utils/paths";
import {useStore}                                 from "../../../app/stores/store";
import {Link}                                     from "react-router-dom";
import {Formik, Form, Field, FieldProps}          from 'formik';
import * as Yup                                   from 'yup';
import {formatDistanceToNow}                      from "date-fns";

interface Props
{
    activityId: string;
}

export default observer(function ActivityDetailedChat({activityId}: Props)
{
    const {commentStore} = useStore();

    useEffect(() =>
    {
        if (activityId)
        {
            commentStore.createHubConnection(activityId);
        }
        return () =>
        {
            commentStore.clearComments();
        }
    }, [commentStore, activityId])

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    <Formik initialValues={{body: ''}}
                            onSubmit={(values, {resetForm}) => commentStore.addComment(values.body)
                                .then(() => resetForm())}
                            validationSchema={Yup.object({
                                body: Yup.string().required()
                            })}
                    >
                        {({isSubmitting, isValid, handleSubmit}) =>
                            (
                                <Form className={'ui form'}>
                                    <Field name={'body'}>
                                        {(props: FieldProps) =>
                                            (
                                                <div style={{position: 'relative'}}>
                                                    <Loader active={isSubmitting} />
                                                    <textarea
                                                        placeholder={'Enter your comment'}
                                                        rows={2}
                                                        {...props.field}
                                                        onKeyPress={event =>
                                                        {
                                                            if(event.key === 'Enter' && event.shiftKey)
                                                                return;

                                                            if(event.key === 'Enter' && !event.shiftKey)
                                                            {
                                                                event.preventDefault();

                                                                if(isValid)
                                                                    handleSubmit();
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                    </Field>
                                </Form>
                            )}
                    </Formik>

                    {commentStore.comments.map(comment =>
                        (
                            <Comment key={comment.id}>
                                <Comment.Avatar src={comment.image || profileImagePlaceholder}/>
                                <Comment.Content>
                                    <Comment.Author as={Link} to={profilePath(comment.userName)}>
                                        {comment.displayName}
                                    </Comment.Author>
                                    <Comment.Metadata>
                                        <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                    </Comment.Metadata>
                                    <Comment.Text style={{whiteSpace: 'pre-wrap'}}>{comment.body}</Comment.Text>
                                </Comment.Content>
                            </Comment>
                        ))}
                </Comment.Group>
            </Segment>
        </>

    )
})
