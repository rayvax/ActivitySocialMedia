import {makeAutoObservable} from "mobx";

export default class PageStatesStore
{
    private _isLoading = false;
    private _isSubmitting = false;

    public constructor()
    {
        makeAutoObservable(this);
    }
    
    public get isLoading()
    {
        return this._isLoading;
    }

    public set isLoading(value)
    {
        this._isLoading = value;
    }

    public get isSubmitting()
    {
        return this._isSubmitting;
    }

    public set isSubmitting(value)
    {
        this._isSubmitting = value;
    }
}