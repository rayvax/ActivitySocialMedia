import React from 'react';
import {Activity} from "../../../app/models/activity";
import {Grid, GridColumn, List} from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Properties
{
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    
    createOrEditActivity: (activity: Activity) => void;
    deleteActivity: (id:string) => void;
}

export default function ActivityDashboard({activities,
                                              selectedActivity, selectActivity, cancelSelectActivity, 
                                              editMode, openForm, closeForm,
                                              createOrEditActivity, deleteActivity}: Properties)
{
    return(
        <Grid>
            <GridColumn width={'10'}>
                <ActivityList activities={activities}  
                              selectActivity={selectActivity} 
                              deleteActivity={deleteActivity}/>
            </GridColumn>
            <GridColumn width={'6'}>
                {selectedActivity && !editMode && 
                <ActivityDetails activity={selectedActivity} 
                                 cancelSelectActivity={cancelSelectActivity}
                                 openForm={openForm}/>}
                
                {editMode &&
                <ActivityForm selectedActivity={selectedActivity}
                              closeForm={closeForm}
                              createOrEditActivity={createOrEditActivity}/>}
            </GridColumn>
        </Grid>
    )
}