import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebase-config";
import { toast } from "react-toastify";
import { db } from "../utils/firebase-config";
import { doc, getDoc } from "firebase/firestore"; 
import { Tournament } from "../interfaces/interfaces";

export class AuthUtils {
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Correo de restablecimiento de contraseña enviado con éxito.");
    } catch (error) {
      toast.error("Hubo un error al enviar el correo de restablecimiento de contraseña.");
      throw error;
    }
  }
}

export const getTournamentById = async (id: string): Promise<Tournament | null> => {
  const docRef = doc(db, "tournaments", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Tournament;
  } else {
    console.log("No such tournament!");
    return null;
  }
};
