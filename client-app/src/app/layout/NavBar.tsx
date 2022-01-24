import React                                                from "react";
import {Button, Container, Dropdown, Image, Menu, MenuItem} from "semantic-ui-react";
import {Link, NavLink}                                      from "react-router-dom";
import {observer}                                           from "mobx-react-lite";
import {useStore}                                 from "../stores/store";

export default observer(function NavBar()
{
    const {userStore: {user, logout}} = useStore();

    return (
        <Menu inverted fixed={"top"}>
            <Container>
                <MenuItem as={NavLink} exact to={"/"} header>
                    <img src={"/assets/logo.png"} alt={"logo"}/>
                    Reactivities
                </MenuItem>
                <MenuItem as={NavLink} to={"/activities"} name="Activities"/>
                <MenuItem as={NavLink} to={"/errors"} name="Errors"/>
                <MenuItem>
                    <Button as={NavLink} to={"/createActivity"} content="Create Activity" positive/>
                </MenuItem>
                <MenuItem position={"right"}>
                    <Image src={user?.image || '/assets/user.png'} avatar spaced={"right"} />
                    <Dropdown pointing={'top left'} text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link}
                                           to={`/profile/${user?.userName}`}
                                           content={'My profile'}
                                           icon={'user'} />
                            <Dropdown.Item onClick={logout}
                                           content={'Logout'}
                                           icon={'power'} />
                        </Dropdown.Menu>
                    </Dropdown>
                </MenuItem>
            </Container>
        </Menu>
    )
})