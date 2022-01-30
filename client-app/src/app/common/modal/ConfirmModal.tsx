import React, {useState} from "react";
import {Button, Header}  from "semantic-ui-react";

interface Props
{
    confirmCallback: () => void;
    cancelCallback: () => void;
    headerContent?: string;
}

export default function ConfirmModal({confirmCallback, cancelCallback, headerContent}: Props)
{
    const [confirmLoading, setConfirmLoading] = useState(false);

    function handleConfirm()
    {
        setConfirmLoading(true);
        confirmCallback();
    }

    return (
        <>
            <Header content={headerContent || 'Are you sure?'}
                    as={'h2'}
                    color={'teal'}
                    style={{textAlign: 'center', marginBottom: '1em'}}
            />
            <div style={{display:'flex', justifyContent: 'center', width: '100%'}}>
                <Button onClick={handleConfirm}
                        icon={'check'}
                        color={'green'}
                        basic
                        loading={confirmLoading}
                        style={{padding: '1em 2em'}}
                />
                <Button onClick={cancelCallback}
                        icon={'cancel'}
                        color={'red'}
                        basic
                        style={{padding: '1em 2em'}}
                />
            </div>
        </>
    )
}
