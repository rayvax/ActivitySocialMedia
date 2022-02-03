import React                       from "react";
import {Grid, Header, Loader, Tab} from "semantic-ui-react";
import {observer}                  from "mobx-react-lite";
import {useStore}                  from "../../../app/stores/store";
import ProfileEventsList           from "./ProfileEventsList";

export default observer(function ProfileEvents()
{
    const {profileStore} = useStore();
    const {profileActivities, isLoading} = profileStore;

    const panRender = () =>
        <Tab.Pane>
            {isLoading ? (
                <Loader active={true}/>
            ) : (
                <ProfileEventsList activities={profileActivities}/>
            )}
        </Tab.Pane>;
    const panes = [
        {
            menuItem: 'Future Events',
            render: panRender
        },
        {
            menuItem: 'Past Events',
            render: panRender
        },
        {
            menuItem: 'Hosting',
            render: panRender
        },
    ]

    return (
        <Grid>
            <Grid.Column width={16}>
                <Header icon={'calendar'} content={'Activities'}/>
            </Grid.Column>
            <Grid.Column width={16}>
                <Tab panes={panes}
                     menu={{secondary: true, pointing: true, fluid: true}}
                     onTabChange={(e, data) => profileStore.eventsActiveTab = data.activeIndex}
                />
            </Grid.Column>
        </Grid>
    )
})