import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Splash from "./pages/Splash";
import Error404 from "./pages/Error404";
import Authentication from "./pages/Authentication";
import { useUserContext } from "./contexts/UserContext";
import { PagesNames } from "./utils/constants";
import Header from "./components/Header";
import Home from "./pages/Home";
import WhatsAppButton from "./components/buttons/WhatsappButton";
import AddTournament from "./pages/admin/AddTournament";
import Admin from "./pages/admin/Admin";

const AppRouter: React.FC = () => {
  const { isAdmin, loading } = useUserContext();

  const getAdminComponent = (Component: React.FC<{}>) =>
    loading ? Splash : isAdmin ? Component : Error404;

  return (
    <>
      {loading ? (
        <Splash />
      ) : (
        <>
          <BrowserRouter>
            <Header />

            <Routes>
              <Route path="/" Component={Home} />
              <Route path={PagesNames.Auth} Component={Authentication} />
              <Route
                path={PagesNames.Admin}
                Component={getAdminComponent(Admin)}
              />
               <Route
                path={PagesNames.AdminAddTournament}
                Component={getAdminComponent(AddTournament)}
              />
              <Route path={PagesNames.Error} Component={Error404} />
              <Route path="*" Component={Error404} />
            </Routes>

            <WhatsAppButton />
          </BrowserRouter>
        </>
      )}
    </>
  );
};

export default AppRouter;
