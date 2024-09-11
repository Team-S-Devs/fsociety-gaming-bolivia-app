export const validateName = (name: string): string | null => {
    if (!name.trim()) {
      return "El nombre es requerido.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(name)) {
      return "El nombre introducido no es válido.";
    } else if (name.length < 3) {
      return "El nombre debe tener por lo menos 3 caracteres.";
    }
    return null;
};
  
export const validatePhone = (phone: string): string | null => {
    if (!phone) {
      return "El teléfono es requerido.";
    } else if (!/^[67][0-9]{6}$/.test(phone)) {
      return "Por favor, introduce un teléfono válido.";
    }
    return null;
};
  