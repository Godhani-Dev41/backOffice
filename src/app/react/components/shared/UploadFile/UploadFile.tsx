/** @jsx jsx */

import { jsx, css } from "@emotion/react";
import { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { CircularProgress, IconButton } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { colors } from "app/react/styles/theme";
import { MediaUpload } from "app/react/types/media";
import { membershipApi } from "app/react/lib/api/membershipApi";
import { environment } from "../../../../../environments/environment";

const userProfileAvatarContentCss = (imgUrl: string | undefined) => css`
  background-color: ${colors.white};
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background-size: cover;
  background-image: url(${imgUrl});
  background-position: center;
`;

const centerCss = (isUploading: boolean) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
  width: 100%;
  color: ${colors.formInputBg};
`;

const userProfileAvatarUploadCss = css`
  position: absolute;
  bottom: 0;

  height: 43px;
  width: 100%;
  line-height: 43px;

  &:hover {
  }
`;

const uploadIconCss = css`
  &.MuiButtonBase-root {
    margin: 0;
    color: ${colors.white};
    display: flex;
  }

  & svg {
    width: 20px;
    height: 20px;
  }
`;

const uploadImageCss = css`
  font-size: 1.2rem;
  display: grid;
  font-weight: 500;
  svg.MuiSvgIcon-root {
    margin: auto;
  }
`;

interface UploadFileProps {
  backgroundImage?: string;
  fileUploaded: (media: MediaUpload) => void;
}

const UploadFile = ({ fileUploaded, backgroundImage }: UploadFileProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState("");

  // TODO fix : and add e:React.ChangeEvent<HTMLInputElement>
  const handleFileSelection = async (e) => {
    if (e.target.files.length) {
      setIsUploading(true);
      const firstSelectedFile = e.target.files[0];
      const uploadedMediaFile = await uploadFileToCloudinary({
        file: firstSelectedFile,
      });

      if (uploadedMediaFile) {
        const uploadMediaData: MediaUpload = {
          file: {
            url: uploadedMediaFile.secure_url,
            provider: "cloudinary",
            fileType: uploadedMediaFile.format,
            mediaKey: uploadedMediaFile.public_id,
            fileName: uploadedMediaFile.original_filename,
          },
          handleType: "main",
        };

        fileUploaded(uploadMediaData);
        setPreview(URL.createObjectURL(firstSelectedFile));
      }

      setIsUploading(false);
    }
  };

  const uploadFileToCloudinary = async ({ file }: { file: File }) => {
    try {
      const cloudinaryApiUrl = environment.CLOUDINARY_API_ROOT;
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", "avatars");
      const response = await fetch(cloudinaryApiUrl, {
        method: "POST",
        body: formData,
      });
      const data = await response.text();

      const uploadFileResponse = JSON.parse(data);

      if (!uploadFileResponse) {
        return null;
      }

      return uploadFileResponse;
    } catch (error) {
      console.error(error);

      return null;
    }
  };

  return (
    <div css={userProfileAvatarContentCss(preview || backgroundImage)}>
      {isUploading && (
        <div css={centerCss(isUploading)}>
          <CircularProgress />
        </div>
      )}
      {!preview && !backgroundImage && (
        <div css={centerCss(isUploading)}>
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <div css={uploadImageCss}>
                <CloudUploadIcon />
                <span> Browse to upload a image </span>
              </div>
            </IconButton>
          </label>
        </div>
      )}
      <div css={userProfileAvatarUploadCss}>
        <input accept="image/*" id="icon-button-file" type="file" hidden onChange={handleFileSelection} />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" aria-label="upload picture" component="span" css={uploadIconCss}>
            <PhotoCameraIcon />
          </IconButton>
        </label>
      </div>
    </div>
  );
};

export default UploadFile;
