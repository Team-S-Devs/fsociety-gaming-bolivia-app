import { Container } from "@mui/material";
import Error404 from "../Error404";
import Splash from "../Splash";
import { useUserContext } from "../../contexts/UserContext";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import ViewTournaments from "../../components/tournament/admin/ViewTournaments";

const AdminTournaments: React.FC = () => {
  const { isAdmin, loading } = useUserContext();

  return (
    <>
      {loading ? (
        <Splash />
      ) : !isAdmin ? (
        <Error404 />
      ) : (
        <ContainerWithBackground urlImage="/assets/bannerFsociety.jpg">
          <Container style={{ paddingTop: 78, paddingBottom: 50 }}>
            <ViewTournaments />
          </Container>
        </ContainerWithBackground>
      )}
    </>
  );
};

export default AdminTournaments;
