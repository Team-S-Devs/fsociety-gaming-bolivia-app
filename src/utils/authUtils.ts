import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebase-config";
import { toast } from "react-toastify";

export class AuthUtils {
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Correo de restablecimiento de contraseña enviado con éxito.");
    } catch (error) {
      console.error("Error al enviar el correo de restablecimiento de contraseña:", error);
      toast.error("Hubo un error al enviar el correo de restablecimiento de contraseña.");
      throw error;
    }
  }
}
