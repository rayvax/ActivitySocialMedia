import React             from "react";
import {Tab}             from "semantic-ui-react";
import {observer}        from "mobx-react-lite";
import ProfilePhotos     from "./ProfilePhotos";
import ProfileAbout      from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import {useStore}        from "../../app/stores/store";

export default observer(function ProfileContent()
{
    const {profileStore} = useStore();
    const {isLoadingFollowers} = profileStore

    const panes = [
        {menuItem: 'About', render: () => <Tab.Pane><ProfileAbout/></Tab.Pane>},
        {menuItem: 'Photos', render: () => <Tab.Pane><ProfilePhotos/></Tab.Pane>},
        {menuItem: 'Events', render: () => <Tab.Pane>Events content</Tab.Pane>},
        {
            menuItem: 'Followers', render: () =>
                <Tab.Pane loading={isLoadingFollowers}>
                    <ProfileFollowings/>
                </Tab.Pane>
        },
        {
            menuItem: 'Following', render: () =>
                <Tab.Pane loading={isLoadingFollowers}>
                    <ProfileFollowings/>
                </Tab.Pane>
        },
    ]

    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition={'right'}
            panes={panes}
            onTabChange={(e, data) => profileStore.activeTab = data.activeIndex}
        />
    )
})