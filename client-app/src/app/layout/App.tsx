import React, {useEffect} from 'react';
import {Container}        from "semantic-ui-react";
import NavBar             from "./NavBar";
import ActivityDashboard  from "../../features/activity/dashboard/ActivityDashboard";
import {observer}         from "mobx-react-lite";
import {Route, Switch}    from "react-router-dom";
import HomePage           from "../../features/home/HomePage";
import ActivityForm       from "../../features/activity/form/ActivityForm";
import ActivityDetails    from "../../features/activity/details/ActivityDetails";
import {useLocation}      from 'react-router-dom';
import TestError          from '../../features/errors/TestError';
import {ToastContainer}   from "react-toastify";
import NotFound           from "../../features/errors/NotFound";
import ServerError        from "../../features/errors/ServerError";
import {useStore}         from "../stores/store";
import LoadingComponent   from "./LoadingComponent";
import ModalContainer     from "../common/modal/ModalContainer";
import ProfilePage        from "../../features/profiles/main/ProfilePage";
import {
    activitiesPath,
    activityPath,
    createActivityPath,
    errorsPath, homePagePath,
    manageActivityPath, profilePath,
    serverErrorPath, vkLoginPath
}                         from "../../utils/paths";
import PrivateRoute       from "./PrivateRoute";
import VkLogin            from "../../features/user/VkLogin";

function App()
{
    const location = useLocation();
    const {userStore, commonStore} = useStore();

    useEffect(() =>
    {
        if (commonStore.token)
        {
            userStore.loadCurrentUser().finally(() => commonStore.setAppLoaded());
        }
        else
        {
            commonStore.setAppLoaded();
        }
    }, [userStore, commonStore])

    if (!commonStore.appLoaded)
        return <LoadingComponent content={"Loading app..."}/>

    return (
        <>
            <ToastContainer position={'bottom-right'} hideProgressBar/>
            <ModalContainer/>
            <Route exact path={homePagePath} component={HomePage}/>
            <Route
                path={'/(.+)'}
                render={() => (
                    <>
                        <NavBar/>
                        <Container style={{marginTop: '7em'}}>
                            <Switch>
                                <PrivateRoute exact path={activitiesPath} component={ActivityDashboard}/>
                                <PrivateRoute path={activityPath(':id')} component={ActivityDetails}/>
                                <PrivateRoute key={location.key}
                                              path={[createActivityPath, manageActivityPath(':id')]}
                                              component={ActivityForm}/>
                                <PrivateRoute path={profilePath(':userName')} component={ProfilePage}/>
                                <PrivateRoute path={errorsPath} component={TestError}/>
                                <Route path={serverErrorPath} component={ServerError}/>
                                <Route path={vkLoginPath} component={VkLogin}/>
                                <Route component={NotFound}/>
                            </Switch>
                        </Container>
                    </>
                )}
            />

        </>
    );
}

export default observer(App);
