// src/components/UploadMainImage.jsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../supabaseClient';

const UploadMainImage = ({ projectId, onUploadComplete }) => {
    const [imageUrl, setImageUrl] = useState(null);

    const uploadFile = async (file, folder) => {
        console.log("[uploadFile] Starting upload...");
        console.log("[uploadFile] File received:", file);
        const fileExt = file.name.split('.').pop().toLowerCase();
        console.log("[uploadFile] File extension:", fileExt);
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;
        console.log("[uploadFile] File path:", filePath);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error("[uploadFile] User is not authenticated.");
            return null;
        }
        const { data, error } = await supabase.storage
            .from('project-images')
            .upload(filePath, file, { upsert: true });
        console.log("[uploadFile] Upload result:", data, error);
        if (error) {
            console.error("[uploadFile] Upload error:", error);
            return null;
        }
        const { data: { publicUrl }, error: publicUrlError } = supabase.storage
            .from('project-images')
            .getPublicUrl(filePath);
        console.log("[uploadFile] Public URL result:", publicUrl, publicUrlError);
        if (publicUrlError) {
            console.error("[uploadFile] Public URL error:", publicUrlError);
            return null;
        }
        return publicUrl;
    };

    const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
        console.log("[onDrop] Dropped files:", acceptedFiles);
        console.log("[onDrop] Rejected files:", fileRejections);
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            console.log("[onDrop] Uploading file:", file);
            const url = await uploadFile(file, `projects/${projectId}/main`);
            console.log("[onDrop] Uploaded file URL:", url);
            if (url) {
                setImageUrl(url);
                const { error } = await supabase
                    .from('projects')
                    .update({ main_image: url })
                    .eq('id', projectId);
                if (error) {
                    console.error("[onDrop] Error updating project:", error);
                } else {
                    console.log("[onDrop] Project updated successfully with main_image");
                    if (onUploadComplete) onUploadComplete(url);
                }
            }
        } else {
            console.warn("[onDrop] No accepted files!");
        }
    }, [projectId, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxFiles: 1,
    });

    return (
        <div {...getRootProps()} style={{
            border: '2px dashed #888',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragActive ? '#eee' : 'transparent'
        }}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop your image here...</p>
            ) : (
                <p>Drag and drop your main image or click to select</p>
            )}
            {imageUrl && (
                <div style={{ marginTop: '10px' }}>
                    <img src={imageUrl} alt="Main" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                </div>
            )}
        </div>
    );
};

export default UploadMainImage;
