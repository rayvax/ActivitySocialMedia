import {ChatComment, ChatCommentFormValues} from "../models/comment";
import {makeAutoObservable, runInAction}    from "mobx";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {store}                                         from "./store";

export default class CommentStore
{
    private _comments: ChatComment[] = [];
    private _hubConnection: HubConnection | null = null;

    constructor()
    {
        makeAutoObservable(this);
    }

    public get comments()
    {
        return this._comments;
    }

    public createHubConnection = (activityId: string) =>
    {
        if (store.activityStore.hasActivity(activityId))
        {
            this._hubConnection = new HubConnectionBuilder()
                .withUrl(`http://localhost:5000/chat?activityId=${activityId}`,
                    {
                        accessTokenFactory: () => store.commonStore.token!
                    })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this._hubConnection.start()
                .catch(error => console.log("Error establishing the connection: ", error))

            this._hubConnection.on("LoadComments", (comments: ChatComment[]) =>
            {
                runInAction(() =>
                {
                    comments.forEach(comment =>
                    {
                        comment.createdAt = new Date(comment.createdAt + 'Z'); //'Z' - to make date UTC
                    })
                    this._comments = comments
                });
            })

            this._hubConnection.on("ReceiveComment", (comment: ChatComment) =>
            {
                runInAction(() =>
                {
                    comment.createdAt = new Date(comment.createdAt);
                    this._comments.unshift(comment)
                })
            })
        }
    }

    public stopHubConnection = () =>
    {
        this._hubConnection?.stop()
            .catch(error => console.log("Error stopping connection: ", error));
    }

    public clearComments = () =>
    {
        this._comments = [];
        this.stopHubConnection();
    }

    public addComment = async (body: string) =>
    {
        const activityId = store.activityStore.selectedActivity?.id;
        const comment = new ChatCommentFormValues(body, activityId!);

        try
        {
            await this._hubConnection?.invoke('SendComment', comment);
        }
        catch (error)
        {
            console.log(error);
        }
    }
}