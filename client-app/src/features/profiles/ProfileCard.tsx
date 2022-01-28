import React               from "react";
import Profile             from "../../app/models/profile";
import {Card, Icon, Image} from "semantic-ui-react";
import {Link}                                 from "react-router-dom";
import {profileImagePlaceholder, profilePath} from "../../utils/paths";

interface Props
{
    profile: Profile;
}

export default function ProfileCard({profile}: Props)
{
    return (
        <Card as={Link} to={profilePath(profile.userName)}>
            <Image src={profile.image || profileImagePlaceholder}/>
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>Bio goes here</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name={"user"} />
                20 followers
            </Card.Content>
        </Card>
    )
}