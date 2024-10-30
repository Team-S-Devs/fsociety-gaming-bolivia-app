// Importar Firebase y Firestore
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { nanoid } from "nanoid"; // Se usa nanoid para generar IDs únicos

// Configuración de Firebase (fsociety-gaming-bolivia)
const firebaseConfig = {
  apiKey: "AIzaSyDIOTH4Up2XcleJDCgW2HiNCnWHOhgAWLU",
  authDomain: "fsociety-gaming-bolivia.firebaseapp.com",
  projectId: "fsociety-gaming-bolivia",
  storageBucket: "fsociety-gaming-bolivia.appspot.com",
  messagingSenderId: "395522888773",
  appId: "1:395522888773:web:58f4939f68e0f3f8713f2c",
  measurementId: "G-GTZRSY2XGE"
};

// Inicializar Firebase, Autenticación, Firestore y Storage
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Manejo de autenticación
const db = getFirestore(app); // Base de datos Firestore
const storage = getStorage(app); // Almacenamiento de Firebase

// Definir la función para crear usuarios
const createUsers = async () => {
  const usersCollection = collection(db, "users");

  // Crear 64 usuarios de manera programática
  for (let i = 1; i <= 3; i++) {
    const userId = nanoid(); // Generar ID único
    const nickname = `user${i}`; // Generar nombre de usuario
    const email = `user${i}@gmail.com`; // Email proporcionado
    const password = `password${i}`; // Contraseña básica para cada usuario (deberías mejorar esto para producción)
    const phone = Math.floor(Math.random() * 1000000000); // Número de teléfono aleatorio

    try {
      // Crear usuario en el sistema de autenticación de Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Añadir un nuevo documento de usuario en Firestore con los campos generados
      await addDoc(usersCollection, {
        userId: userId, // ID único generado
        nickname: nickname, // Nombre de usuario
        nicknameLowerCase: nickname.toLowerCase(),
        email: email, // Email proporcionado
        phone: phone, // Número de teléfono generado
        type: "USER", // O alternar entre "USER" y "ADMIN"
        imagePath: {
          ref: `images/${userId}`, // Ruta de ejemplo para la imagen
          url: "" // Aquí se puede actualizar si tienes imágenes de usuario
        },
        bio: "This is a sample bio.",
        range: "WARRIOR" // Otras posibles opciones de rango
      });
      console.log(`Created user ${nickname} with email: ${email} and password: ${password}`);
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  }
};

// Llamar a la función para crear los usuarios
createUsers();

// Exportar las instancias de Firebase
export { auth, db, storage };
