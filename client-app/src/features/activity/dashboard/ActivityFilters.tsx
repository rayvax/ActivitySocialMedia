import React          from "react";
import Calendar       from "react-calendar";
import {Header, Menu} from "semantic-ui-react";
import {observer}     from "mobx-react-lite";
import {useStore}     from "../../../app/stores/store";

export default observer(function ActivityFilters()
{
    const {activityStore} = useStore();
    const {predicates, setPredicate} = activityStore;

    return (
        <>
            <Menu vertical size={'large'} style={{width: '100%', marginTop: '1.8em'}}>
                <Header content={'Filters'} icon={'filter'} color={'teal'} attached/>
                <Menu.Item
                    content={'All Activities'}
                    active={predicates.has('all')}
                    onClick={() => setPredicate('all', 'true')}
                />
                <Menu.Item
                    content={"I'm going"}
                    active={predicates.has('isGoing')}
                    onClick={() => setPredicate('isGoing', 'true')}
                />
                <Menu.Item
                    content={"I'm hosting"}
                    active={predicates.has('isHost')}
                    onClick={() => setPredicate('isHost', 'true')}
                />
            </Menu>
            <Header/>
            <Calendar
                onChange={(date: Date) => setPredicate('startDate', date)}
                value={predicates.get('startDate')}
            />
        </>
    )
})