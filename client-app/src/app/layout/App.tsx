import React, {useEffect} from 'react';
import {Container}        from "semantic-ui-react";
import NavBar            from "./NavBar";
import ActivityDashboard from "../../features/activity/dashboard/ActivityDashboard";
import {observer}       from "mobx-react-lite";
import {Route, Switch}  from "react-router-dom";
import HomePage         from "../../features/home/HomePage";
import ActivityForm     from "../../features/activity/form/ActivityForm";
import ActivityDetails  from "../../features/activity/details/ActivityDetails";
import {useLocation}    from 'react-router-dom';
import TestError        from '../../features/errors/TestError';
import {ToastContainer} from "react-toastify";
import NotFound         from "../../features/errors/NotFound";
import ServerError      from "../../features/errors/ServerError";
import LoginForm        from "../../features/user/LoginForm";
import {useStore}       from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer   from "../common/modal/ModalContainer";

function App()
{
    const location = useLocation();
    const {userStore, commonStore} = useStore();

    useEffect(() =>
    {
        if(commonStore.token)
        {
            userStore.loadCurrentUser().finally(() => commonStore.setAppLoaded());
        }
        else
        {
            commonStore.setAppLoaded();
        }
    }, [userStore, commonStore])

    if(!commonStore.appLoaded)
        return <LoadingComponent content={"Loading app..."} />

    return (
        <>
            <ToastContainer position={'bottom-right'} hideProgressBar/>
            <ModalContainer />
            <Route exact path={"/"} component={HomePage}/>
            <Route
                path={'/(.+)'}
                render={() => (
                    <>
                        <NavBar/>
                        <Container style={{marginTop: '7em'}}>
                            <Switch>
                                <Route exact path={"/activities"} component={ActivityDashboard}/>
                                <Route path={"/activities/:id"} component={ActivityDetails}/>
                                <Route key={location.key}
                                       path={["/createActivity", "/manage/:id"]}
                                       component={ActivityForm}/>
                                <Route path={"/errors"} component={TestError}/>
                                <Route path={"/server-error"} component={ServerError}/>
                                <Route path={"/login"} component={LoginForm}/>
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
