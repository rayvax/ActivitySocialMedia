import React from "react";
import {Button, Container, Menu, MenuItem} from "semantic-ui-react";

interface Properties
{
    openForm: () => void;
}

export default function NavBar({openForm} : Properties)
{
    return (
        <Menu inverted fixed={"top"}>
            <Container>
                <MenuItem header>
                    <img src={"/assets/logo.png"} alt={"logo"}/>
                    Reactivities
                </MenuItem>
                <MenuItem name="Activities"/>
                <MenuItem>
                    <Button onClick={openForm}
                            content="Create Activity" positive/>
                </MenuItem>
                
            </Container>
        </Menu>
    )
}