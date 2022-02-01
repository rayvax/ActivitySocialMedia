import {Form, Formik}               from "formik";
import React                        from "react";
import {Profile, ProfileFormValues} from "../../app/models/profile";
import {observer}                   from "mobx-react-lite";
import TextInput                    from "../../app/common/form/TextInput";
import TextAreaInput                from "../../app/common/form/TextAreaInput";
import {Button}                     from "semantic-ui-react";
import * as Yup                     from 'yup';
import {useStore}                   from "../../app/stores/store";

interface Props
{
    profile: Profile;
    onSubmitted?: () => void;
}

export default observer(function ProfileEditForm({profile, onSubmitted}: Props)
{
    const {profileStore} = useStore();
    const {updateProfile} = profileStore;

    const validationSchema = Yup.object({
        displayName: Yup.string().required('Display name is required')
    })

    function handleSubmit(profile: ProfileFormValues)
    {
        updateProfile(profile).then(onSubmitted)
    }

    return (
        <Formik initialValues={{displayName: profile.displayName, about: profile.about}}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
            {({isSubmitting, isValid, dirty}) => (
                <Form className={'ui form'}>
                    <TextInput placeholder={'DisplayName'} name={'displayName'}/>
                    <TextAreaInput placeholder={'About me'} name={'about'} rows={5}/>
                    <Button
                        type={'submit'}
                        content={'Update profile'}
                        floated={'right'}
                        positive
                        loading={isSubmitting}
                        disabled={isSubmitting || !dirty || !isValid}
                    />
                </Form>
            )}
        </Formik>
    )
})