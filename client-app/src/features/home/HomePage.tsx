import React                                       from "react";
import {Link}                                      from "react-router-dom";
import {Button, Container, Header, Image, Segment} from "semantic-ui-react";
import {useStore}                                  from "../../app/stores/store";
import {observer}                                  from "mobx-react-lite";
import LoginForm                                   from "../user/LoginForm";
import RegisterForm               from "../user/RegisterForm";
import {activitiesPath, logoPath} from "../../utils/paths";

export default observer(function HomePage()
{
    const {userStore, modalStore} = useStore();
    
    return (
        <Segment inverted vertical textAlign={'center'} className='masthead'>
            <Container text>
                <Header as={'h1'} inverted>
                    <Image src={logoPath} alt={'logo'} size={'massive'} style={{marginBottom: 12}}/>
                    Reactivities
                </Header>
                {userStore.isLoggedIn
                    ? (
                        <>
                            <Header as={'h2'} inverted content={'Welcome to Reactivities'}/>
                            <Button as={Link}
                                    to={activitiesPath}
                                    size={'huge'}
                                    inverted>
                                Go to activities!
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => modalStore.openModal(<LoginForm/>)}
                                    size={'huge'}
                                    inverted
                            >
                                Login
                            </Button>
                            <Button onClick={() => modalStore.openModal(<RegisterForm/>)}
                                    size={'huge'}
                                    inverted
                            >
                                Register
                            </Button>
                        </>
                    )}
            </Container>
        </Segment>
    )
})