import React                        from "react";
import {useStore}                   from "../../app/stores/store";
import {Container, Header, Segment} from "semantic-ui-react";
import {observer}                   from "mobx-react-lite";

export default observer(function ServerError()
{
    const {commonStore} = useStore();

    return (
        <Container>
            <Header as='h2' content={'Server Error'}/>
            <Header sub as={'h3'} content={commonStore.error?.message} color={'red'}/>
            {commonStore.error?.details &&
            <Segment>
                <Header sub as={'h4'} content={'Stack Trace'} color={'teal'} style={{marginBottom: '10px'}} />
                <code>{commonStore.error.details}</code>
            </Segment>
            }
        </Container>
    )
})