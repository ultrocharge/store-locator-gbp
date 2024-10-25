import { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  Button,
  Text,
  InlineStack,
  BlockStack,
  Page,
  Card,
  Select,
  Layout,
  Grid,
  Pagination,
  ChoiceList,
  Popover,
  Checkbox,
  Icon
} from '@shopify/polaris';
import { SelectIcon } from '@shopify/polaris-icons';
import { useNavigate, useParams } from "react-router-dom";
import { useAction, useFindOne, useFindMany } from "@gadgetinc/react"
import {api} from "../../../api";
export default function () {
  const { id } = useParams();
  const [{ data: staffData, error: staffError, fetching: staffFetching }] = useFindOne(api.user, String(id));
  const [{ data, error, fetching }, updateStaff] = useAction(api.user.update);
  const [currentPage, setCurrentPage] = useState(1);
  const locationOptions = ['India', 'Japan', 'New York'];
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [popoverActive, setPopoverActive] = useState(false);
  const [storeData, setStoreDate] = useState({
    fullName: "",
    emailId: "",
    phoneNo: "",
    viewPerm: [],
    editPerm: [],
    settingPerm: [],
    role: "",
    password: "",
    roleName: "",
  })
  useEffect(() => {
    if(staffData) {
      setStoreDate(prev => ({
        ...prev,
        fullName: (staffData.firstName || "") + " " + (staffData.lastName || ""),
        emailId: staffData.email,
        phoneNo: staffData.phoneNumber,
        viewPerm: staffData.permission?.viewPermission || [],
        editPerm: staffData.permission?.editPermission || [],
        settingPerm: staffData.permission?.settingPermission || [],
        roleName: staffData.roles[0].name || ""
      }));
      
      setSelectedLocations(staffData?.locations || []);
    }

  }, [staffData]);
  
  const handleSave = async () => {
    let firstName = "";
    let lastName = "";
    if(storeData.fullName) {
      const splitName = storeData.fullName.split(" ");
      firstName = splitName[0] || "";
      lastName = splitName[1] || "";
    };
    const permission = {
      viewPermission: storeData.viewPerm,
      editPermission: storeData.editPerm,
      settingPermission: storeData.settingPerm
    }
    const response = await updateStaff({
        id: id,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: storeData.phoneNo,
        email: storeData.emailId,
        locations: selectedLocations,
        permission: permission
      });
  };

  const roleList = [
    { label: 'signed-in', value: 'signed-in' },
    { label: 'admin', value: 'admin' },
    { label: 'shopify-app-users', value: 'shopify-app-users' },
  ];

  const locationList = [
    { label: 'loaction1', value: 'loaction1' },
    { label: 'loaction2', value: 'loaction2' },
    { label: 'loaction3', value: 'loaction3' },
  ];

  const choiceListData = {
    viewPerm: [
      { label: 'View Location Reviews', value: 'viewLocaReview' },
      { label: 'View Dashboard', value: 'viewDash' },
      { label: 'View Location Information', value: 'viewLocaInfo' },
    ],
    editPerm: [
      { label: 'Reply to Location Reviews', value: 'replyLocaReview' },
      { label: 'Edit Location Information', value: 'editLocaInfo' },
      { label: 'Accept/Reject Locations updates', value: 'locaUpdate' }
    ],
    settingPerm: [
      { label: 'Edit Store Locator', value: 'editStoreLocator' },
      { label: 'Edit General Settings', value: 'editGenerSett' },
    ]
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleInputChange = (value, field) => {
    setStoreDate(prev => ({ ...prev, [field]: value }));
  }

  // Toggle the popover (dropdown)
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  // Handle changes when a checkbox is clicked
  const handleCheckboxChange = (location) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter((selectedRole) => selectedRole !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  // Generate location checkboxes
  const roleCheckboxes = locationOptions.map((location) => (
    <Checkbox
      key={location}
      label={location}
      checked={selectedLocations.includes(location)}
      onChange={() => handleCheckboxChange(location)}
    />
  ));

  // Display the selected roles as a string, or a placeholder if nothing is selected
  const selectedText = selectedLocations.length > 0 ? selectedLocations.join(', ') : 'Select locations';

  
  return (
    <Page fullWidth title="Staff">
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ paddingBlock: '25px', paddingInline: '30px' }}>
              {currentPage === 1 ? (
                <Grid columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}>
                  <Grid.Cell>
                    <BlockStack gap="400">
                      <TextField
                        type="text"
                        label="Full Name"
                        autoComplete="off"
                        onChange={value => handleInputChange(value, 'fullName')}
                        value={storeData.fullName}
                      />
                      <TextField
                        type="text"
                        label="Email Id"
                        autoComplete="off"
                        onChange={value => handleInputChange(value, 'emailId')}
                        value={storeData.emailId}
                      />
                      <TextField
                        type="text"
                        label="Phone No"
                        autoComplete="off"
                        onChange={value => handleInputChange(value, 'phoneNo')}
                        value={storeData.phoneNo}
                      />
                    </BlockStack>
                  </Grid.Cell>
                  <Grid.Cell>
                    <BlockStack gap="400">
                      <Select
                        label="Role"
                        options={roleList}
                        onChange={value => handleInputChange(value, 'role')}
                        value={storeData.role}
                      />
                      <div>
                        <Popover
                          active={popoverActive}
                          activator={
                            <TextField
                              label="Locations"
                              value={selectedText}
                              onFocus={togglePopoverActive}
                              suffix={<Icon source={SelectIcon} />}
                            />
                          }
                          onClose={togglePopoverActive}
                          fullWidth
                        >
                          <Popover.Section>
                            <BlockStack spacing="tight">
                              {roleCheckboxes}
                            </BlockStack>
                          </Popover.Section>
                        </Popover>
                      </div>
                      <TextField
                        type="text"
                        label="Enter New Password"
                        autoComplete="off"
                        onChange={value => handleInputChange(value, 'password')}
                        value={storeData.password}
                      />
                    </BlockStack>
                  </Grid.Cell>
                </Grid>
              ) : (
                <BlockStack gap="400">
                  <InlineStack align="start">
                    <TextField
                      type="text"
                      label="Enter Role Name"
                      autoComplete="off"
                      onChange={value => handleInputChange(value, 'roleName')}
                      value={storeData.roleName}
                    />
                  </InlineStack>
                  <Grid columns={{ xs: '1', sm: '1', md: '2', lg: '3', xl: '3' }}>
                    <Grid.Cell>
                      <ChoiceList
                        allowMultiple
                        title="View Permission"
                        selected={storeData.viewPerm}
                        choices={choiceListData.viewPerm}
                        onChange={value => { handleInputChange(value, "viewPerm") }}
                      />
                    </Grid.Cell>
                    <Grid.Cell>
                      <ChoiceList
                        allowMultiple
                        title="Edit Permission"
                        selected={storeData.editPerm}
                        choices={choiceListData.editPerm}
                        onChange={value => { handleInputChange(value, "editPerm") }}
                      />
                    </Grid.Cell>
                    <Grid.Cell>
                      <ChoiceList
                        allowMultiple
                        title="Settings Permission"
                        selected={storeData.settingPerm}
                        choices={choiceListData.settingPerm}
                        onChange={value => { handleInputChange(value, "settingPerm") }}
                      />
                    </Grid.Cell>
                  </Grid>
                </BlockStack>
              )}
              <InlineStack align="center">
                <div style={{ paddingBlockStart: '50px' }}>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    accessibilityLabel="Add tracking number"
                  >
                    Save
                  </Button>
                </div>
              </InlineStack>
            </div>
          </Card>
          <InlineStack align="center">
            <Pagination
              hasNext={currentPage < 2}
              hasPrevious={currentPage > 1}
              onNext={handleNextPage}
              onPrevious={handlePreviousPage}
            />
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page >

  )
}