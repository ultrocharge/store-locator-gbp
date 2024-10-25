import {
  IndexTable,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  useBreakpoints,
  Badge,
  Button,
  Page,
  TextField,
  Pagination,
  Box,
  InlineStack,
  Banner
} from '@shopify/polaris';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAction, useFindMany } from "@gadgetinc/react"
import { api } from "../../../api";

export default function () {
  const [_, deleteLocation] = useAction(api.locations.delete);
  const [{ data: locationData, error: locationError, fetching: locationFetching }] = useFindMany(api.locations, {
    sort: {
      createdAt: "Descending",
    }
  });
  const [locations, setLocations] = useState([])
  const [sortSelected, setSortSelected] = useState(['storeCode desc']);
  const [sortedLocations, setSortedLocations] = useState([]);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { mode, setMode } = useSetIndexFiltersMode();

  useEffect(() => {
    if (locationData) {
      const mappedData = locationData.map(item => ({
        id: item.id,
        storeCode: item.business.storecode || '',
        businessName: item.business.businessname || '',
        address: item.business.streetaddress + " " + item.business.streetaddress2 + " " + item.business.zipcode + " " + item.business.city + " " + item.business.state
      }));

      setLocations(mappedData);
    }
  }, [locationData]);

  useEffect(() => {
    setSortedLocations(locations);
  }, [locations]);
  
  const resourceName = {
    singular: 'location',
    plural: 'locations',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(locations);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(locations.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Start Table Sorting
  useEffect(() => {
    const sorted = applySorting(locations, sortSelected);
    setSortedLocations(sorted);
  }, [sortSelected, locations]);

  const sortOptions = [
    { label: 'Store Code', value: 'storeCode asc', directionLabel: 'A-Z' },
    { label: 'Store Code', value: 'storeCode desc', directionLabel: 'Z-A' },
    { label: 'Business Name', value: 'businessName asc', directionLabel: 'A-Z' },
    { label: 'Business Name', value: 'businessName desc', directionLabel: 'Z-A' },
    { label: 'Address', value: 'address asc', directionLabel: 'A-Z' },
    { label: 'Address', value: 'address desc', directionLabel: 'Z-A' },
    { label: 'Pending Updates', value: 'pending asc', directionLabel: 'Ascending' },
    { label: 'Pending Updates', value: 'pending desc', directionLabel: 'Descending' },
  ];

  const applySorting = (locations, sortSelected) => {
    if (!sortSelected || sortSelected.length === 0) return locations;
    const [sortField, direction] = sortSelected[0].split(' ');
    return [...locations].sort((a, b) => {
      let comparison = 0;

      if (a.hasOwnProperty(sortField) && b.hasOwnProperty(sortField)) {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        }

        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          comparison = (aValue === bValue) ? 0 : aValue ? 1 : -1;
        }
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  };

  // End Table Sorting

  // Start Table Filtering

  const [filterSelected, setFilterSelected] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const [selected, setSelected] = useState(0);
  const [itemStrings, setItemStrings] = useState([
    'All',
    'Verified',
    'Pending',
    'Closed'
  ]);

  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };

  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => { setFilterSelected(itemStrings[index]) },
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
          {
            type: 'rename',
            onAction: () => { },
            onPrimaryAction: async (value) => {
              const newItemsStrings = tabs.map((item, idx) => {
                if (idx === index) {
                  return value;
                }
                return item.content;
              });
              await sleep(1);
              setItemStrings(newItemsStrings);
              return true;
            },
          },
          {
            type: 'duplicate',
            onPrimaryAction: async (value) => {
              await sleep(1);
              duplicateView(value);
              return true;
            },
          },
          {
            type: 'edit',
          },
          {
            type: 'delete',
            onPrimaryAction: async () => {
              await sleep(1);
              deleteView(index);
              return true;
            },
          },
        ],
  }));

  // End Table Filtering

  // Pagination logic: slice data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLocations = sortedLocations.slice(startIndex, startIndex + itemsPerPage);

  const filteredLocations = paginatedLocations.filter(location => {
    const isFilterMatched = filterSelected === 'All' || (filterSelected === 'Verified' && location.status === true);

    const isSearchMatched =
      location.storeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase());

    return isFilterMatched && isSearchMatched;
  });

  const addNewLocation = () => {
      const business = JSON.parse(localStorage.getItem('business'));
      const timing = JSON.parse(localStorage.getItem('timing'));
      const service = JSON.parse(localStorage.getItem('service'));
      if(business || timing || service) {
        localStorage.removeItem('business');
        localStorage.removeItem('timing');
        localStorage.removeItem('service');
      };
    
      navigate('/locations/new');
  }

  const rowMarkup = filteredLocations.map(
    (
      { id, storeCode, businessName, address, status, pending },
      index,
    ) => (
      <IndexTable.Row
        id={index}
        key={index}
        selected={selectedResources.includes(index)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {storeCode}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {businessName}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ width: '400px', textWrap: 'wrap' }}>
            <Text variant="bodyMd" as="span">
              {address}
            </Text>
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {status ? <Badge tone="success">Verified & Active</Badge> : <Badge tone="warning">Unverified</Badge>}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {pending}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'nowrap' }}>
            <Button variant="primary" onClick={()  => {editLocation(id)}}>Edit</Button>
            <Button onClick={() => handleDelete(id)}>Delete</Button>
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const editLocation = (id) => {
    navigate(`/locations/edit/${id}`);
  };

  const handleDelete = (id) => {
    const response = deleteLocation({id});
    if(response) {
      setVisible(true);
    };
  }

  return (
    <Page fullWidth title="Locations" primaryAction={<Button variant="primary" onClick={addNewLocation}>Create New Location</Button>}>
      {visible ? <Banner title="Deleted Successfully!" tone="success" onDismiss={() => {setVisible(false)}}/> : null }
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        onSort={setSortSelected}
        tabs={tabs}
        selected={selected}
        onSelect={setSelected}
        canCreateNewView
        onCreateNewView={onCreateNewView}
        mode={mode}
      />
      <TextField
        placeholder="Search"
        value={searchQuery}
        onChange={(value) => setSearchQuery(value)}
        clearButton
        onClearButtonClick={() => setSearchQuery('')}
      />
      <IndexTable
        condensed={useBreakpoints().smDown}
        resourceName={resourceName}
        itemCount={filteredLocations?.length || 0}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: 'Store Code' },
          { title: 'Business Name' },
          { title: 'Address' },
          { title: 'Status' },
          { title: 'Pending Updates' },
          { title: 'Actions' },
        ]}
      >
        {rowMarkup}
      </IndexTable>
      <Box padding="500" borderColor="border" borderBlockStartWidth="025">
        <InlineStack align="center">
          <Pagination
            hasNext={currentPage < totalPages}
            hasPrevious={currentPage > 1}
            onNext={handleNextPage}
            onPrevious={handlePreviousPage}
          />
        </InlineStack>
      </Box>
    </Page>
  );
}