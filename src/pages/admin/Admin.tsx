import { Container } from "@mui/material";
import Error404 from "../Error404";
import Splash from "../Splash";
import { useUserContext } from "../../contexts/UserContext";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import TournamentsTable from "../../components/tournament/admin/TournamentsTable";

const Admin: React.FC = () => {
  const { isAdmin, loading } = useUserContext();

  return (
    <>
      {loading ? (
        <Splash />
      ) : !isAdmin ? (
        <Error404 />
      ) : (
        <ContainerWithBackground urlImage="/src/assets/bannerFsociety.jpg">
          <Container maxWidth="md">
            <TournamentsTable />
          </Container>
        </ContainerWithBackground>
      )}
    </>
  );
};

export default Admin;
