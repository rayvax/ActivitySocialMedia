import React, {useEffect, useState}  from "react";
import {Button, Grid, Header} from "semantic-ui-react";
import PhotoWidgetDropzone           from "./PhotoWidgetDropzone";
import PhotoWidgetCropper    from "./PhotoWidgetCropper";

interface Props
{
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({loading, uploadPhoto}: Props)
{
    const [files, setFiles] = useState<any[]>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop()
    {
        if(cropper)
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!))
    }

    useEffect(() =>
    {
        return () =>{
            files.forEach((file: any) => URL.revokeObjectURL(file));
        }
    }, [files])

    return (
        <Grid>
            <Grid.Column width={'4'}>
                <Header sub color={'teal'} content={'Step 1 - Upload photo'}/>
                <PhotoWidgetDropzone setFiles={setFiles}/>
            </Grid.Column>
            <Grid.Column width={'1'}/>
            <Grid.Column width={'4'}>
                <Header sub color={'teal'} content={'Step 2 - Resize image'}/>
                {files.length > 0 &&
                    (
                        <PhotoWidgetCropper imagePreview={files[0].preview} setCropper={setCropper} />
                    )
                }
            </Grid.Column>
            <Grid.Column width={'1'}/>
            <Grid.Column width={'4'}>
                <Header sub color={'teal'} content={'Step 1 - Preview upload'}/>
                {files.length > 0 &&
                <>
                    <div className={'img-preview'} style={{minHeight: 182, overflow: "hidden"}} />
                    <Button.Group widths={2} attached={'bottom'}>
                        <Button onClick={onCrop}
                                loading={loading}
                                disabled={loading}
                                icon={"check"}
                                positive />
                        <Button onClick={() => setFiles([])}
                                disabled={loading}
                                icon={"close"} />
                    </Button.Group>
                </>
                }
            </Grid.Column>
        </Grid>
    )
}