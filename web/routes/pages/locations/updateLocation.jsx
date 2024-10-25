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
import { useNavigate, useParams } from "react-router-dom";
import { useAction, useFindOne } from "@gadgetinc/react"
import { api } from "../../../api";
export default function () {
  const { id } = useParams();
  const [{ data: locationData, error: locationError, fetching: locationFetching }] = useFindOne(api.locations, String(id), {select: {id: true, business: true, timing: true, service: true}});
  const [tabSelected, setTabSelected] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setTabSelected(selectedTabIndex),[]
  );
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
            {tabSelected === 0 && locationData?
              <Business id={id} update={true} businessData={locationData.business}/> :
              null
            }
            {tabSelected === 1 && locationData?
              <Timing id={id} update={true} timingData={locationData.timing}/> :
              null
            }
            {tabSelected === 2 && locationData?
              <Service id={id} update={true} serviceData={locationData.service}/> :
              null
            }
            {tabSelected === 3 ?
              <Update id={id} update={true} /> :
              null
            }
          </Tabs>
        </Card>
      </Box>
    </Page >
  );
}
