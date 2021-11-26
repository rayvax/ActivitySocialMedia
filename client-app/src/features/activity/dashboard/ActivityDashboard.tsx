import React, {useEffect} from 'react';
import {Grid, GridColumn} from "semantic-ui-react";
import ActivityList       from "./ActivityList";
import {useStore}         from "../../../app/stores/store";
import {observer}         from "mobx-react-lite";
import LoadingComponent   from "../../../app/layout/LoadingComponent";
import ActivityFilters    from "./ActivityFilters";

export default observer(function ActivityDashboard()
{
    const {activityStore, pageStatesStore} = useStore();
    const {activitiesByDate} = activityStore

    useEffect(() =>
    {
        if(activitiesByDate.length <= 1)
        {
            pageStatesStore.isLoading = true;
            
            activityStore.loadActivities()
                .catch((error) =>
                {
                    console.log(error)
                })
                .finally(() =>
                {
                    pageStatesStore.isLoading = false
                });
        }
    }, [activityStore, pageStatesStore, activitiesByDate.length]);
    
    if (pageStatesStore.isLoading)
        return (<LoadingComponent content={"Loading app"}/>)
    
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