import {Activity}                        from "../models/activity";
import {makeAutoObservable, runInAction} from "mobx";
import agent                             from "../agent/agent";
import {formatDate}                      from "../../features/utils/date-fns-utils";

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
        return Array.from(this._activities.values())
            .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }
    
    public get groupedActivities()
    {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) =>
            {
                const date = formatDate(activity.date, "dd MMM yyyy");
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key:string]: Activity[]})
        )
    }
    
    public get selectedActivity()
    {
        return this._selectedActivity;
    }

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
        
        activity.date = new Date(activity.date!);
        this._activities.set(activity.id, activity);
    }
}