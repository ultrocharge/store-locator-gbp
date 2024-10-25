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
import { api } from "../../api";
import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAction, useAuth } from "@gadgetinc/react";

export default function () {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const [{ error: verifyEmailError, data }, verifyEmail] = useAction(api.user.verifyEmail);
  const verificationAttempted = useRef(false);
  const { configuration } = useAuth();
  useEffect(() => {
    if (!verificationAttempted.current) {
      code && verifyEmail({ code });
      verificationAttempted.current = true;
    }
  }, []);

  if (verifyEmailError) {
    return <p className="format-message error">{verifyEmailError.message}</p>;
  }

  return data ? (
     <Page>
      <BlockStack gap="800" align="center" inlineAlign="center">
        <Text variant="headingXl" as="h2">
          Email has been verified successfully. 
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
  ) : null;
}