import React                               from "react";
import {Button, Container, Menu, MenuItem} from "semantic-ui-react";
import {NavLink}                           from "react-router-dom";

export default function NavBar()
{
    return (
        <Menu inverted fixed={"top"}>
            <Container>
                <MenuItem as={NavLink} exact to={"/"} header>
                    <img src={"/assets/logo.png"} alt={"logo"}/>
                    Reactivities
                </MenuItem>
                <MenuItem as={NavLink} to={"/activities"} name="Activities"/>
                <MenuItem>
                    <Button as={NavLink} to={"/createActivity"} content="Create Activity" positive/>
                </MenuItem>
                
            </Container>
        </Menu>
    )
}