import React                from 'react';
import {observer}           from "mobx-react-lite";
import {List, Image, Popup} from "semantic-ui-react";
import Profile              from "../../../app/models/profile";
import {Link}               from "react-router-dom";
import ProfileCard                            from "../../profiles/ProfileCard";
import {profileImagePlaceholder, profilePath} from "../../../utils/paths";

interface Props
{
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendees({attendees}: Props)
{
    return (
        <List horizontal>
            {attendees.map(attendee =>
                (
                    <Popup key={attendee.userName}
                           hoverable
                           trigger={
                               <List.Item key={attendee.userName} as={Link} to={profilePath(attendee.userName)}>
                                   <Image src={attendee.image || profileImagePlaceholder} size={"mini"} circular/>
                               </List.Item>
                           }
                    >
                        <ProfileCard profile={attendee} />
                    </Popup>
                ))}
        </List>
    )
})