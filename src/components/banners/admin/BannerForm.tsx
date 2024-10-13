import React from "react";
import { TextField, Typography, Box, Switch } from "@mui/material";
import { Banner } from "../../../interfaces/interfaces";
import { LoadingButton } from "@mui/lab";
import FileUpload from "../../inputs/FileUpload";
import styles from "../../../assets/styles/buttons.module.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


interface BannerFormProps {
  banner: Banner;
  setBanner: React.Dispatch<React.SetStateAction<Banner>>;
  submit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  error: string | null;
  success: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  title: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  isEditing?: boolean;
}

const BannerForm: React.FC<BannerFormProps> = ({
  banner,
  setBanner,
  submit,
  error,
  setError,
  success,
  title,
  file,
  setFile,
  setSuccess,
  isEditing = false,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [positionError, setPositionError] = React.useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const parsedValue =
      name === "position" ? (Number(value) == 0 ? "" : Number(value)) : value;

    setBanner({
      ...banner,
      [name]: parsedValue,
    });
  };

  const validateFields = (): boolean => {
    if (!banner.redirectUrl || !banner.position) {
      setError("Por favor, rellena todos los campos.");
      return false;
    }

    if (isNaN(banner.position)) {
      setPositionError("La posición debe ser un número");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFields()) return;

    setLoading(true);
    setError(null);
    try {
      await submit(e);
    } catch (error) {
      setError("Error al enviar el formulario. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const clearSuccessMessageWhenChange = () => {
    if (success) setSuccess(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {success && (
        <Typography color="success" variant="body2">
          {success}
        </Typography>
      )}

      <form onSubmit={handleSubmit} onChange={clearSuccessMessageWhenChange}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <Typography>Visible:</Typography>
          <Switch
            checked={!banner.hidden}
            onChange={() =>
              setBanner((prev) => ({ ...prev, hidden: !prev.hidden }))
            }
            color="secondary"
          />
        </div>

        <TextField
          fullWidth
          margin="normal"
          name="redirectUrl"
          value={banner.redirectUrl}
          onChange={handleInputChange}
          placeholder="https://..."
          label="URL de redirección"
          required
        />

        <TextField
            fullWidth
            margin="normal"
            name="position"
            value={banner.position}
            onChange={handleInputChange}
            placeholder="Posición"
            label="Posición de aparición"
            type="number"
            required
            error={!!positionError}
            helperText={positionError}
        />    

        <div style={{ marginTop: 24 }}>
          <Typography>Banner del torneo:</Typography>
          <FileUpload
            setFile={setFile}
            file={file}
            imgUrl={banner.image.url}
          />
        </div>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          loading={loading}
          className={styles.continueButton}
          style={{ marginTop: 24 }}
        >
          {isEditing
            ? loading
              ? "Editando..."
              : "Editar Banner"
            : loading
            ? "Creando..."
            : "Crear Banner"}
        </LoadingButton>
      </form>
    </Box>
  );
};

export default BannerForm;
