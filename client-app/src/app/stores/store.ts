import ActivitiesStore             from "./activityStore";
import {createContext, useContext} from "react";
import PageStatesStore             from "./pageStatesStore";

interface Store 
{
    activityStore: ActivitiesStore;
    pageStatesStore: PageStatesStore;
}

export const store: Store = {
    activityStore: new ActivitiesStore(),
    pageStatesStore: new PageStatesStore(),
}

export const StoreContext = createContext(store);

export function useStore() 
{
    return useContext(StoreContext);
}