import { Container } from "@mui/material";
import Error404 from "../Error404";
import Splash from "../Splash";
import { useUserContext } from "../../contexts/UserContext";

const Admin: React.FC = () => {
  const { isAdmin, loading } = useUserContext();

  return (
    <>
      {loading ? <Splash /> : !isAdmin ? <Error404 /> : <Container></Container>}
    </>
  );
};

export default Admin;
