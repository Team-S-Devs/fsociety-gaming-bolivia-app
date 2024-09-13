export const validateName = (name: string): string | null => {
    if (!name.trim()) {
      return "El nombre es requerido.";
    } else if (!/^[a-zA-Z0-9._-]{3,16}$/.test(name)) {
      return "El nombre de usuario debe tener entre 3 y 16 caracteres y solo puede contener letras, números, puntos, guiones bajos y guiones medios.";
    } else if (name.length < 3) {
      return "El nombre debe tener por lo menos 3 caracteres.";
    }
    return null;
};
  
export const validatePhone = (phone: string): string | null => {
    if (!phone) {
      return "El teléfono es requerido.";
    } else if (!/^[67][0-9]{7}$/.test(phone)) {
      return "Por favor, introduce un teléfono válido.";
    }
    return null;
};
  