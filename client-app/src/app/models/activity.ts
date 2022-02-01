import {Profile} from "./profile";

export interface Activity
{
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;

    hostUserName: string;
    isCancelled: boolean;
    attendees: Profile[];

    //extra fields
    isGoing: boolean;
    isHosting: boolean;
    host?: Profile;
}

export class ActivityFormValues
{
    id?: string = undefined;
    title: string = '';
    date: Date | null = null;
    description: string = '';
    category: string = '';
    city: string = '';
    venue: string = '';

    constructor(activity?: Activity)
    {
        if(activity)
        {
            this.id = activity.id;
            this.title = activity.title;
            this.date = activity.date;
            this.description = activity.description;
            this.category = activity.category;
            this.city = activity.city;
            this.venue = activity.venue;
        }
    }

    public toActivity()
    {
        return {
            id: this.id,
            title: this.title,
            date: this.date,
            description: this.description,
            category: this.category,
            city: this.city,
            venue: this.venue
        } as Activity;
    }
}