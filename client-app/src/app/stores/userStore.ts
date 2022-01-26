import {User, UserFormValues}            from "../models/user";
import {makeAutoObservable, runInAction} from "mobx";
import agent                             from "../agent/agent";
import {store}                           from "./store";
import {history}                         from "../../index";

export default class UserStore
{
    user: User | null = null;

    constructor()
    {
        makeAutoObservable(this);
    }

    get isLoggedIn()
    {
        return !!this.user;
    }

    login = async (credentials: UserFormValues) =>
    {
        const user = await agent.Account.login(credentials);
        store.commonStore.setToken(user.token);

        runInAction(() => this.user = user);

        history.push(`/activities`);
        store.modalStore.closeModal();
    }

    logout = () =>
    {
        store.commonStore.setToken(null);
        this.user = null;

        history.push('/');
    }

    register = async (registerValues: UserFormValues) =>
    {
        const user = await agent.Account.register(registerValues);
        store.commonStore.setToken(user.token);

        runInAction(() => this.user = user);

        history.push(`/activities`);
        store.modalStore.closeModal();
    }

    loadCurrentUser = async () =>
    {
        try
        {
            const user = await agent.Account.currentUser();
            runInAction(() => this.user = user);
        }
        catch (error)
        {
            console.log(error)
        }
    }
}