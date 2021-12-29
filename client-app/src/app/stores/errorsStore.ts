import ServerError          from "../models/serverError";
import {makeAutoObservable} from "mobx";

export default class ErrorsStore
{
    private _error: ServerError | null = null;
    
    constructor()
    {
        makeAutoObservable(this);
    }

    public set error(value: ServerError | null)
    {
        this._error = value;
    }
    
    public get error()
    {
        return this._error;
    }
}