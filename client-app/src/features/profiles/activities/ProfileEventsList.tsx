import React               from "react";
import {observer}          from "mobx-react-lite";
import {ProfileActivity}   from "../../../app/models/activity";
import ProfileActivityCard from "./ProfileActivityCard";
import {Card}              from "semantic-ui-react";

interface Props
{
    activities: ProfileActivity[];
}

export default observer(function ProfileEventsList({activities}: Props)
{
    return (
        <Card.Group itemsPerRow={4}>
            {activities.map(activity => (
                <ProfileActivityCard key={activity.id} activity={activity}/>
            ))}
        </Card.Group>
    )
})