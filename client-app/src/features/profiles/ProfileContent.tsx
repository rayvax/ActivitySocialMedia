import React         from "react";
import { Tab }       from "semantic-ui-react";
import {observer}    from "mobx-react-lite";
import ProfilePhotos from "./ProfilePhotos";
import ProfileAbout  from "./ProfileAbout";

export default observer(function ProfileContent()
{
    const panes = [
        {menuItem: 'About', render: () => <Tab.Pane><ProfileAbout /></Tab.Pane>},
        {menuItem: 'Photos', render: () => <Tab.Pane><ProfilePhotos /></Tab.Pane>},
        {menuItem: 'Events', render: () => <Tab.Pane>Events content</Tab.Pane>},
        {menuItem: 'Followers', render: () => <Tab.Pane>Followers content</Tab.Pane>},
        {menuItem: 'Following', render: () => <Tab.Pane>Following content</Tab.Pane>},
    ]

    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition={'right'}
            panes={panes}
        />
    )
})