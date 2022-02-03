import React                                  from "react";
import {Profile}                              from "../../app/models/profile";
import {Card, Icon, Image}                    from "semantic-ui-react";
import {Link}                                 from "react-router-dom";
import {profileImagePlaceholder, profilePath} from "../../utils/paths";
import FollowButton                           from "./followings/FollowButton";
import {observer}                             from "mobx-react-lite";

interface Props
{
    profile: Profile;
    aboutLength?: number;
}

export default observer(function ProfileCard({profile, aboutLength = 40}: Props)
{
    function truncate(text: string | undefined)
    {
        if(text)
        {
            return text.length > aboutLength ? text.substring(0, aboutLength - 3) + '...' : text;
        }
    }

    const aboutContent = profile.about ? truncate(profile.about) : `Hello, I am ${profile.displayName}`

    return (
        <Card as={Link} to={profilePath(profile.userName)}>
            <Image src={profile.image || profileImagePlaceholder}/>
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{aboutContent}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name={"user"}/>
                {profile.followersCount} followers
            </Card.Content>
            <FollowButton profile={profile} />
        </Card>
    )
})