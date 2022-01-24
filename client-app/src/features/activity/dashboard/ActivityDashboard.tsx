import React, {useEffect} from 'react';
import {Grid, GridColumn} from "semantic-ui-react";
import ActivityList       from "./ActivityList";
import {useStore}         from "../../../app/stores/store";
import {observer}         from "mobx-react-lite";
import LoadingComponent   from "../../../app/layout/LoadingComponent";
import ActivityFilters    from "./ActivityFilters";

export default observer(function ActivityDashboard()
{
    const {activityStore} = useStore();
    const {activitiesByDate} = activityStore

    useEffect(() =>
    {
        if(activitiesByDate.length <= 1)
        {
            activityStore.loadActivities()
        }
    }, [activityStore, activitiesByDate.length]);
    
    if (activityStore.isLoadingInitial)
        return (<LoadingComponent content={"Loading activites..."}/>)
    
    return (
        <Grid>
            <GridColumn width={'10'}>
                <ActivityList/>
            </GridColumn>
            <GridColumn width={'6'}>
                <ActivityFilters />
            </GridColumn>
        </Grid>
    )
})