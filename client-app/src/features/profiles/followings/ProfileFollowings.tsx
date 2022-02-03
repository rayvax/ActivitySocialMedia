import React                from "react";
import {observer}           from "mobx-react-lite";
import {Card, Grid, Header} from "semantic-ui-react";
import {useStore}           from "../../../app/stores/store";
import ProfileCard          from "../ProfileCard";
import {ActiveTab}          from "../../../app/stores/profileStore";

export default observer(function ProfileFollowings()
{
    const {profileStore} = useStore();
    const {profile, followings, activeTab} = profileStore

    return (
        <Grid>
            <Grid.Column width={16}>
                <Header
                    floated={"left"}
                    icon={'user'}
                    content={activeTab === ActiveTab.Following
                        ? `People ${profile?.displayName} is following`
                        : `People following ${profile?.displayName}`}
                />
            </Grid.Column>
            <Grid.Column width={16}>
                <Card.Group itemsPerRow={4}>
                    {followings.map(profile =>
                        (
                            <ProfileCard key={profile.userName} profile={profile}/>
                        ))}
                </Card.Group>
            </Grid.Column>
        </Grid>
    )
})