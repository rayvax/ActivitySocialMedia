import {observer}                                    from 'mobx-react-lite';
import React                                         from 'react'
import {Button, Header, Item, Segment, Image, Label} from 'semantic-ui-react'
import {Activity}                                    from "../../../app/models/activity";
import {Link}                                        from "react-router-dom";
import {formatDate}                                  from "../../../utils/date-fns-utils";
import {useStore}                                    from "../../../app/stores/store";

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props
{
    activity: Activity
}

export default observer(function ActivityDetailedHeader({activity}: Props)
{
    const {activityStore: {updateAttendance, isLoading, cancelSelectedActivityToggle}} = useStore();

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                {activity.isCancelled &&
                    <Label style={{position: 'absolute', zIndex: 1000, left: -14, top: 20}}
                           ribbon
                           color={"red"}
                           content={"Cancelled"}
                    />
                }

                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{color: 'white'}}
                                />
                                <p>{formatDate(activity.date, "dd MMM yyyy")}</p>
                                <p>
                                    Hosted by <strong>
                                    <Link to={`/profiles/${activity.hostUserName}`}>
                                        {activity.host?.displayName}
                                    </Link>
                                </strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.isHosting ? (
                    <>
                        <Button onClick={cancelSelectedActivityToggle}
                                color={activity.isCancelled ? "green" : "red"}
                                floated={"left"}
                                basic
                                loading={isLoading}
                        >
                            {activity.isCancelled ? "Re-activate activity" : "Cancel activity"}
                        </Button>
                        <Button as={Link}
                                to={`/manage/${activity.id}`}
                                disabled={activity.isCancelled}
                                color='orange'
                                floated='right'
                        >
                            Manage Event
                        </Button>
                    </>
                ) : activity.isGoing ? (
                    <Button onClick={updateAttendance} loading={isLoading}>
                        Cancel attendance
                    </Button>
                ) : (
                    <Button onClick={updateAttendance}
                            loading={isLoading}
                            color='teal'
                            disabled={activity.isCancelled}
                    >
                        Join Activity
                    </Button>
                )
                }
            </Segment>
        </Segment.Group>
    )
})