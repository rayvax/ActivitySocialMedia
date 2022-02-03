import React, {useEffect} from "react";
import {useParams}      from "react-router-dom";
import {useStore}    from "../../../app/stores/store";
import ProfileHeader from "./ProfileHeader";
import {Grid}           from "semantic-ui-react";
import ProfileContent   from "./ProfileContent";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {observer}       from "mobx-react-lite";

export default observer(function ProfilePage()
{
    const {userName} = useParams<{ userName: string }>();

    const {profileStore} = useStore();
    const {profile, loadProfile, isLoadingProfile, isCurrentUser} = profileStore;

    useEffect(() =>
    {
        loadProfile(userName);

        return () =>
        {
            profileStore.activeTab = 0;
        }
    }, [loadProfile, userName, profileStore])

    if (isLoadingProfile)
        return <LoadingComponent content={"Loading profile..."}/>

    return (
        <Grid>
            <Grid.Column width={'16'}>
                {profile &&
                    <>
                        <ProfileHeader profile={profile} isCurrentUser={isCurrentUser} />
                        <ProfileContent />
                    </>
                }
            </Grid.Column>
        </Grid>
    )
})