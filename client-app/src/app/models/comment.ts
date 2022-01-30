export interface ChatComment
{
    id: number;
    createdAt: Date;
    body: string;
    userName: string;
    displayName: string;
    image: string;
}

export class ChatCommentFormValues
{
    body: string;
    activityId: string;

    constructor(body: string, activityId: string)
    {
        this.body = body
        this.activityId = activityId;
    }
}