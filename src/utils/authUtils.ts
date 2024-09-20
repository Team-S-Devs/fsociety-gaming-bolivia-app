import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebase-config";
import { toast } from "react-toastify";
import { db } from "../utils/firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
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

export const getTournamentByFakeId = async (fakeId: string): Promise<Tournament | null> => {
  const q = query(
    collection(db, "tournaments"),
    where("fakeId", "==", fakeId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const tournamentDoc = querySnapshot.docs[0];
    return { id: tournamentDoc.id, ...tournamentDoc.data() } as Tournament;
  } else {
    toast.error("No such tournament with that fakeId!");
    return null;
  }
};