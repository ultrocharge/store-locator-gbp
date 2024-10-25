import {
  InlineStack,
} from '@shopify/polaris';
import GoogleIcon from "../../assets/images/google.svg";
import KaghatiLogo from "../../assets/images/kaghati_logo.jpeg";
import "../../assets/styles/ExternalApp.css";
import { useActionForm, useSession } from "@gadgetinc/react";
import { api } from "../../api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
export default function SignIn() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const {
    register,
    submit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.signIn, {
    onSuccess: async (result) => {
      localStorage.setItem('user', JSON.stringify(result));
      navigate('/');
    }
  });

  return (
    <div className="sign-in-main" style={{ alignItems: "center", padding: "0 15%" }}>
      <div className="card" style={{ alignItems: "center" }}>
        <div className="logo" style={{ display: "flex" }}>
          <img src={KaghatiLogo} width={40} />
          <span className="bold-text">Kaghati</span>
        </div>
        <form className="custom-form" style={{}} onSubmit={submit}>
          <h1 style={{ fontSize: "24px", fontWeight: "600", padding: "17px 0px 10px" }}>
            Sign In
          </h1>
          <Link className="google-oauth-button" style={{ width: "100%" }} to={`/auth/google/start${search}`}>
            <img src={GoogleIcon} width={22} height={22} /> Continue with Google
          </Link>
          <input className="custom-input" style={{ padding: "2%" }} placeholder="Email" {...register("email")} />
          {errors?.user?.email?.message && <p className="format-message error">Email: {errors.user.email.message}</p>}
          <input className="custom-input" style={{ padding: "2%" }} placeholder="Password" type="password" {...register("password")} />
          {errors?.user?.password?.message && <p className="format-message error">Password: {errors.user.password.message}</p>}
          {errors?.root?.message && <p className="format-message error">{errors.root.message}</p>}
          <InlineStack align="end">
            <Link to="/forgot-password">Forgot password?</Link>
          </InlineStack>
          <button disabled={isSubmitting} type="submit" style={{ padding: "2%" }} className="sign-in-button">
            Sign In
          </button>
          <div className="sign-up">
            <p>Don't have an account yet? <Link to="/sign-up">Sign Up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}