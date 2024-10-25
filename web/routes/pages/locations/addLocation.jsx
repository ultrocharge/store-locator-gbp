import { useState, useEffect, useCallback } from 'react';
import {
  Page,
  Card,
  Box,
  Tabs
} from '@shopify/polaris';
import Business from './locationForm/business';
import Timing from './locationForm/timing';
import Service from './locationForm/service';
import Update from './locationForm/update';
export default function () {
  const [tabSelected, setTabSelected] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setTabSelected(selectedTabIndex),[]
  );

  const checkBusinessData = () => {
    const business = localStorage.getItem('business');
    const timing = localStorage.getItem('timing');
    const service = localStorage.getItem('service');
    if (business && !timing) {
      setTabSelected(tabSelected + 1)
    } else if (business && timing && !service) {
      setTabSelected(tabSelected + 2)
    } else if (business && timing && service) {
      setTabSelected(tabSelected + 3)
    }
  };

  useEffect(() => {
    checkBusinessData();
    
    const interval = setInterval(() => {
      checkBusinessData();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    {
      id: 'all-customers-1',
      content: 'Business Details',
      accessibilityLabel: 'All customers',
      panelID: 'all-customers-content-1',
    },
    {
      id: 'accepts-marketing-1',
      content: 'Timings',
      panelID: 'accepts-marketing-content-1',
    },
    {
      id: 'repeat-customers-1',
      content: 'Services',
      panelID: 'repeat-customers-content-1',
    },
    {
      id: 'prospects-1',
      content: 'Update Review',
      panelID: 'prospects-content-1',
    },
  ];

  return (
    <Page fullWidth title="Locations">
      <Box paddingBlockEnd="800">
        <Card roundedAbove="sm">
          <Tabs tabs={tabs} selected={tabSelected} onSelect={handleTabChange}>
            {tabSelected === 0 ?
              <Business /> :
              null
            }
            {tabSelected === 1 ?
              <Timing /> :
              null
            }
            {tabSelected === 2 ?
              <Service /> :
              null
            }
            {tabSelected === 3 ?
              <Update /> :
              null
            }
          </Tabs>
        </Card>
      </Box>
    </Page >
  );
}
