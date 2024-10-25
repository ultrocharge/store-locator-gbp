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
import { useAction, useFindOne, useFindMany } from "@gadgetinc/react"
import {api} from "../../../api";
export default function () {
  const [{ data: staffData, error: staffError, fetching: staffFetching }] = useFindMany(api.user);
  const [_, deleteStaff] = useAction(api.user.delete);
  const navigate = useNavigate();
  const { mode, setMode } = useSetIndexFiltersMode();
  const [staff, setStaff] = useState([]);
  const [sortSelected, setSortSelected] = useState(['staffName asc']);
  const [sortedStaff, setSortedStaff] = useState([]);
  const [visible, setVisible] = useState(false);
   useEffect(() => {
    if (staffData) {
      const mappedData = staffData.map(item => ({
        id: item.id,
        staffName: (item.firstName || "") + " " + (item.lastName || ""),
        email: item.email,
        contactNo: item.phoneNumber,
        associcated: String(item.locations)
      }))

      setStaff(mappedData);
    }
  }, [staffData]);

  useEffect(() => {
    setSortedStaff(staff);
  }, [staff]);

  const resourceName = {
    singular: 'staff',
    plural: 'staffs',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(staff);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set how many items you want to display per page

  const totalPages = Math.ceil(staff.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Start Table Sorting

  useEffect(() => {
    const sorted = applySorting(staff, sortSelected);
    setSortedStaff(sorted);
  }, [sortSelected]);

  const sortOptions = [
    { label: 'Staff Name', value: 'staffName asc', directionLabel: 'A-Z' },
    { label: 'Staff Name', value: 'staffName desc', directionLabel: 'Z-A' },
    { label: 'Email Name', value: 'email asc', directionLabel: 'A-Z' },
    { label: 'Email Name', value: 'email desc', directionLabel: 'Z-A' },
    { label: 'Contact No', value: 'contactNo asc', directionLabel: 'A-Z' },
    { label: 'Contact No', value: 'contactNo desc', directionLabel: 'Z-A' },
    { label: 'Associated Locations', value: 'associcated asc', directionLabel: 'Ascending' },
    { label: 'Associated Locations', value: 'associcated desc', directionLabel: 'Descending' },
  ];

  const applySorting = (staff, sortSelected) => {
    if (!sortSelected || sortSelected.length === 0) return staff;
    const [sortField, direction] = sortSelected[0].split(' ');
    return [...staff].sort((a, b) => {
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
    'Active',
    'Inactive'
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
  const paginatedLocations = sortedStaff.slice(startIndex, startIndex + itemsPerPage);

  const filteredLocations = paginatedLocations.filter(location => {
    const isFilterMatched = filterSelected === 'All' || (filterSelected === 'Active' && location.status === true) || filterSelected === 'Inactive' && location.status === false;

    const isSearchMatched =
      location.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.contactNo.toLowerCase().includes(searchQuery.toLowerCase());

    return isFilterMatched && isSearchMatched;
  });

  const rowMarkup = filteredLocations.map(
    (
      {id, staffName, email, contactNo, status, associcated },
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
            {staffName}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {email}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {contactNo}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" as="span">
            {associcated}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {status ? <Badge tone="success">Active</Badge> : <Badge tone="warning">Inactive</Badge>}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'nowrap' }}>
            <Button variant="primary" onClick={() => navigate(`/staff/edit/${id}`)}>Edit</Button>
            <Button  onClick={() => handleDelete(id)}>Delete</Button>
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const handleDelete = (id) => {
    const response = deleteStaff({id});
    if(response) {
      setVisible(true);
    };
  }

  return (
    <>
      {visible ? <Banner title="Deleted Successfully!" tone="success" onDismiss={() => {setVisible(false)}}/> : null }
      <Page fullWidth title="Staff">
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
            { title: 'Staff Name' },
            { title: 'Email' },
            { title: 'Contact No' },
            { title: 'Associated Locations' },
            { title: 'Access Status' },
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
    </>
  );
}