import React                             from "react";
import {ProfileActivity}                 from "../../../app/models/activity";
import {Card, Image}                     from "semantic-ui-react";
import {activityPath, categoryImagePath} from "../../../utils/paths";
import {formatDate}                      from "../../../utils/date-fns-utils";
import {Link}                            from "react-router-dom";

interface Props
{
    activity: ProfileActivity;
}

export default function ProfileActivityCard({activity}: Props)
{
    return (
        <Card as={Link} to={activityPath(activity.id)}>
            <Image src={categoryImagePath(`${activity.category}.jpg`)} disabled={activity.date < new Date()}/>
            <Card.Content textAlign={'center'}>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>{formatDate(activity.date, "dd MMM")}</Card.Meta>
                <Card.Meta>{formatDate(activity.date, "hh:mm")}</Card.Meta>
            </Card.Content>
        </Card>
    )
}