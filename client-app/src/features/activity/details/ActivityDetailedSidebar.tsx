import React                               from 'react'
import {Segment, List, Label, Item, Image} from 'semantic-ui-react'
import {Link}                              from 'react-router-dom'
import {observer}                          from 'mobx-react-lite'
import {Activity}                             from "../../../app/models/activity";
import {profileImagePlaceholder, profilePath} from "../../../utils/paths";

interface Props
{
    activity: Activity;
}

export default observer(function ActivityDetailedSidebar({activity: {attendees, host}}: Props)
{
    return (
        <>
            <Segment
                textAlign='center'
                style={{border: 'none'}}
                attached='top'
                secondary
                inverted
                color='teal'
            >
                {attendees.length} {attendees.length === 1 ? 'Person' : 'People'} Going
            </Segment>
            <Segment attached>
                <List relaxed divided>
                    {attendees.map(attendee =>
                        (
                            <Item key={attendee.userName} style={{position: 'relative'}}>
                                {attendee.userName === host?.userName &&
                                    <Label
                                        style={{position: 'absolute'}}
                                        color='orange'
                                        ribbon='right'
                                    >
                                        Host
                                    </Label>
                                }

                                <Image size='tiny' src={attendee.image || profileImagePlaceholder}/>
                                <Item.Content verticalAlign='middle'>
                                    <Item.Header as='h3'>
                                        <Link to={profilePath(attendee.userName)}>{attendee.displayName}</Link>
                                    </Item.Header>
                                    {attendee.following &&
                                        <Item.Extra style={{color: 'orange'}}>Following</Item.Extra>
                                    }
                                </Item.Content>
                            </Item>
                        ))}
                </List>
            </Segment>
        </>

    )
})


