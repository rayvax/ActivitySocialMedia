import React, {useEffect}    from "react";
import {useLocation}         from "react-router-dom";
import * as queryString      from "querystring";
import {history}             from "../../index";
import {vkLoginSuccessState} from "../../utils/paths";
import {useStore}            from "../../app/stores/store";
import LoadingComponent      from "../../app/layout/LoadingComponent";

export default function VkLogin()
{
    const {userStore} = useStore();

    const {hash} = useLocation();
    const {access_token, email, state} = queryString.parse(hash.substring(1));

    useEffect(() =>
    {
        userStore.vkLogin(access_token as string, email as string);
    })
    
    if(state !== vkLoginSuccessState)
        history.push('/');

    return (
        <LoadingComponent content={"Loading account..."} />
    )
}