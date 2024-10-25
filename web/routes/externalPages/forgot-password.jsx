import { useActionForm } from "@gadgetinc/react";
import { api } from "../../api";

export default function () {
  const {
    submit,
    register,
    formState: { isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.sendResetPassword);

  return (
    <div style={{display:"flex", justifyContent: "center", width: "100%", paddingBlock:"100px"}}>
      <form className="custom-form" style={{}} onSubmit={submit}>
        <h1 style={{ fontSize: "24px", fontWeight: "600", padding: "17px 0px 10px" }}>
          Reset password
        </h1>
        <input className="custom-input" style={{padding: "2%"}} placeholder="Email" {...register("email")} />
        {isSubmitSuccessful && <p className="success">Email has been sent. Please check your inbox.</p>}
        <button disabled={isSubmitting} type="submit" style={{ padding: "2%" }} className="sign-in-button">
          Send reset link
        </button>
      </form>
    </div>
  );
}
