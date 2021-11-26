import React, {Fragment}       from "react";
import {Header} from "semantic-ui-react";
import {useStore}              from "../../../app/stores/store";
import {observer}              from "mobx-react-lite"
import ActivityListItem        from "./ActivityListItem";

export default observer(function ActivityList()
    {
        const {activityStore} = useStore();
        const {groupedActivities} = activityStore;


        return (
            <>
                {groupedActivities.map(([date, activities]) =>
                    (
                        <Fragment key={date}>
                            <Header sub color={'teal'}>{date}</Header>
                            {activities.map((activity) =>
                                (
                                    <ActivityListItem key={activity.id} activity={activity}/>
                                ))}
                        </Fragment>
                    )
                )}
            </>
        )
    }
)