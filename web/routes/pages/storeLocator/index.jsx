import { useState, useEffect } from 'react';
import { BlockStack, ChoiceList, InlineStack, Button, Page, Layout, Card, RadioButton, Text, Thumbnail, DropZone, Spinner } from '@shopify/polaris';
import { useFindOne, useAction, useFindMany } from "@gadgetinc/react";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { api } from "../../../api";
const choiceListData = {
  businessInfo: [
    { label: 'Hide Phone Number', value: 'phoneNumber' },
    { label: 'Hide Directions', value: 'directions' },
    { label: 'Hide Individual Store Pages', value: 'individualStore' },
    { label: 'Hide Accessibility', value: 'accessibility' },
    { label: 'Hide Amenities', value: 'amenities' },
    { label: 'Hide Crowd', value: 'crowd' },
    { label: 'Hide Planning', value: 'planning' },
    { label: 'Hide Recycling', value: 'recycling' },
    { label: 'Hide Parking', value: 'parking' },
    { label: 'Hide Payments', value: 'payments' },
  ],
  tracking: [
    { label: 'Users can share their location information', value: 'userLocateInfo' },
  ],
};

export default function () {
  const [{ data, error, fetching }, update] = useAction(api.storeLocator.update);
  const [{ data: storeLocatorData, error: storeLocatorError, fetching: storeLocatorFetching }] = useFindOne(api.storeLocator, "1");
  const [file, setFile] = useState(null);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  
  const firebaseConfig = {
    "type": "service_account",
    "project_id": "store-locator-gbp",
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": "firebase-adminsdk-hzz3d@store-locator-gbp.iam.gserviceaccount.com",
    "client_id": process.env.CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hzz3d%40store-locator-gbp.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com",
    "storageBucket": "store-locator-gbp.appspot.com"
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  
  const [storeData, setStoreData] = useState({
    businessInfo: [],
    tracking: [],
    reviews: "",
    ratings: "",
    openLocations: "",
    hourFormat: "",
    storeGroup: "",
    bannerImageUrl: ""
  });

  useEffect(() => {
    if (storeLocatorData) {
      setStoreData({
        ...storeData,
        businessInfo: storeLocatorData.businessInfo,
        tracking: storeLocatorData.tracking,
        reviews: storeLocatorData.reviews,
        ratings: storeLocatorData.ratings,
        openLocations: storeLocatorData.openLocations,
        hourFormat: storeLocatorData.hourFormat,
        storeGroup: storeLocatorData.storeGroup,
        bannerImageUrl: storeLocatorData.bannerImageUrl
      });
    }
    setLoading(false);
  }, [storeLocatorData, uploadedImageUrl]);

  const handleInputChange = (value, field) => {
    setStoreData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await update({
        id: "1",
        businessInfo: storeData.businessInfo,
        tracking: storeData.tracking,
        reviews: storeData.reviews,
        ratings: storeData.ratings,
        openLocations: storeData.openLocations,
        hourFormat: storeData.hourFormat,
        storeGroup: storeData.storeGroup
      })
    } catch (err) {
      console.error(err)
    }
  };
  
  const handleFileChange = async (e) => {
    if (e.target.files) {
      setLoading(true);
      const image = e.target.files[0];
      try {
        const storageRef = ref(storage, `images/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        setUploadedImageUrl(downloadURL);
        await update({
          id: "1",
          bannerImageUrl: downloadURL
        });
      } catch (error) {
          console.error('Error uploading file:', error);
      }
    }
  };

  const handleChange = (value, field) => setStoreData(prev => ({ ...prev, [field]: value }));

  return (
    <Page fullWidth title="Store Locator">
      <Layout>
        <Layout.Section>
          <Card roundedAbove="sm">
            <div style={{ paddingInline: "30px", paddingBlock: "25px" }}>
              <InlineStack gap="800" align="space-around">
                <BlockStack gap="800">
                  <BlockStack>
                    <Text>Reviews</Text>
                    <RadioButton
                      label="Display Google Reviews"
                      id="googleReview"
                      name="reviews"
                      checked={storeData.reviews === 'googleReview'}
                      onChange={() => handleChange('googleReview', 'reviews')}
                    />
                    <RadioButton
                      label="Hide Reviews"
                      id="hideReview"
                      name="reviews"
                      checked={storeData.reviews === 'hideReview'}
                      onChange={() => handleChange('hideReview', 'reviews')}
                    />
                  </BlockStack>
                  <BlockStack>
                    <Text>Ratings</Text>
                    <RadioButton
                      label="Display All Ratings"
                      id="allRating"
                      name="ratings"
                      checked={storeData.ratings === 'allRating'}
                      onChange={() => handleChange('allRating', 'ratings')}
                    />
                    <RadioButton
                      label="Hide Ratings below 3"
                      id="hideRating"
                      name="ratings"
                      checked={storeData.ratings === 'hideRating'}
                      onChange={() => handleChange('hideRating', 'ratings')}
                    />
                  </BlockStack>
                  <ChoiceList
                    allowMultiple
                    title="Show Business Information"
                    choices={choiceListData.businessInfo}
                    selected={storeData.businessInfo}
                    onChange={value => { handleInputChange(value, "businessInfo") }}
                  />
                </BlockStack>
                <BlockStack gap="800">
                  <BlockStack gap="400">
                    <Text>Location Marker Icon</Text>
                    <InlineStack align="start">
                      {loading ? <Spinner accessibilityLabel="Small spinner example" size="small" /> : null}
                      <input
                        id="fileUpload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                        {
                          storeData.bannerImageUrl && !loading ? (
                            <div style={{ cursor: 'pointer' }} onClick={() => {
                                document.getElementById('fileUpload').click();
                              }}>
                               <BlockStack alignment="center">
                                  <Thumbnail
                                    size="medium"
                                    alt="Banner"
                                    source={storeData.bannerImageUrl}
                                  />
                                </BlockStack>
                            </div>
                          ) : !loading ? (
                            <Button onClick={() => {
                                document.getElementById('fileUpload').click();
                              }}>
                              Add file
                            </Button>
                          ): null
                        }
                    </InlineStack>       
                    <Text>Accepts .gif, .jpg, and .png</Text>
                  </BlockStack>
                  <ChoiceList
                    allowMultiple
                    title="Allow Location Tracking"
                    choices={choiceListData.tracking}
                    selected={storeData.tracking}
                    onChange={value => { handleInputChange(value, "tracking") }}
                  />
                  <BlockStack>
                    <Text>Select Opening Location Display Type</Text>
                    <RadioButton
                      label="Default Location"
                      id="default"
                      name="openLocations"
                      checked={storeData.openLocations === 'default'}
                      onChange={() => handleChange('default', 'openLocations')}
                    />
                    <RadioButton
                      label="All Locations in cluster"
                      id="all"
                      name="openLocations"
                      checked={storeData.openLocations === 'all'}
                      onChange={() => handleChange('all', 'openLocations')}
                    />
                  </BlockStack>
                  <BlockStack>
                    <Text>Hour Format</Text>
                    <RadioButton
                      label="12 Hours"
                      id="12"
                      name="hourFormat"
                      checked={storeData.hourFormat === '12'}
                      onChange={() => handleChange('12', 'hourFormat')}
                    />
                    <RadioButton
                      label="24 Hourss"
                      id="24"
                      name="hourFormat"
                      checked={storeData.hourFormat === '24'}
                      onChange={() => handleChange('24', 'hourFormat')}
                    />
                  </BlockStack>
                  <BlockStack>
                    <Text>Store Grouping based on Business Information</Text>
                    <RadioButton
                      label="Allow grouping"
                      id="allow"
                      name="storeGroup"
                      checked={storeData.storeGroup === 'allow'}
                      onChange={() => handleChange('allow', 'storeGroup')}
                    />
                    <RadioButton
                      label="Disable Grouping"
                      id="disable"
                      name="storeGroup"
                      checked={storeData.storeGroup === 'disable'}
                      onChange={() => handleChange('disable', 'storeGroup')}
                    />
                  </BlockStack>
                </BlockStack>
              </InlineStack>
              <InlineStack align="center">
                <div style={{ paddingInlineEnd: '25px', paddingBlockStart: '25px' }}>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    accessibilityLabel="Save selected options"
                  >
                    Save
                  </Button>
                </div>
              </InlineStack>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page >
  );
}