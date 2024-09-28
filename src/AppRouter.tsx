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
import PrivacyPolicy from "./pages/docs/PrivacyPolicy";
import ResponsibleDisclosurePolicy from "./pages/docs/ResponsibleDisclosurePolicy";
import TournamentRules from "./pages/docs/TournamentRules";
import Profile from "./pages/Profile";
import EditTournament from "./pages/admin/EditTournament";
import AdminTournaments from "./pages/admin/AdminTournaments";
import AdminBanners from "./pages/admin/AdminBanners";
import AddBanner from "./pages/admin/AddBanner";
import EditBanner from "./pages/admin/EditBanner";
import TournamentDetails from "./pages/TournamentDetails";
import TeamView from "./pages/team/TeamView";

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
                path={PagesNames.AdminTournaments}
                Component={getAdminComponent(AdminTournaments)}
              />
              <Route
                path={PagesNames.AdminBanners}
                Component={getAdminComponent(AdminBanners)}
              />
              <Route
                path={PagesNames.AdminAddBanner}
                Component={getAdminComponent(AddBanner)}
              />
               <Route
                path={`${PagesNames.AdminUpdateBanner}/:id`}
                Component={getAdminComponent(EditBanner)}
              />
              <Route
                path={PagesNames.AdminAddTournament}
                Component={getAdminComponent(AddTournament)}
              />
              <Route path={`${PagesNames.Tournaments}/:fakeId${PagesNames.Teams}/:captainId`} element={<TeamView />} />
              <Route path={PagesNames.Error} Component={Error404} />
              <Route path={PagesNames.Profile} Component={Profile} />
              <Route
                path={PagesNames.PrivacyPolicy}
                Component={PrivacyPolicy}
              />
              <Route
                path={PagesNames.DisclosurePolicy}
                Component={ResponsibleDisclosurePolicy}
              />
              <Route
                path={PagesNames.TournamentRules}
                Component={TournamentRules}
              />
              <Route
                path={`${PagesNames.AdminUpdateTournament}/:fakeId`}
                element={<EditTournament />}
              />

              <Route
                path={`${PagesNames.TournamentDetails}/:fakeId`}
                element={<TournamentDetails />}
              />

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
