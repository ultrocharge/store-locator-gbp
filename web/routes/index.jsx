import {
  Button,
  Page,
  Card,
  BlockStack,
  Text,
  Divider,
  InlineStack,
  Grid
} from "@shopify/polaris";
import { Link } from "react-router-dom";
export default function () {
  return (
    <Page title="Hello Store Locator GBP" primaryAction={<Button><Link to="/reviews" style={{textDecoration: "none", color: "black"}}>Reviews Dashboard</Link></Button>}>
      <BlockStack gap="800">
        <BlockStack gap="400">
          <Text as="h1" variant="headingSm">
            Locations
          </Text>
          <Grid columns={{xs: 1, sm: 1, md: 2, lg: 3, xl: 3,}}>
            <Grid.Cell>
              <Card>
                <BlockStack gap="500">
                  <Text as="h1" variant="headingSm" alignment="center">
                    Total No. of Locations
                  </Text>
                  <Divider />
                </BlockStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell>
              <Card>
                <BlockStack gap="500">
                  <Text as="h1" variant="headingSm" alignment="center">
                    Total No. of Locations Active
                  </Text>
                  <Divider />
                </BlockStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell>
              <Card>
                <BlockStack gap="500">
                  <Text as="h1" variant="headingSm" alignment="center">
                    Total No. of Locations Inactive
                  </Text>
                  <Divider />
                </BlockStack>
              </Card>
            </Grid.Cell>
          </Grid>
        </BlockStack>
        
        <BlockStack gap="400">
          <Text as="h1" variant="headingSm">
            Reviews
          </Text>
          <Grid columns={{xs: 1, sm: 1, md: 2, lg: 3, xl: 3,}}>
            <Grid.Cell>
              <Card>
                <BlockStack gap="500">
                  <Text as="h1" variant="headingSm" alignment="center">
                    Total No. of Reviews
                  </Text>
                  <Divider />
                </BlockStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell>
              <Card>
                <BlockStack gap="500">
                  <Text as="h1" variant="headingSm" alignment="center">
                    Total No. of Top Rated
                  </Text>
                  <Divider />
                </BlockStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell>
              <Card>
                <BlockStack gap="500">
                  <Text as="h1" variant="headingSm" alignment="center">
                    Total No. of Reviews Interacted
                  </Text>
                  <Divider />
                </BlockStack>
              </Card>
            </Grid.Cell>
          </Grid>
        </BlockStack>
  
        <BlockStack gap="400">
          <Text as="h1" variant="headingSm">
            Insights
          </Text>
          <Grid columns={{xs: 1, sm: 1, md: 2, lg: 3, xl: 3,}}>
            <Grid.Cell>
              <Card>
                <BlockStack gap="500">
                  <Text as="h1" variant="headingSm" alignment="center">
                    Total No. of Visitors
                  </Text>
                  <Divider />
                </BlockStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell>
              <Card>
                <BlockStack gap="500">
                  <Text as="h1" variant="headingSm" alignment="center">
                    Total No. of Searched
                  </Text>
                  <Divider />
                </BlockStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell>
              <Card>
                <BlockStack gap="500">
                  <Text as="h1" variant="headingSm" alignment="center">
                    Total No. of Visits to Store Page
                  </Text>
                  <Divider />
                </BlockStack>
              </Card>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </BlockStack>
    </Page>
  );
}