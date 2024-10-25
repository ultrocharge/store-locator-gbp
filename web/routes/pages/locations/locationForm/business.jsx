import { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  FormLayout,
  TextField,
  Select,
  BlockStack,
  Card,
  InlineStack,
  Text,
  Banner
} from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';
import { GoogleMap, useLoadScript, Circle, Marker } from "@react-google-maps/api";
import { api } from "../../../../api";
const libraries = ["places"];
import { useAction } from "@gadgetinc/react"
export default function Business({id, update, businessData}) {
  const [{ data, error, fetching }, updateLocation] = useAction(api.locations.update);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAjOpQ9biCv7-OHpp9nn0KAIzAWVKn_3UI",
    libraries,
  });
  const businessCategory = ['businessCtg1', 'businessCtg2', 'businessCtg3'];
  const stateOptions = ['state1', 'state2', 'state3'];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const [days, setDays] = useState([]);
  const [visible, setVisible] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([{phoneNumber: ""}]);
  const [storeData, setStoreData] = useState({
    storecode: "",
    businessname: "",
    businessctg: "businessCtg1",
    description: "",
    year: currentYear.toString(),
    month: currentMonth.toString(),
    day: currentDay.toString(),
    countrycode: "",
    website: "",
    servicearea: "",
    streetaddress: "",
    streetaddress2: "",
    city: "",
    zipcode: "",
    state: "state1",
  });

  useEffect(() => {
    if(update && businessData) {
        setStoreData(businessData);
        setPhoneNumbers(businessData.phoneNumbers || []);
      }
  }, [update, businessData]);

  const yearOptions = Array.from({ length: 27 }, (_, i) => (2024 + i).toString());
  const monthOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const dayOptions = days.map((dayOption) => dayOption.toString());

  const handleInputChange = (value, field) => {
    setStoreData(prev => ({ ...prev, [field]: value }));
  };

  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

  const getDaysInMonth = (year, month) => {
    const monthNumber = parseInt(month, 10);
    if (monthNumber === 2) {
      return isLeapYear(year) ? 29 : 28;
    }
    return [4, 6, 9, 11].includes(monthNumber) ? 30 : 31;
  };

  useEffect(() => {
    const daysInMonth = getDaysInMonth(storeData.year, storeData.month);
    setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  }, [storeData.year, storeData.month]);

  const handleSubmit = async () => {
    try {
      if(update) {
        const updateData = {
          ...storeData,
          phoneNumbers
        }
        localStorage.setItem('business', JSON.stringify(data))
        const response = await updateLocation({id: id, business: updateData});

        if(response) {
          setVisible(true);
        }
      } else {
        const data = {
          ...storeData,
          phoneNumbers
        }
        localStorage.setItem('business', JSON.stringify(data))
      }
    } catch (err) {
      console.error(err)
    }
  };

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: -3.745,
    lng: -38.523,
  };

  const addPhoneNumber = () => {
    setPhoneNumbers(prev => [...prev, {phoneNumber: ""}])
  };

  const handlePhoneNumberChange = (index, value, field) => {
    const updatePhoneNumbers = [...phoneNumbers];
    updatePhoneNumbers[index][field] = value;
    setPhoneNumbers(updatePhoneNumbers);
  }

  const isAllDataPresent = Object.entries(storeData)
    .filter(([key]) => key !== "streetaddress2")
    .every(([_, value]) => value !== "" && value !== null && value !== undefined);
  return (
    <>
      {visible ? <Banner title="Updated Successfully!" tone="success" onDismiss={() => {setVisible(false)}}/> : null }
      <Grid columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}>
        <Grid.Cell>
          <div style={{ paddingInline: '25px', paddingBlock: '50px' }}>
            <FormLayout>
              <TextField
                type="text"
                name="storecode"
                label="Store Code"
                value={storeData.storecode}
                onChange={e => handleInputChange(e, "storecode")}
                autoComplete="off"
              />
              <TextField
                type="text"
                name="businessname"
                label="Business Name"
                value={storeData.businessname}
                onChange={e => handleInputChange(e, "businessname")}
                autoComplete="off"
              />
              <Select
                name="businessctg"
                label="Business Category"
                options={businessCategory}
                onChange={e => handleInputChange(e, "businessctg")}
                value={storeData.businessctg}
              />
              <BlockStack>
                <TextField
                  type="text"
                  label="Description"
                  name="description"
                  value={storeData.description}
                  onChange={e => handleInputChange(e, "description")}
                  multiline={4}
                  maxLength={750}
                  showCharacterCount
                />
              </BlockStack>
              <BlockStack>
                <div>Opening Date</div>
                <FormLayout.Group condensed>
                  <BlockStack>
                    <label style={{ textAlign: 'center' }}>Year</label>
                    <Select
                      labelHidden
                      name="year"
                      options={yearOptions}
                      onChange={e => handleInputChange(e, "year")}
                      value={storeData.year}
                    />
                  </BlockStack>
                  <BlockStack>
                    <label style={{ textAlign: 'center' }}>Month</label>
                    <Select
                      labelHidden
                      name="month"
                      options={monthOptions}
                      onChange={e => handleInputChange(e, "month")}
                      value={storeData.month}
                    />
                  </BlockStack>
                  <BlockStack>
                    <label style={{ textAlign: 'center' }}>Day</label>
                    <Select
                      name="day"
                      labelHidden
                      options={dayOptions}
                      onChange={e => handleInputChange(e, "day")}
                      value={storeData.day}
                    />
                  </BlockStack>
                </FormLayout.Group>
              </BlockStack>
              <BlockStack>
                <div>Phone Number</div>
                <FormLayout.Group condensed>
                  <Grid columns={{xs: 1, sm: 1, md: 2, lg: 3, xl: 3}}>
                    <Grid.Cell>
                        <BlockStack>
                          <label style={{ textAlign: 'center', fontSize: '10px' }}>Country Code</label>
                          <TextField
                            type="text"
                            name="countrycode"
                            labelHidden
                            label="Day"
                            value={storeData.countrycode}
                            onChange={e => handleInputChange(e, "countrycode")}
                            autoComplete="off"
                          />
                        </BlockStack>
                    </Grid.Cell>
                    {phoneNumbers.map((item, index) => {
                      return (
                        <Grid.Cell key={index}>
                          <BlockStack>
                            <label style={{ textAlign: 'center', fontSize: '10px' }}>{index === 0 ? 'Primary Phone Number' : `Phone Number ${index + 1}`}</label>
                            <TextField
                              type="text"
                              labelHidden
                              label="Phone Number"
                              value={item.phoneNumber}
                              onChange={value => handlePhoneNumberChange(index, value, "phoneNumber")}
                              autoComplete="off"
                            />
                          </BlockStack>
                        </Grid.Cell>
                      )
                    })}
                    <Grid.Cell>
                      <BlockStack>
                        <label style={{ textAlign: 'center', opacity: 0, fontSize: '10px' }}>Add Phone Number</label>
                        <Button icon={PlusIcon} variant="tertiary" onClick= {addPhoneNumber}>Add Phone Number</Button>
                      </BlockStack>
                    </Grid.Cell>
                  </Grid>
                </FormLayout.Group>
              </BlockStack>
              <TextField
                type="text"
                name="website"
                label="Website"
                value={storeData.website}
                onChange={e => handleInputChange(e, "website")}
                autoComplete="off"
              />
              <TextField
                type="text"
                name="servicearea"
                label="Service Area"
                value={storeData.servicearea}
                onChange={e => handleInputChange(e, "servicearea")}
                autoComplete="off"
              />
            </FormLayout>
          </div>
        </Grid.Cell>
        <Grid.Cell>
          <div style={{ paddingInline: '25px' }}>
            <BlockStack gap="200">
              <Card>
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
              </Card>
              <Text variant="bodySm" as="h2">
                Google restricts our ability to manage your map pin. To modify or set your map pin, please see visit Google Business Profiles and make the required changes
              </Text>
              <TextField
                type="text"
                name="streetaddress"
                label="Street Address"
                onChange={e => handleInputChange(e, "streetaddress")}
                value={storeData.streetaddress}
                autoComplete="off"
              />
              <TextField
                type="text"
                name="streetaddress2"
                label="Street Address2(Optional)"
                onChange={e => handleInputChange(e, "streetaddress2")}
                value={storeData.streetaddress2}
                autoComplete="off"
              />
              <TextField
                type="text"
                name="city"
                label="City/Town"
                onChange={e => handleInputChange(e, "city")}
                value={storeData.city}
                autoComplete="off"
              />
              <TextField
                type="text"
                name="zipcode"
                label="Zipcode/Pincode"
                onChange={e => handleInputChange(e, "zipcode")}
                value={storeData.zipcode}
                autoComplete="off"
              />
              <Select
                name="state"
                label="State"
                options={stateOptions}
                onChange={e => handleInputChange(e, "state")}
                value={storeData.state}
              />
            </BlockStack>
          </div>
        </Grid.Cell>
      </Grid >
      <InlineStack align="end">
        <div style={{ paddingInlineEnd: '25px', paddingBlockStart: '20px' }}>
          <Button
            disabled={!isAllDataPresent}
            variant="primary"
            onClick={handleSubmit}
            accessibilityLabel="Add tracking number"
          >
            Save
          </Button>
        </div>
      </InlineStack>
    </>
  );
}