import { Button, Container } from "@mui/material";
import Error404 from "../Error404";
import Splash from "../Splash";
import { useUserContext } from "../../contexts/UserContext";
import ContainerWithBackground from "../../components/ContainerWithBackground";
import { Link } from "react-router-dom";
import { PagesNames } from "../../utils/constants";
import BlurBoxContainer from "../../components/BlurBoxContainer";
import Grid from "@mui/material/Grid2";

const Admin: React.FC = () => {
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
            <BlurBoxContainer>
              <Grid container spacing={8}>
              <Grid size={{ md: 12, sm: 12 }} justifyContent={"center"}>
                  <Link to={PagesNames.AdminSettings}>
                    <Button
                      variant="contained"
                      fullWidth
                      style={{ padding: 20 }}
                    >
                      CONFIGURACIÓN
                    </Button>
                  </Link>
                </Grid>
                <Grid size={{ md: 12, sm: 12 }} justifyContent={"center"}>
                  <Link to={PagesNames.AdminTournaments}>
                    <Button
                      variant="contained"
                      fullWidth
                      style={{ padding: 20 }}
                    >
                      MANEJO DE TORNEOS
                    </Button>
                  </Link>
                </Grid>
                <Grid size={{ md: 12, sm: 12 }}>
                  <Link to={PagesNames.AdminBanners}>
                    <Button
                      variant="contained"
                      fullWidth
                      style={{ padding: 20 }}
                    >
                      MANEJO DE BANNERS DE INICIO
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </BlurBoxContainer>
          </Container>
        </ContainerWithBackground>
      )}
    </>
  );
};

export default Admin;
