export const validateNickname = (name: string): string | null => {
    if (name.length < 3 || name.length > 20) {
      return "El nombre debe tener entre 3 y 20 caracteres";
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

export const validateUserId = (userId: string) : string | null => {
  if(!userId) {
    return "El ID es requerido."
  } else if(userId.length < 7 || userId.length > 12) {
    return "El ID debe tener entre 7 y 12 caracteres"
  }
  return null;
}
  