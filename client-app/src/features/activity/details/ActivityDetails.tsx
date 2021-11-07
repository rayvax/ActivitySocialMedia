import React from "react";
import {Activity} from "../../../app/models/activity";
import {Image, Card, Icon, Button} from "semantic-ui-react";

interface Properties {
    activity: Activity;
    cancelSelectActivity: () => void;
    openForm: (id: string) => void;
}

export default function ActivityDetails({activity, cancelSelectActivity, openForm}: Properties) {
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} alt={activity.category}/>
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta><span>{activity.city}, {activity.venue}</span></Card.Meta>
                <Card.Description>{activity.description}</Card.Description>
                <Card.Description style={{paddingTop:'1em',color:'grey'}}>
                    <Icon name={"calendar"}/>
                    {activity.date}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={'2'}>
                    <Button onClick={() => openForm(activity.id)}
                            basic color={"blue"} content={"Edit"} />
                    <Button onClick={cancelSelectActivity}
                            basic color={"grey"} content={"Cancel"} />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}