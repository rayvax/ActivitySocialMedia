import ServerError                    from "../models/serverError";
import {makeAutoObservable, reaction} from "mobx";

const jwtLocalKey = "jwt";

export default class CommonStore
{
    private _error: ServerError | null = null;
    private _token: string | null = window.localStorage.getItem(jwtLocalKey);
    private _appLoaded = false;

    constructor()
    {
        makeAutoObservable(this);

        reaction(
            () => this._token,
            token =>
            {
                if (token)
                {
                    window.localStorage.setItem(jwtLocalKey, token);
                }
                else
                {
                    window.localStorage.removeItem(jwtLocalKey);
                }
            })
    }

    public set error(value: ServerError | null)
    {
        this._error = value;
    }

    public get error()
    {
        return this._error;
    }

    public setToken(value: string | null)
    {
        this._token = value;
    }

    public get token()
    {
        return this._token;
    }

    public setAppLoaded()
    {
        this._appLoaded = true;
    }

    public get appLoaded()
    {
        return this._appLoaded;
    }
}