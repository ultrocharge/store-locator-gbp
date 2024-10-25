import { useUser, useActionForm } from "@gadgetinc/react";
import { api } from "../../api";
import { Link, useNavigate } from "react-router-dom";
import {
  Page,
  Layout,
  BlockStack,
  Text,
  Button,
  Icon,
  InlineStack
} from '@shopify/polaris';
export default function () {
  const navigate = useNavigate();
  const user = useUser(api);
  const {
    submit,
    register,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.changePassword, { defaultValues: user });

  return isSubmitSuccessful ? (
     <Page>
      <BlockStack gap="800" align="center" inlineAlign="center">
        <Text variant="headingXl" as="h2">
          Password has been changed successfully.
        </Text>
        <button disabled={isSubmitting} type="submit" style={{ padding: "2%" }} className="sign-in-button">
          <Link to="/signed-in" style={{textDecoration: "none", color:"white"}}>Back to profile</Link>
        </button>
      </BlockStack>
    </Page>
  ) : (
    <div style={{display:"flex", justifyContent: "center", width: "100%", paddingBlock:"100px"}}>
      <form className="custom-form" style={{}} onSubmit={submit}>
        <h1 style={{ fontSize: "24px", fontWeight: "600", padding: "17px 0px 10px" }}>
          Change password
        </h1>
        <input className="custom-input" style={{ padding: "2%" }} type="password" placeholder="Current password" {...register("currentPassword")} />
        <input className="custom-input" style={{ padding: "2%" }} type="password" placeholder="New password" {...register("newPassword")} />
        {errors?.user?.password?.message && <p className="format-message error">Password: {errors.user.password.message}</p>}
        {errors?.root?.message && <p className="format-message error">{errors.root.message}</p>}
        <InlineStack align="end">
          <Link to="/signed-in">Back to profile</Link>
        </InlineStack>
        <button disabled={isSubmitting} type="submit" style={{ padding: "2%" }} className="sign-in-button">
          Change password
        </button>
      </form>
    </div>
  );
}
