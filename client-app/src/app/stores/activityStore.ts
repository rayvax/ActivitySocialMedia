import {Activity}                        from "../models/activity";
import {makeAutoObservable, runInAction} from "mobx";
import agent                             from "../agent/agent";

export default class ActivityStore
{
    private _activities = new Map<string, Activity>(); //key - id, value - activity
    private _selectedActivity: Activity | undefined = undefined;

    public constructor()
    {
        makeAutoObservable(this);
    }
    
    public get activitiesByDate()
    {
        return Array.from(this._activities.values()).sort((a, b) => a.date > b.date? 1 : -1);
    }
    
    public get selectedActivity()
    {
        return this._selectedActivity;
    }
    
    public setSelectedActivity = (activity: Activity) => this._selectedActivity = activity;
    

    public loadActivities = async () =>
    {
        const responseActivities = await agent.Activities.getList();

        responseActivities.forEach(activity =>
        {
            this.setActivity(activity);
        });
    }
    
    public loadActivity = async (id: string) =>
    {
        let activity = this._activities.get(id);
        
        if(activity)
        {
            this._selectedActivity = activity;
            return activity;
        }
        else
        {
            activity = await agent.Activities.getActivity(id);

            return runInAction(() =>
            {
                this.setActivity(activity);
                this._selectedActivity = activity;
                return activity;
            })
        }
    }
    
    public createActivity = async (activity: Activity) =>
    {
        await agent.Activities.create(activity);

        runInAction( () =>
        {
            this._activities.set(activity.id, activity);
            this._selectedActivity = activity;
        })
    }

    public editActivity = async (activity: Activity) =>
    {
        await agent.Activities.edit(activity);

        runInAction(() =>
        {
            this._activities.set(activity.id, activity);
            this._selectedActivity = activity;
        })
    }

    public deleteActivity = async (id: string) =>
    {
        await agent.Activities.delete(id);
        runInAction(() =>
        {
            this._activities.delete(id);
        })
    }
    
    private setActivity = (activity: Activity | undefined) =>
    {
        if(!activity)
            return;
        
        //activity.date = activity.date.split('T')[0];
        this._activities.set(activity.id, activity);
    }
}