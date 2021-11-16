import React, {useState}              from "react";
import {Segment, Item, Button, Label} from "semantic-ui-react";
import {useStore}                     from "../../../app/stores/store";
import {observer}                     from "mobx-react-lite";
import {Link}                         from "react-router-dom";

export default observer(function ActivityList()
{
    const {activityStore, pageStatesStore} = useStore();
    const {activitiesByDate, deleteActivity} = activityStore;

    const [deleteTargetId, setDeleteTarget] = useState('')

    async function handleDeleteActivity(id: string)
    {
        setDeleteTarget(id);

        pageStatesStore.isSubmitting = true;
        try
        {
            await deleteActivity(id);
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            pageStatesStore.isSubmitting = false;
        }
    }

    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map((activity) =>
                    (
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header as={'a'} content={activity.title}/>
                                <Item.Meta>{activity.date.toString().split('T')[0]}</Item.Meta>
                                <Item.Description>
                                    <div>{activity.description}</div>
                                    <div>{activity.city},{activity.venue}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Button as={Link} to={`/activities/${activity.id}`}
                                            floated={"right"}
                                            content={"View"}
                                            color={"purple"}/>
                                    <Button onClick={() => handleDeleteActivity(activity.id)}
                                            floated={"right"}
                                            content={"Delete"}
                                            color={"orange"} basic
                                            loading={pageStatesStore.isSubmitting && deleteTargetId === activity.id}/>
                                    <Label basic content={activity.category}/>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))}
            </Item.Group>
        </Segment>
    )
})