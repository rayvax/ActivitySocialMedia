import React, {useEffect, useState} from 'react';
import {Grid, GridColumn, Loader}   from "semantic-ui-react";
import ActivityList                 from "./ActivityList";
import {useStore}                   from "../../../app/stores/store";
import {observer}                   from "mobx-react-lite";
import ActivityFilters              from "./ActivityFilters";
import {PagingParams}               from "../../../app/models/pagination";
import InfiniteScroll               from 'react-infinite-scroller';
import ActivityListItemPlaceholder  from "./ActivityListItemPlaceholder";

export default observer(function ActivityDashboard()
{
    const {activityStore} = useStore();
    const {activitiesByDate, loadActivities,
        setPagingParams, pagination,
        isLoadingInitial} = activityStore
    const [isLoadingNextActivities, setIsLoadingNextActivities] = useState(false);

    useEffect(() =>
    {
        if(activitiesByDate.length <= 1)
        {
            loadActivities()
        }
    }, [loadActivities, activitiesByDate.length]);

    function getNextActivities()
    {
        if(pagination)
        {
            setIsLoadingNextActivities(true);
            setPagingParams(new PagingParams(pagination.currentPage + 1))
            loadActivities().then(() => setIsLoadingNextActivities(false));
        }
    }

    return (
        <Grid>
            <GridColumn width={'10'}>
                {isLoadingInitial && !isLoadingNextActivities ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={getNextActivities}
                        hasMore={!isLoadingNextActivities
                            && !!pagination
                            && pagination.currentPage < pagination.totalPagesCount}
                        initialLoad={false}
                    >
                        <ActivityList/>
                    </InfiniteScroll>
                )}
            </GridColumn>
            <GridColumn width={'6'}>
                <ActivityFilters />
            </GridColumn>
            <Grid.Column width={10}>
                <Loader active={isLoadingNextActivities} />
            </Grid.Column>
        </Grid>
    )
})