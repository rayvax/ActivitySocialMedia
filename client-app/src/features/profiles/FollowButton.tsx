import React, {SyntheticEvent} from "react";
import {Profile}               from "../../app/models/profile";
import {observer}              from "mobx-react-lite";
import {Button, Reveal}        from "semantic-ui-react";
import {useStore}              from "../../app/stores/store";

interface Props
{
    profile: Profile;
}

export default observer(function FollowButton({profile}: Props)
{
    const {profileStore, userStore} = useStore();
    const {updateFollowing, isLoading} = profileStore;

    function handleFollow(event: SyntheticEvent, userName: string)
    {
        event.preventDefault();
        updateFollowing(userName);
    }

    if(profile.userName === userStore.currentUserName)
        return null;

    return (
        <Reveal animated={'move'}>
            <Reveal.Content visible style={{width: '100%'}}>
                <Button
                    fluid
                    color={'teal'}
                    content={profile.following ? 'Following' : 'Not following'}/>
            </Reveal.Content>
            <Reveal.Content hidden style={{width: '100%'}}>
                <Button onClick={(event) => handleFollow(event, profile.userName)}
                        fluid
                        basic
                        color={profile.following ? 'red' : "green"}
                        content={profile.following ? 'Unfollow' : 'Follow'}
                        loading={isLoading}
                />
            </Reveal.Content>
        </Reveal>
    )
})