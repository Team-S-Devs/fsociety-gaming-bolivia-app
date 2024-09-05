import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Splash from "./pages/Splash";
import Error404 from "./pages/Error404";
import Authentication from "./pages/Authentication";
import { useUserContext } from "./contexts/UserContext";
import Admin from "./pages/Admin";
import { PagesNames } from "./utils/constants";
import Header from "./components/Header";
import Home from "./pages/Home";
import WhatsAppButton from "./components/buttons/WhatsappButton";

const AppRouter: React.FC = () => {
  const { isAdmin, loading } = useUserContext();

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
                Component={loading ? Splash : isAdmin ? Admin : Error404}
              />
              <Route path={PagesNames.Error} Component={Error404} />
              <Route path="*" Component={Error404} />
            </Routes>

            <WhatsAppButton/>
          </BrowserRouter>
        </>
      )}
    </>
  );
};

export default AppRouter;
