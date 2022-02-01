import React                                                             from "react";
import { Divider, Grid, Header, Item, Segment, Statistic} from "semantic-ui-react";
import {profileImagePlaceholder}                                         from "../../utils/paths";
import {observer}                                                        from "mobx-react-lite";
import {Profile}                                                         from "../../app/models/profile";
import FollowButton                                                      from "./FollowButton";

interface Props
{
    profile: Profile;
    isCurrentUser: boolean;
}

export default observer(function ProfileHeader({profile}: Props)
{
    return (
        <Segment>
            <Grid>
                <Grid.Column width={'12'}>
                    <Item.Group>
                        <Item>
                            <Item.Image src={profile.image || profileImagePlaceholder} size={'small'} avatar/>
                            <Item.Content verticalAlign={'middle'}>
                                <Header as={'h1'} content={profile.displayName}/>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={'4'}>
                    <Statistic.Group widths={'2'}>
                        <Statistic label={'Followers'} value={profile.followersCount}/>
                        <Statistic label={'Following'} value={profile.followingCount}/>
                    </Statistic.Group>

                    <Divider/>

                    <FollowButton profile={profile} />
                </Grid.Column>
            </Grid>
        </Segment>
    )
})