import {
  Page,
  Layout,
  Banner,
  LegacyCard,
  FormLayout,
  TextField,
  Text,
  InlineStack,
  BlockStack,
  Button,
  Grid,
  Box,
  InlineGrid,
  Divider,
  Icon,
  Scrollable
} from '@shopify/polaris';
import { useState, useEffect } from "react";
import GoogleIcon from "../assets/images/google.svg";
import { Link } from "react-router-dom";
import { GoogleMap, useLoadScript, Circle, Marker } from "@react-google-maps/api";
import { api } from "../api";
import {
  LocationIcon,
  PhoneInIcon,
  AlertCircleIcon,
  StarFilledIcon
} from '@shopify/polaris-icons';
const libraries = ["places"];
export default function() {
  const [tab, setTab] = useState("listView");
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAjOpQ9biCv7-OHpp9nn0KAIzAWVKn_3UI",
    libraries,
  });

  useEffect(() => {
    syncLocations()
  })
    const syncLocations = async () => {
      try {
        const response = await api.syncGoogleProfiles();
        console.log(response, 'response');
        if (response.success) {
          console.log(response, 'response')
        } else {
          console.error("error")
        }
      } catch (error) {
        console.error("Error syncing locations:", error);
      }
    };
  
  const containerStyle = {
    width: '100%',
    height: '500px',
  };

  const center = {
    lat: -3.745,
    lng: -38.523,
  };
  
  const searchList = ['Stores', 'FREE Wi-Fi', 'Car Parking', 'Visa Accepted', 'Wheel Chair Assistance', 'Kids Play Area', 'Vallet Parking'];

  return (
    <Page fullWidth title="Find a nearby store ">
      <Box paddingBlockEnd="800">
        <BlockStack gap="400">
          <Box padding={{xs: "300", sm: "0", md: "0", lg: "0", xl: "0"}}>
            <BlockStack gap="400">
              <Text>Get the store hours, driving directions and services available at a #Store Name# near you.</Text>
              <InlineStack gap="400">
                <TextField type="text" placeholder="Enter zip code, city or state" />
                <InlineStack gap="200">
                  <Button>Search Store</Button>
                  <Button variant="primary">Use my current location</Button>
                </InlineStack>
              </InlineStack>
            </BlockStack>
          </Box>
          
          <div className="customize-tabs">
            <div className={`${tab === "listView" ? "customize-tabs-children-hover" : null} customize-tabs-children`} onClick={() => setTab('listView')}>List View</div>
            <hr />
            <div className={`${tab === "mapView" ? "customize-tabs-children-hover" : null} customize-tabs-children`} onClick={() => setTab('mapView')}>Map View</div>
          </div>

          <div className="fullByWidth">
            <BlockStack gap="400">
              <Box padding={{xs: "300", sm: "0", md: "0", lg: "0", xl: "0"}}>
                <BlockStack gap="200">
                  <Text>44 stores near to your location #Zip Code#, within 25 miles</Text>
                  <div className="scroll-container">
                    {searchList.map((item, index) => {
                      return (
                        <button key={index} style={{textWrap: "nowrap"}} className="searchBtn">{item}</button>
                      )
                    })}
                  </div>
                </BlockStack>
              </Box>
              <InlineGrid columns={{md: ['oneThird', 'oneThird'], lg: ['oneThird', 'oneThird'], xl: ['oneThird', 'twoThirds']}}>
                <Box borderColor="border" borderWidth="025" padding="300" background="bg-fill">
                  <Scrollable shadow style={{height: '500px'}} focusable>
                    <BlockStack gap="400">
                      <InlineStack align="end">
                        <p style={{textDecoration: "underline", fontSize: "12px"}}>1.4 miles away</p>
                      </InlineStack>
                      <BlockStack>
                        <InlineStack align="space-between" gap="200">
                          <Text variant="headingMd" as="h2">Prisma Kiosk-DSL Virtue Mall</Text>
                          <BlockStack>
                            <InlineStack gap="200">
                              <img src={GoogleIcon} width={20} height={20} alt="Google Icon" />
                              <InlineStack>
                                {Array.from({ length: 5 }).map((_, index) => {
                                  return (
                                    <Icon
                                      key={index}
                                      source={StarFilledIcon}
                                      tone="base"
                                    />
                                  )
                                  })}
                                </InlineStack>
                              </InlineStack>
                              <InlineStack align="end">
                                <p style={{textDecoration: "underline", fontSize:"10px"}}>( 1899 reviews )</p>
                              </InlineStack>
                            </BlockStack>
                          </InlineStack>
                        </BlockStack>
                        <Text>2nd Floor, DSL Virtue Mall, Uppal - Ramanthapur Rd, Survey Colony, Industrial Development Area, Uppal, Hyderabad, Telangana 500039</Text>
                        <InlineStack gap="200">
                          <Button icon={LocationIcon}>Get Directions</Button>
                          <Button icon={PhoneInIcon}>Call Store</Button>
                          <Button icon={AlertCircleIcon}><Link  to="/online-store/detail" style={{textDecoration: "none", color: "black"}}>Store Details</Link></Button>
                        </InlineStack>
                        <Divider borderColor="border"/>
                      </BlockStack>
                    </Scrollable>
                  </Box>
                
                  <Box borderColor="border" borderWidth="025">
                    {loadError ? (
                        <div>Error loading maps</div>
                      ) : isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          zoom={8}
                          center={center}
                        />
                      ) : (
                        <div>Loading Map...</div>
                    )}          
                  </Box>
              </InlineGrid>
            </BlockStack>
          </div>

          <div className="mobileByWidth">
            <BlockStack gap="400">
              <Box padding={{xs: "300", sm: "0", md: "0", lg: "0", xl: "0"}}>
                <BlockStack gap="200">
                  <Text>44 stores near to your location #Zip Code#, within 25 miles</Text>
                  <div className="scroll-container">
                    {searchList.map((item, index) => {
                      return (
                        <button key={index} style={{textWrap: "nowrap"}} className="searchBtn">{item}</button>
                      )
                    })}
                   </div>
                </BlockStack>
              </Box>
              <InlineGrid columns={{md: ['oneThird', 'oneThird'], lg: ['oneThird', 'oneThird'], xl: ['oneThird', 'twoThirds']}}>
                {tab === "listView" ? (
                  <Box borderColor="border" borderWidth="025" padding="300" background="bg-fill">
                    <BlockStack gap="400">
                      <InlineStack align="end">
                        <p style={{textDecoration: "underline", fontSize: "12px"}}>1.4 miles away</p>
                      </InlineStack>
                      <BlockStack>
                        <InlineStack align="space-between" gap="200">
                          <Text variant="headingMd" as="h2">Prisma Kiosk-DSL Virtue Mall</Text>
                          <BlockStack>
                            <InlineStack gap="200">
                              <img src={GoogleIcon} width={20} height={20} alt="Google Icon" />
                              <InlineStack>
                                {Array.from({ length: 5 }).map((_, index) => {
                                  return (
                                    <Icon
                                      key={index}
                                      source={StarFilledIcon}
                                      tone="base"
                                    />
                                  )
                                })}
                              </InlineStack>
                            </InlineStack>
                            <InlineStack align="end">
                              <p style={{textDecoration: "underline", fontSize:"10px"}}>( 1899 reviews )</p>
                            </InlineStack>
                          </BlockStack>
                        </InlineStack>
                      </BlockStack>
                      <Text>2nd Floor, DSL Virtue Mall, Uppal - Ramanthapur Rd, Survey Colony, Industrial Development Area, Uppal, Hyderabad, Telangana 500039</Text>
                      <InlineStack gap="200">
                        <Button icon={LocationIcon}>Get Directions</Button>
                        <Button icon={PhoneInIcon}>Call Store</Button>
                        <Button icon={AlertCircleIcon}>Store Details</Button>
                      </InlineStack>
                      <Divider borderColor="border"/>
                    </BlockStack>
                  </Box>
                ) : tab === "mapView" ? (
                  <Box borderColor="border" borderWidth="025">
                    {loadError ? (
                        <div>Error loading maps</div>
                      ) : isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={containerStyle}
                          zoom={8}
                          center={center}
                        />
                      ) : (
                        <div>Loading Map...</div>
                    )}          
                  </Box>
                ) : null}
              </InlineGrid>
            </BlockStack>
          </div>
        </BlockStack>
      </Box>
    </Page>
  )
};