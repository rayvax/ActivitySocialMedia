import React                                from "react";
import {Segment, Item, Icon, Button, Label} from "semantic-ui-react";
import {Link}                               from "react-router-dom";
import {Activity}                           from "../../../app/models/activity";
import {formatDate}                         from "../../../utils/date-fns-utils";
import ActivityListItemAttendees                            from "./ActivityListItemAttendees";
import {activityPath, profileImagePlaceholder, profilePath} from "../../../utils/paths";

interface Props
{
    activity: Activity;
}

export default function ActivityListItem({activity}: Props)
{
    return (
        <Segment.Group>
            <Segment>
                {activity.isCancelled &&
                    <Label attached={'top'}
                           color={'red'}
                           content={'Cancelled'}
                           style={{textAlign: 'center'}}
                    />
                }
                <Item.Group>
                    <Item>
                        <Item.Image src={activity.host?.image || profileImagePlaceholder}
                                    as={Link}
                                    to={profilePath(activity.hostUserName)}
                                    size={"tiny"}
                                    circular
                                    style={{marginBottom: 3}}
                        />
                        <Item.Content>
                            <Item.Header as={Link} to={activityPath(activity.id)}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by <Link to={profilePath(activity.hostUserName)}>
                                {activity.host?.displayName}
                            </Link>
                            </Item.Description>
                            {activity.isHosting &&
                                (
                                    <Item.Description>
                                        <Label basic color={"orange"}>
                                            You are hosting this activity
                                        </Label>
                                    </Item.Description>
                                )
                            }
                            {activity.isGoing && !activity.isHosting &&
                                (
                                    <Item.Description>
                                        <Label basic color={"green"}>
                                            You are going to this activity
                                        </Label>
                                    </Item.Description>
                                )
                            }
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name={"clock"}/> <span style={{marginRight: "1em"}}>{formatDate(activity.date, "dd MMM yyyy hh:mm")}</span>
                <Icon name={"marker"}/>{activity.venue}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={activity.attendees!} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={activityPath(activity.id)}
                        color={"teal"}
                        floated={"right"}
                        content={"View"}
                />
            </Segment>
        </Segment.Group>
    )
}