import ActivitiesStore             from "./activityStore";
import {createContext, useContext} from "react";
import PageStatesStore             from "./pageStatesStore";
import ErrorsStore                 from "./errorsStore";

interface Store 
{
    activityStore: ActivitiesStore;
    pageStatesStore: PageStatesStore;
    errorsStore: ErrorsStore;
}

export const store: Store = {
    activityStore: new ActivitiesStore(),
    pageStatesStore: new PageStatesStore(),
    errorsStore: new ErrorsStore(),
}

export const StoreContext = createContext(store);

export function useStore() 
{
    return useContext(StoreContext);
}