import React, {SyntheticEvent, useState}   from "react";
import {observer}                          from "mobx-react-lite";
import {Card, Header, Image, Grid, Button} from "semantic-ui-react";
import {Photo}                             from "../../../app/models/profile";
import {useStore}                          from "../../../app/stores/store";
import PhotoUploadWidget                   from "../../../app/common/imageUploader/PhotoUploadWidget";
import NotFound                            from "../../errors/NotFound";

export default observer(function ProfilePhotos()
{
    const [inAddPhotoMode, setInAddPhotoMode] = useState(false);
    const [target, setTarget] = useState<string | null>(null);

    const {profileStore} = useStore();
    const {
        profile, isCurrentUser,
        uploadPhoto, isUploading,
        setMainImage, isLoading,
        deleteImage
    } = profileStore;

    if(!profile)
        return <NotFound />

    function handlePhotoUpload(file: Blob)
    {
        uploadPhoto(file).then(() => setInAddPhotoMode(false))
    }

    function handleSetMainPhoto(photo: Photo, event: SyntheticEvent<HTMLButtonElement>)
    {
        if (target)
            return;

        setTarget(event.currentTarget.name);
        setMainImage(photo).then(() => setTarget(null));
    }

    function handleDeletePhoto(photo: Photo, event: SyntheticEvent<HTMLButtonElement>)
    {
        if (target)
            return;

        setTarget(event.currentTarget.name);
        deleteImage(photo).then(() => setTarget(null))
    }

    return (
        <Grid>
            <Grid.Column width={'16'}>
                <Header icon={'image'} content={'Photos'} floated={'left'}/>
                {isCurrentUser &&
                    <Button floated={'right'} basic
                            content={inAddPhotoMode ? 'Cancel' : 'Add photo'}
                            onClick={() => setInAddPhotoMode(!inAddPhotoMode)}
                    />
                }
            </Grid.Column>
            <Grid.Column width={'16'}>
                {inAddPhotoMode ? (
                    <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={isUploading}/>
                ) : (
                    <Card.Group itemsPerRow={5}>
                        {profile.photos?.map(photo =>
                            (
                                <Card key={photo.id}>
                                    <Image src={photo.url}/>
                                    {isCurrentUser &&
                                        <Button.Group widths={2} attached={'bottom'} fluid>
                                            <Button onClick={(event) => handleSetMainPhoto(photo, event)}
                                                    content={"Main"}
                                                    name={'main' + photo.id}
                                                    disabled={photo.isMain}
                                                    loading={isLoading && target === 'main' + photo.id}
                                                    basic
                                                    color={"green"}
                                                    style={{zIndex: 1}}
                                            />
                                            <Button onClick={(event) => handleDeletePhoto(photo, event)}
                                                    icon={'trash'}
                                                    name={photo.id}
                                                    disabled={photo.isMain}
                                                    loading={isLoading && target === photo.id}
                                                    basic
                                                    color={'grey'}
                                            />
                                        </Button.Group>}
                                </Card>
                            ))}
                    </Card.Group>
                )}
            </Grid.Column>
        </Grid>
    )
})