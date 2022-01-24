import React      from "react";
import {useStore} from "../../stores/store";
import {observer} from "mobx-react-lite";
import {Modal}    from "semantic-ui-react";

export default observer(function ModalContainer()
{
    const {modalStore} = useStore();

    return (
        <Modal open={modalStore.isOpen} onClose={modalStore.closeModal} size={"mini"}>
            <Modal.Content>
                {modalStore.content}
            </Modal.Content>
        </Modal>
    )
})