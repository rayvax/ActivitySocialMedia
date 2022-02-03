import React             from "react";
import {Tab}             from "semantic-ui-react";
import {observer}    from "mobx-react-lite";
import ProfilePhotos from "../photos/ProfilePhotos";
import ProfileAbout  from "../about/ProfileAbout";
import ProfileFollowings from "../followings/ProfileFollowings";
import {useStore}    from "../../../app/stores/store";
import ProfileEvents from "../activities/ProfileEvents";

export default observer(function ProfileContent()
{
    const {profileStore} = useStore();
    const {isLoadingFollowers} = profileStore

    const panes = [
        {menuItem: 'About', render: () => <Tab.Pane><ProfileAbout /></Tab.Pane>},
        {menuItem: 'Photos', render: () => <Tab.Pane><ProfilePhotos /></Tab.Pane>},
        {menuItem: 'Events', render: () => <Tab.Pane><ProfileEvents /></Tab.Pane>},
        {
            menuItem: 'Followers', render: () =>
                <Tab.Pane loading={isLoadingFollowers}>
                    <ProfileFollowings />
                </Tab.Pane>
        },
        {
            menuItem: 'Following', render: () =>
                <Tab.Pane loading={isLoadingFollowers}>
                    <ProfileFollowings />
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