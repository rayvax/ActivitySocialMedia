import React, {SyntheticEvent, useEffect}          from "react";
import {Card, Grid, Header, Loader, Tab, TabProps} from "semantic-ui-react";
import {observer}                                  from "mobx-react-lite";
import {useStore}                                  from "../../../app/stores/store";
import {ProfileActivitiesPredicate}                from "../../../app/models/profile";
import ProfileActivityCard                         from "./ProfileActivityCard";

class Pane
{
    menuItem: string;
    key: ProfileActivitiesPredicate;

    constructor(menuItem: string, key: ProfileActivitiesPredicate)
    {
        this.menuItem = menuItem;
        this.key = key;
    }
}

const panes = [
    new Pane('Future Events', 'future'),
    new Pane('Past Events', 'past'),
    new Pane('Hosting', 'hosting')
]

export default observer(function ProfileEvents()
{
    const {profileStore} = useStore();
    const {profileActivities, isLoading, loadProfileActivities, clearProfileActivities} = profileStore;

    useEffect(() =>
    {
        loadProfileActivities(panes[0].key)

        return () =>
        {
            clearProfileActivities()
        };
    }, [loadProfileActivities, clearProfileActivities])


    function handleTabChange(event: SyntheticEvent, data: TabProps)
    {
        const index = data.activeIndex as number;
        loadProfileActivities(panes[index].key);
    }

    return (
        <Grid>
            <Grid.Column width={16}>
                <Header icon={'calendar'} content={'Activities'}/>
            </Grid.Column>
            <Grid.Column width={16}>
                <Tab panes={panes}
                     menu={{secondary: true, pointing: true}}
                     onTabChange={handleTabChange}
                     defaultActiveIndex={0}

                />
            </Grid.Column>
            <Grid.Column width={16}>
                {isLoading ? (
                    <Loader active={true}/>
                ) : (
                    <Card.Group itemsPerRow={4}>
                        {profileActivities.map(activity => (
                            <ProfileActivityCard key={activity.id} activity={activity}/>
                        ))}
                    </Card.Group>
                )}
            </Grid.Column>
        </Grid>
    )
})