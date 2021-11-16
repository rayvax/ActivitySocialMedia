import React, {useEffect}          from "react";
import {Image, Card, Icon, Button} from "semantic-ui-react";
import {useStore}                  from "../../../app/stores/store";
import LoadingComponent  from "../../../app/layout/LoadingComponent";
import {Link, useParams} from 'react-router-dom';
import {observer}        from "mobx-react-lite";

export default observer( function ActivityDetails()
{
    const {activityStore, pageStatesStore} = useStore();
    const {selectedActivity: activity} = activityStore;
    const {id} = useParams<{id: string}>();

    useEffect(() =>
    {
        if(id)
        {
            pageStatesStore.isLoading = true;
            activityStore.loadActivity(id)
                .catch((error) =>
            {
                console.log(error);
            })
                .finally(() => {
                    pageStatesStore.isLoading = false;
            });
        }
    }, [id, activityStore, pageStatesStore])
    
    if (pageStatesStore.isLoading || !activity) return <LoadingComponent/>;

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} alt={activity.category}/>
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta><span>{activity.city}, {activity.venue}</span></Card.Meta>
                <Card.Description>{activity.description}</Card.Description>
                <Card.Description style={{paddingTop: '1em', color: 'grey'}}>
                    <Icon name={"calendar"}/>
                    {activity.date}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={'2'}>
                    <Button as={Link} to={`/manage/${activity.id}`}
                            basic color={"blue"} content={"Edit"}/>
                    <Button as={Link} to={`/activities`}
                            basic color={"grey"} content={"Cancel"}/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
})