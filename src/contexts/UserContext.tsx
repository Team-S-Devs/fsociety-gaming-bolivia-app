import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../utils/firebase-config";
import { UserInterface, UserType } from "../interfaces/interfaces";

interface UserContextType {
  user: User | null;
  userInfo: UserInterface | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const UserContext = createContext<UserContextType>({
  user: null,
  userInfo: null,
  isAdmin: false,
  loading: false,
  setUser: () => {}
});

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (fireBaseUser) => {
      try {
        if (fireBaseUser) {
          setUser(fireBaseUser);
          onSnapshot(doc(db, "users", fireBaseUser.uid), (snapshot) => {
            const userInfo = snapshot.data() as UserInterface;
            setIsAdmin(userInfo.type === UserType.ADMIN);
            setUserInfo(userInfo);
          });
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      } catch (error) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, userInfo, isAdmin, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
