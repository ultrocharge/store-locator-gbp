import { useState, useEffect } from 'react';
import {
  TextField,
  Checkbox,
  Button,
  Text,
  RadioButton,
  InlineStack,
  BlockStack,
  Grid,
  Banner
} from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';
import { useFindOne, useAction, useFindMany } from "@gadgetinc/react";
import { api } from "../../../../api";
const WeekList = ['Monday', 'Tuesday', 'Wednesday', 'ThursDay', 'Friday', 'Saturday', 'Sunday'];
export default function Timing({id, update, timingData}) {
  const [{ data, error, fetching }, updateLocation] = useAction(api.locations.update);
  const [selected, setSelected] = useState('');
  const [visible, setVisible] = useState(false);
  const [businessHours, setBusinessHours] = useState(
    WeekList.map((day) => ({ day, opensAt: '', closesAt: '', isClosed: false }))
  );

  const [specialHours, setSpecialHours] = useState([
    {
      date: "",
      opensAt: "",
      closesAt: "",
    },
  ]);

  const [specialHour, setSpecialHour] = useState({
    date: "",
    opensAt: "",
    closesAt: "",
  });

  useEffect(() => {
    if(update && timingData) {
      setSelected(timingData.storeStatus);
      setBusinessHours(timingData.businessHours);
      setSpecialHours(timingData.specialHours);
    }
  }, [timingData, update]);

  const handleChange = (value) => setSelected(value);

  const handleBusinessHourChange = (index, field, value) => {
    const updatedHours = [...businessHours];
    updatedHours[index][field] = value;
    setBusinessHours(updatedHours);
  };

  const handleSpecialHourChange = (index, field, value) => {
    const updatedHours = [...specialHours];
    updatedHours[index][field] = value;
    setSpecialHours(updatedHours);
  };

  const handleInputChange = (value, field) => {
    setSpecialHour((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSpecialHour = () => {
    if (!specialHour.date || !specialHour.opensAt || !specialHour.closesAt) return;
    setSpecialHours((prev) => [...prev, specialHour]);
    setSpecialHour({ date: '', opensAt: '', closesAt: '' });
  };

  const handleSave = async () => {
    try {
      if(update) {
        const data = {
          storeStatus: selected,
          businessHours,
          specialHours,
        };
        localStorage.setItem('timing', JSON.stringify(data));
        const response = await updateLocation({id: id, timing: data});

        if(response) {
          setVisible(true);
        }
      } else {
        const data = {
          storeStatus: selected,
          businessHours,
          specialHours,
        };
        
        const business = localStorage.getItem('business');
        if (business) {
          localStorage.setItem('timing', JSON.stringify(data))
        } else {
          alert('Business Required!!!');
        }
      }
    } catch (err) {
      console.error(err)
    }
  };

  const areBusinessHoursFieldFilled = businessHours.every(
    ({ opensAt, closesAt, isClosed }) =>
      (isClosed || (opensAt.trim() !== '' && closesAt.trim() !== ''))
  );
  
  const isAllDataPresent = areBusinessHoursFieldFilled && selected

  return (
    <>
      {visible ? <Banner title="Updated Successfully!" tone="success" onDismiss={() => {setVisible(false)}}/> : null }
      <div style={{ paddingBlock: '25px', paddingInline: '30px' }}>
        <BlockStack gap="800">
          <BlockStack gap="400">
            <Text variant="headingLg" as="h2" alignment="center">
              Store Status
            </Text>
            <Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}>
              <Grid.Cell>
                <RadioButton
                  label="Open with main hours"
                  helpText="Show when your business is open"
                  id="open-with-hr"
                  name="business-hours"
                  checked={selected === 'openwithhr'}
                  onChange={() => handleChange('openwithhr')}
                />
              </Grid.Cell>
              <Grid.Cell>
                <RadioButton
                  label="Open with no main hours"
                  helpText="Don’t show any business hours"
                  id="open-with-no-hr"
                  name="business-hours"
                  checked={selected === 'openwithnohr'}
                  onChange={() => handleChange('openwithnohr')}
                />
              </Grid.Cell>
              <Grid.Cell>
                <RadioButton
                  label="Temporarily closed"
                  helpText="Show that your business will open again in the future"
                  id="temporarily"
                  name="business-hours"
                  checked={selected === 'temporarily'}
                  onChange={() => handleChange('temporarily')}
                />
              </Grid.Cell>
              <Grid.Cell>
                <RadioButton
                  label="Permanently closed"
                  helpText="Show that your business no longer exists"
                  id="permanently"
                  name="business-hours"
                  checked={selected === 'permanently'}
                  onChange={() => handleChange('permanently')}
                />
              </Grid.Cell>
            </Grid>
          </BlockStack>
          <BlockStack gap="400">
            <Text variant="headingLg" as="h2" alignment="center">
              Business Timings
            </Text>
            <InlineStack align="space-between" gap="800">
              <BlockStack gap="400">
                <Text variant="bodyMd" as="h2" alignment="center">
                  Regular Hours
                </Text>
                {businessHours.map((hours, index) => (
                  <InlineStack gap="400" blockAlign="center" key={index}>
                    <Text variant="bodyMd" as="h2" alignment="center">
                      {hours.day}
                    </Text>
                    <InlineStack gap="400">
                      {['opensAt', 'closesAt'].map((field, idx) => (
                        <div style={{ width: '200px' }} key={field}>
                          <TextField
                            type="text"
                            labelHidden
                            label={field}
                            value={hours[field]}
                            onChange={(value) => handleBusinessHourChange(index, field, value)}
                            autoComplete="off"
                            suffix={field === "opensAt" ? "AM" : "PM"}
                            placeholder={field === 'opensAt' ? 'HH:MM' : 'HH:MM'}
                            connectedLeft={
                              <Text variant="bodyMd" as="h2" alignment="center">
                                {idx === 0 ? 'Opens At' : 'Closes At'}
                              </Text>
                            }
                          />
                        </div>
                      ))}
                      <Checkbox
                        label="Closed"
                        checked={hours.isClosed}
                        onChange={(checked) => handleBusinessHourChange(index, 'isClosed', checked)}
                      />
                    </InlineStack>
                  </InlineStack>
                ))}
                <Button icon={PlusIcon} variant="tertiary" textAlign="start">Special Hours</Button>
                <InlineStack gap="400">
                  <div style={{ width: "140px" }}>
                    <TextField
                      type="text"
                      labelHidden
                      label="date"
                      onChange={(e) => handleInputChange(e, "date")}
                      autoComplete="text"
                      placeholder="Date"
                      value={specialHour.date}
                    />
                  </div>
                  <InlineStack gap="400">
                    <div style={{ width: "200px" }}>
                      <TextField
                        type="text"
                        labelHidden
                        label="Open At"
                        onChange={(e) => handleInputChange(e, "opensAt")}
                        autoComplete="off"
                        value={specialHour.opensAt}
                        suffix="AM"
                        placeholder="HH:MM"
                        connectedLeft={
                          <Text variant="bodyMd" as="h2" alignment="center">
                            Open At
                          </Text>
                        }
                      />
                    </div>
                    <div style={{ width: "200px" }}>
                      <TextField
                        type="text"
                        labelHidden
                        label="Closes At"
                        onChange={(e) => handleInputChange(e, "closesAt")}
                        autoComplete="off"
                        value={specialHour.closesAt}
                        suffix="PM"
                        placeholder="HH:MM"
                        connectedLeft={
                          <Text variant="bodyMd" as="h2" alignment="center">
                            Closes At
                          </Text>
                        }
                      />
                    </div>
                    <Button variant="primary" onClick={addSpecialHour}>
                      Add
                    </Button>
                  </InlineStack>
                </InlineStack>
              </BlockStack>
              <BlockStack gap="400">
                <Text variant="bodyMd" as="h2" alignment="center">
                  Special Hours
                </Text>
                {specialHours.map((hours, index) => (
                  <InlineStack gap="400" blockAlign="center" key={index}>
                    <InlineStack gap="400">
                      {['date', 'opensAt', 'closesAt'].map((field, idx) => (
                        <div style={{ width: '200px' }} key={field}>
                          <TextField
                            type="text"
                            labelHidden
                            label={field}
                            value={hours[field]}
                            onChange={(value) => handleSpecialHourChange(index, field, value)}
                            autoComplete="off"
                            suffix={field === "date" ? null : field === "opensAt" ? "AM" : "PM"}
                            placeholder={field === "date" ? "Date" : "HH:MM"}
                            connectedLeft={
                              <Text variant="bodyMd" as="h2" alignment="center">
                                {idx === 0 ? 'Date' : idx ===1 ? 'Opens At' : 'Closes At'}
                              </Text>
                            }
                          />
                        </div>
                      ))}
                    </InlineStack>
                  </InlineStack>
                ))}
              </BlockStack>
            </InlineStack>
          </BlockStack>
        </BlockStack >
        <InlineStack align="end">
          <div style={{ paddingBlockStart: '20px' }}>
            <Button
              disabled={!isAllDataPresent}
              variant="primary"
              onClick={handleSave}
              accessibilityLabel="Add tracking number"
            >
              Save
            </Button>
          </div>
        </InlineStack>
      </div >
    </>
  )
}