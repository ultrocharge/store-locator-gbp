import { useActionForm, useAuth } from "@gadgetinc/react";
import { api } from "../../api";
import { useLocation, Link } from "react-router-dom";
import {
  Page,
  Layout,
  BlockStack,
  Text,
  Button,
  Icon,
  InlineStack
} from '@shopify/polaris';
import {
  ArrowRightIcon
} from '@shopify/polaris-icons';
export default function () {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const {
    submit,
    register,
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.resetPassword, {
    defaultValues: {
      code: params.get("code"),
      password: "",
      confirmPassword: "",
    },
  });
  const { configuration } = useAuth();

  return isSubmitSuccessful ? (
    <Page>
      <BlockStack gap="800" align="center" inlineAlign="center">
        <Text variant="headingXl" as="h2">
          Password reset successfully. 
        </Text>
        <Button variant="tertiary">
            <InlineStack gap="100">
              <Text variant="bodyLg" as="h2">
                <Link to="/sign-in" style={{textDecoration: "none", color:"black"}}>Sign in now</Link>
              </Text>
              <Icon
                source={ArrowRightIcon}
                tone="base"
              />
            </InlineStack>
        </Button>
      </BlockStack>
    </Page>
  ) : (
     <div style={{display:"flex", justifyContent: "center", width: "100%", paddingBlock:"100px"}}>
      <form className="custom-form" style={{}} onSubmit={submit}>
        <h1 style={{ fontSize: "24px", fontWeight: "600", padding: "17px 0px 10px" }}>
          Reset password
        </h1>
        <input className="custom-input" style={{padding: "2%"}} placeholder="New password" type="password" {...register("password")} />
        {errors?.user?.password?.message && <p className="format-message error">{errors?.user?.password?.message}</p>}
        <input
          className="custom-input"
          placeholder="Confirm password"
          style={{padding: "2%"}}
          type="password"
          {...register("confirmPassword", {
            validate: (value) => value === watch("password") || "The passwords do not match",
          })}
        />
        {errors?.confirmPassword?.message && <p className="format-message error">{errors.confirmPassword.message}</p>}
        {errors?.root?.message && <p className="format-message error">{errors.root.message}</p>}
        <button disabled={isSubmitting} type="submit" style={{ padding: "2%" }} className="sign-in-button">
          Reset password
        </button>
      </form>
    </div>
  );
}
