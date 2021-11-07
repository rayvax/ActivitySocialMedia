import React from "react";
import {Activity} from "../../../app/models/activity";
import {Segment, Item, Button, Label} from "semantic-ui-react";

interface Properties {
    activities: Activity[];
    selectActivity: (id: string) => void;
    deleteActivity: (id:string) => void;
}

export default function ActivityList({activities, selectActivity, deleteActivity} : Properties)
{
    return (
        <Segment>
            <Item.Group divided>
                {activities.map( (activity) =>
                    (
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header as={'a'} content={activity.title} />
                                <Item.Meta>{activity.date}</Item.Meta>
                                <Item.Description>
                                    <div>{activity.description}</div>
                                    <div>{activity.city},{activity.venue}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Button onClick={() => selectActivity(activity.id)}
                                            floated={"right"} content={"View"} color={"purple"}/>
                                    <Button onClick={() => deleteActivity(activity.id)}
                                            floated={"right"} content={"Delete"} color={"orange"} basic/>
                                    <Label basic content={activity.category} />
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))}
            </Item.Group>
        </Segment>
    )
}