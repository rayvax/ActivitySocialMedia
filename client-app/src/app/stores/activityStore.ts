import {Activity, ActivityFormValues}    from "../models/activity";
import {makeAutoObservable, runInAction} from "mobx";
import agent        from "../agent/agent";
import {formatDate} from "../../utils/date-fns-utils";
import {store}      from "./store";
import {ProfileWrapper}                  from "../models/profile";

export default class ActivityStore
{
    private _activities = new Map<string, Activity>(); //key - id, value - activity
    private _selectedActivity: Activity | undefined = undefined;
    private _isLoadingInitial = false;
    private _isLoading = false; //creating, editing, deleting activity


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
            }, {} as { [key: string]: Activity[] })
        )
    }

    public get selectedActivity()
    {
        return this._selectedActivity;
    }

    public get isLoadingInitial()
    {
        return this._isLoadingInitial;
    }

    public get isLoading()
    {
        return this._isLoading;
    }

    public setIsLoadingInitial = (value: boolean) => this._isLoadingInitial = value;

    public setIsLoading = (value: boolean) => this._isLoading = value;

    public loadActivities = async () =>
    {
        await this.loadInitial(async () =>
        {
            const responseActivities = await agent.Activities.getList();

            responseActivities.forEach(activity =>
            {
                this.setActivity(activity);
            });
        })
    }

    public loadActivity = async (id: string) =>
    {
        return await this.loadInitial<Activity>(async () =>
        {
            let activity = this.getActivity(id);

            if (activity)
            {
                this._selectedActivity = activity;
                return activity;
            }
            else
            {
                activity = await agent.Activities.getActivity(id);

                this.setActivity(activity);
                runInAction(() => this._selectedActivity = activity);

                return activity;
            }
        })
    }

    public createActivity = async (activityFormValues: ActivityFormValues) =>
    {
        const user = store.userStore.user;
        const attendee = new ProfileWrapper(user!);

        await this.runInLoading(async () =>
        {
            await agent.Activities.create(activityFormValues);

            const newActivity = activityFormValues.toActivity();
            newActivity.hostUserName = user!.userName;
            newActivity.attendees = [attendee];

            this.setActivity(newActivity)
            runInAction(() => this._selectedActivity = newActivity)
        })
    }

    public editActivity = async (activity: ActivityFormValues) =>
    {
        await this.runInLoading(async () =>
        {
            await agent.Activities.edit(activity);

            runInAction(() =>
            {
                if(activity.id)
                {
                    const updatedActivity = {...this.getActivity(activity.id), ...activity} as Activity

                    this._activities.set(activity.id, updatedActivity);
                    this._selectedActivity = updatedActivity;
                }
            })
        })
    }

    public deleteActivity = async (id: string) =>
    {
        await this.runInLoading(async () =>
        {
            await agent.Activities.delete(id);
            runInAction(() =>
            {
                this._activities.delete(id);
            })
        })
    }

    private setActivity = (activity: Activity) =>
    {
        const user = store.userStore.user;
        if(user)
        {
            activity.isGoing = activity.attendees?.some(p => p.userName === user.userName)
            activity.isHosting = activity.hostUserName === user.userName;
            activity.host = activity.attendees?.find(p => p.userName === activity.hostUserName);
        }

        activity.date = new Date(activity.date!);
        this._activities.set(activity.id, activity);
    }

    public updateAttendance = async () =>
    {
        const user = store.userStore.user;

        await this.runInLoading(async () =>
        {
            await agent.Activities.attend(this.selectedActivity!.id)

            runInAction(() =>
            {
               if(this.selectedActivity?.isGoing)
               {
                   //cancelled the attendance
                   this.selectedActivity.attendees = this.selectedActivity
                            .attendees?.filter(u => u.userName !== user?.userName)

                   this.selectedActivity!.isGoing = false;
               }
               else
               {
                   //joined activity
                   const attendee = new ProfileWrapper(user!);
                   this.selectedActivity?.attendees?.push(attendee);
                   this.selectedActivity!.isGoing = true;
               }

               this._activities.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        })
    }

    public cancelSelectedActivityToggle = async () =>
    {
        if(!this._selectedActivity)
            return;

        await this.runInLoading(async () =>
        {
            await agent.Activities.attend(this._selectedActivity!.id);
            runInAction(() => {
                this._selectedActivity!.isCancelled = !this._selectedActivity!.isCancelled
                this._activities.set(this._selectedActivity!.id, this._selectedActivity!);
            });
        })
    }

    private getActivity = (id: string) =>
    {
        return this._activities.get(id);
    }

    private runInLoading = async (fn: () => Promise<void>) =>
    {
        this.setIsLoading(true);

        try
        {
            return await fn();
        }
        catch (error)
        {
            console.error(error)
        }
        finally
        {
            this.setIsLoading(false);
        }
    }

    private loadInitial = async <T>(fn: () => Promise<T>) =>
    {
        this.setIsLoadingInitial(true);

        try
        {
            return await fn();
        }
        catch (error)
        {
            console.error(error)
        }
        finally
        {
            this.setIsLoadingInitial(false);
        }
    }
}