import React, { useCallback } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { IoMdClose } from "react-icons/io";
import { IoImageOutline } from "react-icons/io5";

interface FileUploadProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  imgUrl?: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  file,
  setFile,
  imgUrl = "",
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
    },
    [setFile]
  );

  const handleRemoveFile = () => {
    setFile(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const borderColor = isDragActive ? "#72f7f7" : "#ccc";

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: `2px dashed ${borderColor}`,
        padding: "16px",
        borderRadius: "8px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <input {...getInputProps()} />
      {!file && (imgUrl == "" || !imgUrl) ? (
        <>
          <IoImageOutline color="#fff" size={42} style={{ marginBottom: 12 }} />
          <Typography variant="body2">
            Arrastra y suelta una imagen o haz clic para seleccionar.
          </Typography>
        </>
      ) : (
        <>
          <IconButton
            onClick={handleRemoveFile}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#fff",
            }}
          >
            <IoMdClose size={24} color="#fff" />
          </IconButton>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            {file ? file.name : ""}
          </Typography>
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : imgUrl && imgUrl !== ""
                ? imgUrl
                : undefined
            }
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              borderRadius: "8px",
            }}
          />
        </>
      )}
    </Box>
  );
};

export default FileUpload;
