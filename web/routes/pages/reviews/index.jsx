import {
  IndexTable,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  useBreakpoints,
  Button,
  Page,
  TextField,
  Pagination,
  Box,
  InlineStack,
  Modal,
  BlockStack,
  Icon
} from '@shopify/polaris';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import {
  StarFilledIcon
} from '@shopify/polaris-icons';
export default function () {
  const navigate = useNavigate();
  const { mode, setMode } = useSetIndexFiltersMode();

  const locations = [
    {
      date: '23/12/2024',
      businessName: 'Prisma Store - Chengalpattu',
      cutomer: 'Sudha Nidhi',
      rating: 3,
      review: 'Hi I have products from both your company and madake.in and definitely both are bamboo cotton but theirs is a bit thicker. The material is same but i recommend you to add a bit of more thickness. Try their product once- madake.in Also i am not a sponsor or promoter. I am a simple customer who loves bamboo towels.',
      reply: 'Yet to reply',
    },
    {
      date: '22/12/2024',
      businessName: 'Prisma Store - Chengalpattu',
      cutomer: 'Sudha Nidhi',
      rating: 5,
      review: 'Hi I have products from both your company and madake.in and definitely both are bamboo cotton but theirs is a bit thicker. The material is same but i recommend you to add a bit of more thickness. Try their product once- madake.in Also i am not a sponsor or promoter. I am a simple customer who loves bamboo towels.',
      reply: 'Yet to reply',
    },
  ];

  const resourceName = {
    singular: 'location',
    plural: 'locations',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(locations);


  const [active, setActive] = useState(false);

  const handleOpen = useCallback(() => setActive(true), []);

  const handleClose = useCallback(() => {
    setActive(false);
  }, []);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set how many items you want to display per page

  const totalPages = Math.ceil(locations.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Start Table Sorting
  const [sortSelected, setSortSelected] = useState(['date asc']);
  const [sortedLocations, setSortedLocations] = useState([]);

  useEffect(() => {
    const sorted = applySorting(locations, sortSelected);
    setSortedLocations(sorted);
  }, [sortSelected]);

  const sortOptions = [
    { label: 'Date', value: 'date asc', directionLabel: 'A-Z' },
    { label: 'Date', value: 'date desc', directionLabel: 'Z-A' },
    { label: 'Business Name', value: 'businessName asc', directionLabel: 'A-Z' },
    { label: 'Business Name', value: 'businessName desc', directionLabel: 'Z-A' },
    { label: 'Customer Name', value: 'cutomer asc', directionLabel: 'A-Z' },
    { label: 'Customer Name', value: 'cutomer desc', directionLabel: 'Z-A' },
    { label: 'Ratings', value: 'rating asc', directionLabel: 'Ascending' },
    { label: 'Ratings', value: 'rating desc', directionLabel: 'Descending' },
    { label: 'Reviews', value: 'review asc', directionLabel: 'Ascending' },
    { label: 'Reviews', value: 'review desc', directionLabel: 'Descending' },
    { label: 'Reply Status', value: 'reply asc', directionLabel: 'Ascending' },
    { label: 'Reply Status', value: 'reply desc', directionLabel: 'Descending' }
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
    'Business Name',
    'Ratings'
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
      location.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.cutomer.toLowerCase().includes(searchQuery.toLowerCase());

    return isFilterMatched && isSearchMatched;
  });

  const rowMarkup = filteredLocations.map(
    (
      { date, businessName, cutomer, rating, review, reply },
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
            {date}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {businessName}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {cutomer}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <InlineStack>
            {Array.from({ length: rating }).map((_, index) => {
              return (
                <Icon
                  key={index}
                  source={StarFilledIcon}
                  tone="success"
                />
              )
            })}
          </InlineStack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ width: '400px', textWrap: 'wrap' }}>
            <Text variant="bodyMd" as="span">
              {review}
            </Text>
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {reply}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'nowrap' }}>
            <Button variant="primary" onClick={handleOpen}>Reply</Button>
            <Button onClick={handleOpen}>Publish</Button>
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page fullWidth title="Reviews">
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
          { title: 'Date' },
          { title: 'Business Name' },
          { title: 'Customer Name' },
          { title: 'Ratings' },
          { title: 'Reviews' },
          { title: 'Reply Status' },
          { title: 'Action' },
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

      <Modal
        instant
        open={active}
        onClose={handleClose}
        title="You Reply"
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField
              type="text"
              labelHidden
              label="Description"
              name="description"
              placeholder="This reply is public and will appear on google location reviews. Reply & Publish action will publish the review on Shopify Store Locator"
              multiline={8}
            />
            <InlineStack align="end" gap="400">
              <Button>Cancel</Button>
              <Button variant="primary">Reply Only</Button>
              <Button variant="primary">Reply & Public</Button>
            </InlineStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}