import React                                                from "react";
import {Button, Container, Dropdown, Image, Menu, MenuItem} from "semantic-ui-react";
import {Link, NavLink}                                      from "react-router-dom";
import {observer}                                           from "mobx-react-lite";
import {useStore} from "../stores/store";
import {
    activitiesPath,
    createActivityPath,
    errorsPath, homePagePath,
    logoPath,
    profileImagePlaceholder,
    profilePath
}                 from "../../utils/paths";

export default observer(function NavBar()
{
    const {userStore: {user, logout}} = useStore();

    return (
        <Menu inverted fixed={"top"}>
            <Container>
                <MenuItem as={NavLink} exact to={homePagePath} header>
                    <img src={logoPath} alt={"logo"}/>
                    Reactivities
                </MenuItem>
                <MenuItem as={NavLink} to={activitiesPath} name="Activities"/>
                <MenuItem as={NavLink} to={errorsPath} name="Errors"/>
                <MenuItem>
                    <Button as={NavLink} to={createActivityPath} content="Create Activity" positive/>
                </MenuItem>
                <MenuItem position={"right"}>
                    <Image src={user?.image || profileImagePlaceholder} avatar spaced={"right"} />
                    <Dropdown pointing={'top left'} text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link}
                                           to={profilePath(user?.userName || "unknown")}
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