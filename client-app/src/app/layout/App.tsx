import React from 'react';
import {Container}        from "semantic-ui-react";
import NavBar             from "./NavBar";
import ActivityDashboard  from "../../features/activity/dashboard/ActivityDashboard";
import {observer}         from "mobx-react-lite";
import {Route}            from "react-router-dom";
import HomePage           from "../../features/home/HomePage";
import ActivityForm       from "../../features/activity/form/ActivityForm";
import ActivityDetails    from "../../features/activity/details/ActivityDetails";
import {useLocation} from 'react-router-dom';

function App()
{
    const location = useLocation();
    
    return (
        <>
            <Route exact path={"/"} component={HomePage}/>
            <Route 
                path={'/(.+)'}
                render={() => (
                    <>
                        <NavBar/>
                        <Container style={{marginTop: '7em'}}>
                            <Route exact path={"/activities"} component={ActivityDashboard}/>
                            <Route path={"/activities/:id"} component={ActivityDetails}/>
                            <Route key={location.key} path={["/createActivity", "/manage/:id"]} component={ActivityForm}/>
                        </Container>
                    </>
                )}
            />
            
        </>
    );
}

export default observer(App);