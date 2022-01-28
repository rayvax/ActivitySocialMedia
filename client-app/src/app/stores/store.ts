import ActivitiesStore             from "./activityStore";
import {createContext, useContext} from "react";
import CommonStore                 from "./commonStore";
import UserStore                   from "./userStore";
import ModalStore                  from "./modalStore";
import ProfileStore                from "./profileStore";

interface Store
{
    activityStore: ActivitiesStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
}

export const store: Store = {
    activityStore: new ActivitiesStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore()
}

export const StoreContext = createContext(store);

export function useStore()
{
    return useContext(StoreContext);
}