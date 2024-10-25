import {
  Page,
  Text,
  InlineStack,
  BlockStack,
  Button,
  Grid,
  Box,
  InlineGrid,
  Icon,
  VideoThumbnail
} from '@shopify/polaris';
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GoogleIcon from "../assets/images/google.svg";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useFindOne } from "@gadgetinc/react"
import { api } from "../api";
import {
  LocationIcon,
  PhoneInIcon,
  StarFilledIcon,
  ClockIcon,
  PhoneIcon
} from '@shopify/polaris-icons';
const libraries = ["places"];
export default function() {
  const [{ data: locationData, error: locationError, fetching: locationFetching }] = useFindOne(api.locations, "61", {select: {id: true, business: true, timing: true, service: true}});
  const [service, setService] = useState([]);
  const [businessHours, setBusinessHours] = useState([]);
  const [specialHours, setSpecialHours] = useState([]);
  useEffect(() => {
    if(locationData) {
      setService(locationData.service);
      setBusinessHours(locationData.timing.businessHours)
      setSpecialHours(locationData.timing.specialHours)
    }
  }, [locationData])
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAjOpQ9biCv7-OHpp9nn0KAIzAWVKn_3UI",
    libraries,
  });
  
  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const center = {
    lat: -3.745,
    lng: -38.523,
  };
  
  const choiceListData = {
    womenLead: [
      { label: 'Identifies as women-owned', value: 'womenOwned' }
    ],
    accessibility: [
      { label: 'Has assistive hearing loop', value: 'hearingLoop' },
      { label: 'Has wheelchair-accessible seating', value: 'accessibleSeating' },
      { label: 'Has wheelchair-accessible toilet', value: 'accessibleToilet' }
    ],
    amenities: [
      { label: 'Has gender-neutral toilets', value: 'genderNeutralToilets' },
      { label: 'Has toilets', value: 'toilets' },
      { label: 'FREE Wi-Fi', value: 'freeWifi' },
      { label: 'Paid Wi-Fi', value: 'paidWifi' },
    ],
    crowd: [
      { label: 'LGBTQ+ friendly', value: 'lgbtqFriendly' }
    ],
    planning: [
      { label: 'Appointment required', value: 'appointmentRequired' }
    ],
    recycling: [
      { label: 'Has clothing recycling', value: 'clothingRecycling' },
      { label: 'Has electronics recycling', value: 'electronicsRecycling' }
    ],
    parking: [
      { label: 'Free multi-storey car park', value: 'freeMultiStorey' },
      { label: 'Free of charge street parking', value: 'freeStreet' },
      { label: 'Free parking lot', value: 'freeParkingLot' },
      { label: 'On-site parking', value: 'onSiteParking' },
      { label: 'Paid multi-storey car park', value: 'paidMultiStorey' },
      { label: 'Paid parking lot', value: 'paidParkingLot' },
      { label: 'Paid street parking', value: 'paidStreetParking' }
    ],
    serviceOptions: [
      { label: 'Offers kerbside pickup', value: 'kerbsidePickup' },
      { label: 'Offers delivery', value: 'delivery' },
      { label: 'In-store pick-up for online orders', value: 'inStorePickup' },
      { label: 'Has in-store shopping', value: 'inStoreShopping' },
      { label: 'On-site services available', value: 'onSiteServices' },
      { label: 'Offers same-day delivery', value: 'sameDayDelivery' }
    ],
    payments: [
      { label: 'Cash Only', value: 'cashOnly' },
      { label: 'Accepts cheques', value: 'cheques' },
      { label: 'Accepts credit cards', value: 'creditCards' },
      { label: 'Accepts debit cards', value: 'debitCards' },
      { label: 'Accepts Google Pay', value: 'googlePay' },
      { label: 'Accepts NFC mobile payments', value: 'nfcPayments' }
    ],
    cards: [
      { label: 'American Express', value: 'amex' },
      { label: 'China Union Pay', value: 'chinaUnionPay' },
      { label: 'Diners Club', value: 'dinersClub' },
      { label: 'Discover', value: 'discover' },
      { label: 'JCB', value: 'jcb' },
      { label: 'Mastercard', value: 'mastercard' },
      { label: 'Visa', value: 'visa' }
    ]
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1180,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 968,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2
        }
      }
    ]
  };

  const sliderList = [
    {
      label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor neque sed imperdiet nibh lectus feugiat nunc sem.",
      reviewer: "Reviewer’s Name"
    },
    {
      label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor neque sed imperdiet nibh lectus feugiat nunc sem.",
      reviewer: "Reviewer’s Name"
    },
    {
      label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor neque sed imperdiet nibh lectus feugiat nunc sem.",
      reviewer: "Reviewer’s Name"
    }
  ];

  return (
    <Page fullWidth>
      <Box paddingBlock="1200" paddingInline={{xs: "400", sm:"400", md:"2000", lg:"2000", xl:"2000",}} background="bg-fill">
        <BlockStack gap="1200">
          <InlineGrid columns={{md: ['oneThird', 'oneThird'], lg: ['oneThird', 'oneThird'], xl: ['oneThird', 'twoThirds']}}>
            <Box borderColor="border" borderWidth="025" padding="500">
              <BlockStack gap="800">
                <InlineStack align="end">
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
                <InlineStack gap="200" blockAlign="center">
                  <Text variant="headingLg" as="h2">Sacramento Supercenter</Text>
                  <Text variant="bodySm" as="p">(Open Now)</Text>
                </InlineStack>
                <BlockStack align="start" inlineAlign="start" gap="400">
                  <Text>Walmart Supercenter #30818915 Gerber Road, Sacramento, CA 95829</Text>
                  <InlineStack align="start" gap="100">
                    <Icon
                      source={ClockIcon}
                      tone="base"
                    />
                    <Text>Store Timings : Mon - Sun 8am to 10:30pm</Text>
                  </InlineStack>
                  <InlineStack align="start" gap="100">
                    <Icon
                      source={PhoneIcon}
                      tone="base"
                    />
                    <p style={{textDecoration: "underline"}}>+91 73973 98839</p>
                  </InlineStack>
                </BlockStack>
                <InlineStack gap="200">
                  <Button icon={LocationIcon}>Get Directions</Button>
                  <Button icon={PhoneInIcon}>Call Store</Button>
                </InlineStack>
              </BlockStack>
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
          <BlockStack gap="400">
            <Text variant="headingLg" as="h2">
              What customers say about us
            </Text>
            <InlineStack>
              <InlineStack gap="200" align="center">
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
                <Text>4.9 / 5</Text>
              </InlineStack>
              <Text>( 1899 reviews )</Text>
              <Text>Write a review | View All</Text>
            </InlineStack>
            <div style={{ paddingBottom: "40px" }}> {/* Added height to account for dots */}
              <Slider {...settings}>
                {sliderList.map((item, index) => {
                  return (
                    <div key={index}>
                      <div className="custom-carousel">
                        <InlineStack gap="200" align="center">
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
                        <Text alignment="justify">
                          {item.label}
                        </Text>
                        <Text alignment="end" variant="headingMd" as="h2">{item.reviewer}</Text>
                      </div>
                    </div>
                  )
                })}
              </Slider>
            </div>
          </BlockStack>
          <BlockStack gap="400">
            <Text variant="headingLg" as="h2">Services available at the store</Text>
            <Grid columns={{ xs: '1', sm: '2', md: '3', lg: '4', xl: '5' }}>
              {Object.keys(choiceListData).map((category, index) => {
                const filteredItems = choiceListData[category].filter(item => 
                  service[category] && service[category].includes(item.value)
                );
                
                if (filteredItems.length > 0) {
                  return (
                    <Grid.Cell key={index}>
                      <BlockStack gap="400">
                        <Text variant="headingMd" as="h2">{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                        <BlockStack gap="100">
                          {filteredItems.map(item => (
                            <Text key={item.value}>{item.label}</Text>
                          ))}
                        </BlockStack>
                      </BlockStack>
                    </Grid.Cell>
                  );
                } else {
                  return null;
                }
              })}
            </Grid>
          </BlockStack>
          <BlockStack gap="400">
            <Text variant="headingLg" as="h2">
              Store Photos & Videos
            </Text>
            <div style={{ paddingBottom: "40px" }}>
              <Slider {...settings}>
                {sliderList.map((item, index) => {
                  return (
                    <div key={index}>
                      <div style={{ height: "100%", marginBlock: "5px", marginInline: "20px" }}>
                        <VideoThumbnail
                          videoLength={80}
                          thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                          onClick={() => console.log('clicked')}
                        />
                      </div>
                    </div>
                  )
                })}
              </Slider>
            </div>
          </BlockStack>
          <BlockStack gap="800">
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2">
                Store Operating Hours
              </Text>
              <Box paddingInline={{lg:"2000", xl:"2000"}}>
                <InlineStack align="space-between" gap="800">
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2" alignment="center">
                      Regular Hours
                    </Text>
                    {businessHours.map((hours, index) => (
                      <InlineStack align="space-between" gap="1200" blockAlign="center" key={index}>
                        <Text variant="headingMd" as="h2">
                          {hours.day}
                        </Text>
                        <InlineStack gap="1200">
                          <InlineStack gap="400">
                            <Text>Opens At</Text>
                            <Text>{hours.opensAt} AM</Text>
                          </InlineStack>
                          <InlineStack gap="400">
                            <Text>Closes At</Text>
                            <Text>{hours.closesAt} PM</Text>
                          </InlineStack>
                        </InlineStack>
                      </InlineStack>
                    ))}
                  </BlockStack>
                  <BlockStack gap="400">
                    <Text variant="headingMd" as="h2" alignment="center">
                      Special Hours
                    </Text>
                    {specialHours.map((hours, index) => (
                      <InlineStack align="space-between" gap="1200" blockAlign="center" key={index}>
                        <Text variant="headingMd" as="h2">{hours.date}</Text>
                        <InlineStack gap="1200">
                          <InlineStack gap="400">
                            <Text>Opens At</Text>
                            <Text>{hours.opensAt}</Text>
                          </InlineStack>
                          <InlineStack gap="400">
                            <Text>Closes At</Text>
                            <Text>{hours.closesAt}</Text>
                          </InlineStack>
                        </InlineStack>
                      </InlineStack>
                    ))}
                  </BlockStack>
                </InlineStack>
              </Box>
            </BlockStack>
          </BlockStack >
        </BlockStack>
      </Box>
    </Page>
  )
};