import { SignedInOrRedirect, SignedOut, SignedOutOrRedirect, Provider, useAuth } from "@gadgetinc/react";
import { Suspense, useEffect } from "react";
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useNavigate, Link } from "react-router-dom";
import { NavMenu } from "@shopify/app-bridge-react";
import { api } from "../api";
import Index from "../routes/index";
import LocationPage from "../routes/pages/locations";
import ReviewPage from "../routes/pages/reviews";
import SettingsPage from "../routes/pages/settings";
import StoreLocatorPage from "../routes/pages/storeLocator";
import StaffPage from "../routes/pages/staff";
import UpdateStaffPage from "../routes/pages/staff/updateStaff";
import AddLocationPage from "../routes/pages/locations/addLocation";
import UpdateLocationPage from "../routes/pages/locations/updateLocation";
import SignedInPage from "../routes/externalPages/signed-in";
import SignInPage from "../routes/externalPages/sign-in";
import SignUpPage from "../routes/externalPages/sign-up";
import ResetPasswordPage from "../routes/externalPages/reset-password";
import VerifyEmailPage from "../routes/externalPages/verify-email";
import ChangePassword from "../routes/externalPages/change-password";
import ForgotPassword from "../routes/externalPages/forgot-password";
import OnlineStorePage from "../routes/onlineStore";
import DetailnlineStorePage from "../routes/detailOnlineStore";
import "./App.css";

const App = () => {
  useEffect(() => {
    document.title = `${process.env.GADGET_APP}`;
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<SignedInOrRedirect><Index /></SignedInOrRedirect>} />
        <Route path="/signed-in" element={<SignedInOrRedirect><SignedInPage /></SignedInOrRedirect>} />
        <Route path="/locations" element={<SignedInOrRedirect><LocationPage /></SignedInOrRedirect>} />
        <Route path="/locations/new" element={<SignedInOrRedirect><AddLocationPage /></SignedInOrRedirect>} />
        <Route path="/locations/edit/:id" element={<SignedInOrRedirect><UpdateLocationPage /></SignedInOrRedirect>} />
        <Route path="/reviews" element={<SignedInOrRedirect><ReviewPage /></SignedInOrRedirect>} />
        <Route path="/settings" element={<SignedInOrRedirect><SettingsPage /></SignedInOrRedirect>} />
        <Route path="/store-locator" element={<SignedInOrRedirect><StoreLocatorPage /></SignedInOrRedirect>} />
        <Route path="/staff" element={<SignedInOrRedirect><StaffPage /></SignedInOrRedirect>} />
        <Route path="/staff/edit/:id" element={<SignedInOrRedirect><UpdateStaffPage /></SignedInOrRedirect>} />
        <Route path="/change-password" element={<SignedInOrRedirect><ChangePassword /></SignedInOrRedirect>} />
        <Route path="/forgot-password" element={<SignedOutOrRedirect><ForgotPassword /></SignedOutOrRedirect>} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email"  element={<VerifyEmailPage />} />
        <Route path="/sign-in" element={<SignedOutOrRedirect><SignInPage /></SignedOutOrRedirect>} />
        <Route path="/sign-up" element={<SignedOutOrRedirect><SignUpPage /></SignedOutOrRedirect>} />
        <Route path="/online-store" element={<OnlineStorePage />} />
        <Route path="/online-store/detail" element={<DetailnlineStorePage />} />
      </Route>
    )
  );

  return (
    <Suspense fallback={<></>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

const Layout = () => {
  const navigate = useNavigate();
  return (
    <Provider api={api} navigate={navigate} auth={window.gadgetConfig.authentication}>
      <Outlet />
      <NavMenu>
        <Link to="/" rel="home">Shop Information</Link>
        <Link to="/locations">Locations</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/store-locator">Store Locator</Link>
        <Link to="/staff">Staff</Link>
        <Link to="/settings">Settings</Link>
      </NavMenu>
    </Provider>
  );
};

export default App;