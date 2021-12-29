import React                        from "react";
import {useStore}                   from "../../app/stores/store";
import {Container, Header, Segment} from "semantic-ui-react";
import {observer}                   from "mobx-react-lite";

export default observer(function ServerError()
{
    const {errorsStore} = useStore();

    return (
        <Container>
            <Header as='h2' content={'Server Error'}/>
            <Header sub  as={'h3'} content={errorsStore.error?.message} color={'red'}/>
            {errorsStore.error?.details &&
            <Segment>
                <Header sub as={'h4'} content={'Stack Trace'} color={'teal'} style={{marginBottom: '10px'}} />
                <code>{errorsStore.error.details}</code>
            </Segment>
            }
        </Container>
    )
})