import React, {useState}      from "react";
import {observer}             from "mobx-react-lite";
import {Button, Grid, Header} from "semantic-ui-react";
import {useStore}             from "../../app/stores/store";
import ProfileAboutEdit       from "./ProfileEditForm";
import NotFound               from "../errors/NotFound";

export default observer(function ProfileAbout()
{
    const {profileStore} = useStore();
    const { profile, isCurrentUser } = profileStore;
    const [inEditMode, setInEditMode] = useState(false);

    if(!profile)
        return <NotFound />

    return (
        <Grid>
            <Grid.Column width={'16'}>
                <Header content={`About ${profile.displayName}`} icon={'user'} floated={'left'} />
                {isCurrentUser &&
                    <Button content={inEditMode ? 'Cancel' : 'Edit Profile'}
                            floated={'right'}
                            basic
                            onClick={() => setInEditMode(!inEditMode)}
                    />
                }
            </Grid.Column>
            <Grid.Column width={'16'}>
                {inEditMode ? (
                    <ProfileAboutEdit profile={profile} onSubmitted={() => setInEditMode(false)} />
                ) : (
                    <span style={{whiteSpace: 'pre-line'}}>{profile.about}</span>
                )}
            </Grid.Column>
        </Grid>
    )
})