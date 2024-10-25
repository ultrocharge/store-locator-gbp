import { useState, useEffect } from 'react';
import { BlockStack, ChoiceList, Text, Grid, InlineStack, Button, Banner } from '@shopify/polaris';
import { useFindOne, useAction, useFindMany } from "@gadgetinc/react";
import { api } from "../../../../api";
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

export default function Service({id, update, serviceData}) {
  const [{ data, error, fetching }, updateLocation] = useAction(api.locations.update);
  const [storeData, setStoreData] = useState({
    womenLead: [],
    accessibility: [],
    amenities: [],
    crowd: [],
    planning: [],
    recycling: [],
    parking: [],
    serviceOptions: [],
    payments: [],
    cards: [],
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if(update && serviceData) {
      setStoreData(serviceData);
    }
  }, [update, serviceData])
  
  const handleChange = (value, field) => {
    setStoreData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if(update) {
        localStorage.setItem('service', JSON.stringify(storeData));
        const response = await updateLocation({id: id, service: storeData});
        if(response) {
          setVisible(true);
        }
      } else {
        const business = localStorage.getItem('business');
        const timing = localStorage.getItem('timing');
        if (business && timing) {
          localStorage.setItem('service', JSON.stringify(storeData))
        } else {
          alert('Business && Timing Required!!!');
        }
      }
    } catch(err) {
      console.error(err);
    }
  };

  const isAllDataPresent = Object.values(storeData).some(value => value.length > 0);
  return (
    <>
      {visible ? <Banner title="Updated Successfully!" tone="success" onDismiss={() => {setVisible(false)}}/> : null }
      <div style={{ paddingInline: "30px", paddingBlock: "25px" }}>
        <BlockStack gap="400">
          <Text variant="headingLg" as="h2">From the Business</Text>
          <Grid columns={{ xs: '1', sm: '1', md: '2', lg: '3', xl: '3' }}>
            <Grid.Cell>
              <BlockStack gap="800">
                <ChoiceList
                  allowMultiple
                  title="Women Lead"
                  choices={choiceListData.womenLead}
                  selected={storeData.womenLead}
                  onChange={value => { handleChange(value, "womenLead") }}
                />
                <ChoiceList
                  allowMultiple
                  title="Accessibility"
                  choices={choiceListData.accessibility}
                  selected={storeData.accessibility}
                  onChange={value => { handleChange(value, "accessibility") }}
                />
                <ChoiceList
                  allowMultiple
                  title="Amenities"
                  choices={choiceListData.amenities}
                  selected={storeData.amenities}
                  onChange={value => { handleChange(value, "amenities") }}
                />
                <ChoiceList
                  allowMultiple
                  title="Crowd"
                  choices={choiceListData.crowd}
                  selected={storeData.crowd}
                  onChange={value => { handleChange(value, "crowd") }}
                />
                <ChoiceList
                  allowMultiple
                  title="Planning"
                  choices={choiceListData.planning}
                  selected={storeData.planning}
                  onChange={value => { handleChange(value, "planning") }}
                />
                <ChoiceList
                  allowMultiple
                  title="Recycling"
                  choices={choiceListData.recycling}
                  selected={storeData.recycling}
                  onChange={value => { handleChange(value, "recycling") }}
                />
              </BlockStack>
            </Grid.Cell>
            <Grid.Cell>
              <BlockStack gap="800">
                <ChoiceList
                  allowMultiple
                  title="Parking"
                  choices={choiceListData.parking}
                  selected={storeData.parking}
                  onChange={value => { handleChange(value, "parking") }}
                />
                <ChoiceList
                  allowMultiple
                  title="Service options"
                  choices={choiceListData.serviceOptions}
                  selected={storeData.serviceOptions}
                  onChange={value => { handleChange(value, "serviceOptions") }}
                />
              </BlockStack>
            </Grid.Cell>
            <Grid.Cell>
              <BlockStack gap="800">
                <ChoiceList
                  allowMultiple
                  title="Payments"
                  choices={choiceListData.payments}
                  selected={storeData.payments}
                  onChange={value => { handleChange(value, "payments") }} // Fixed: Correct field for Payments
                />
                <ChoiceList
                  allowMultiple
                  title="Cards"
                  choices={choiceListData.cards}
                  selected={storeData.cards}
                  onChange={value => { handleChange(value, "cards") }} // Fixed: Correct field for Cards
                />
              </BlockStack>
            </Grid.Cell>
          </Grid>
        </BlockStack>
        <InlineStack align="end">
          <div style={{ paddingInlineEnd: '25px' }}>
            <Button
              disabled={!isAllDataPresent}
              variant="primary"
              onClick={handleSubmit}
              accessibilityLabel="Save selected options"
            >
              Save
            </Button>
          </div>
        </InlineStack>
      </div>
    </>
  );
}