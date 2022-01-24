import {ErrorMessage, Form, Formik} from "formik";
import React                        from "react";
import {observer}                   from "mobx-react-lite";
import {useStore}                   from "../../app/stores/store";
import {Button, Header}      from "semantic-ui-react";
import TextInput                    from "../../app/common/form/TextInput";
import * as Yup                     from "yup";
import ValidationErrors             from "../errors/ValidationErrors";

export default observer(function RegisterForm()
{
    const {userStore} = useStore();
    const validationSchema = Yup.object({
        displayName: Yup.string().required(),
        userName: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required()
    })

    return (
        <Formik
            initialValues={{displayName: "", userName: "", email: "", password: "", error: null}}
            onSubmit={(values, {setErrors}) =>
                userStore.register(values)
                    .catch(error => setErrors({error}))
            }
            validationSchema={validationSchema}
        >
            {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                <Form className={"ui form error"} onSubmit={handleSubmit} autoComplete={"off"}>
                    <Header as='h2' content={"Register to Reactivities"} color={"teal"} textAlign={"center"}/>
                    <TextInput placeholder={"Display Name"} name={"displayName"} />
                    <TextInput placeholder={"Username"} name={"userName"} />
                    <TextInput placeholder={"Email"} name={"email"} />
                    <TextInput placeholder={"Password"} name={"password"} type={"password"} />
                    <ErrorMessage name={'error'} render={() =>
                        (
                            <ValidationErrors errors={errors.error} />
                        )} />
                    <Button content={"Register"}
                            type={"submit"}
                            disabled={!isValid || !dirty || isSubmitting}
                            positive fluid loading={isSubmitting} />
                </Form>
            )}
        </Formik>
    )
})