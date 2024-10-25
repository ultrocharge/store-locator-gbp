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
  Pagination,
  DropZone,
  Thumbnail,
  Spinner
} from '@shopify/polaris';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import GoogleIcon from "../../../assets/images/google.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFindOne, useAction, useFindMany } from "@gadgetinc/react";
import { api } from "../../../api";
export default function () {
  const [{ data, error, fetching }, update] = useAction(api.settings.update);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasError = rejectedFiles.length > 0;

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
  
  const [{ data: settingData, error: settingError, fetching: settingFetching }] = useFindOne(api.settings, "2");
  
  const [storeData, setStoreData] = useState({
    pageTitle: "",
    searchText: "",
    searchBox: "",
    searchBtn: "",
    noStoreFound: "",
    locateNotFound: "",
    googleMapAPI: "",
    radius: "",
    distanceFormat: "",
    bannerImageUrl: ""
  });

  useEffect(() => {
    if (settingData) {
      setStoreData({
        ...storeData,
        pageTitle: settingData.pageTitle,
        searchText: settingData.searchText,
        searchBox: settingData.searchBox,
        searchBtn: settingData.searchBtn,
        noStoreFound: settingData.noStoreFound,
        locateNotFound: settingData.locateNotFound,
        googleMapAPI: settingData.googleMapAPI,
        radius: String(settingData.radius),
        distanceFormat: settingData.distanceFormat,
        bannerImageUrl: settingData.bannerImageUrl
      });
    };
    setLoading(false);
  }, [settingData, uploadedImageUrl]);


  const handleSave = async () => {
    try {
      const res = await update({
        id: "2",
        pageTitle: storeData.pageTitle,
        searchText: storeData.searchText,
        searchBox: storeData.searchBox,
        searchBtn: storeData.searchBtn,
        noStoreFound: storeData.noStoreFound,
        locateNotFound: storeData.locateNotFound,
        googleMapAPI: storeData.googleMapAPI,
        radius: Number(storeData.radius),
        distanceFormat: storeData.distanceFormat,
      });
    } catch (err) {
      console.error(err)
    }
  };

  const radiusList = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
  ];
  
  const distanceList = [
    { label: 'M', value: 'meters' },
    { label: 'KM', value: 'kilometers' },
  ];

  const handleInputChange = (value, field) => {
    setStoreData(prev => ({
      ...prev,
      [field]: value
    }))
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
          id: "2",
          bannerImageUrl: downloadURL
        });
      } catch (error) {
          console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <Page fullWidth title="Settings">
      <Layout>
        <Layout.Section>
          <Card roundedAbove="sm">
            <div style={{ paddingBlock: '25px', paddingInline: '30px' }}>
              <BlockStack gap="2400">
                <BlockStack gap="400" inlineAlign="center" align="center">
                  <Text variant="headingLg" as="h2" alignment="center">
                    Connect Google Business Profiles
                  </Text>
                  <Button>
                    <Link style={{ display: 'flex', gap: '5px', textDecoration: "none", alignItems: "center" }}>
                      <img src={GoogleIcon} width={22} height={22} /> Sign In with Google
                    </Link>
                  </Button>
                </BlockStack>
                <BlockStack gap="400">
                  <InlineStack align="space-around" gap="800">
                    <BlockStack gap="400">
                      <Text variant="headingMd" as="h2">
                        General Settings
                      </Text>
                      <InlineStack gap="800" blockAlign="center" align="space-between">
                        <Text variant="bodyMd" as="h2" alignment="center">
                          Page Title
                        </Text>
                        <TextField
                          type="text"
                          labelHidden
                          autoComplete="off"
                          placeholder="Enter Title"
                          value={storeData.pageTitle}
                          onChange={value => handleInputChange(value, 'pageTitle')}
                        />
                      </InlineStack>
                      <InlineStack gap="800" blockAlign="center" align="space-between">
                        <Text variant="bodyMd" as="h2" alignment="center">
                          Search Text
                        </Text>
                        <TextField
                          type="text"
                          labelHidden
                          autoComplete="off"
                          placeholder="Enter Title"
                          value={storeData.searchText}
                          onChange={value => handleInputChange(value, 'searchText')}
                        />
                      </InlineStack>
                      <InlineStack gap="800" blockAlign="center" align="space-between">
                        <Text variant="bodyMd" as="h2" alignment="center">
                          Search Box
                        </Text>
                        <TextField
                          type="text"
                          labelHidden
                          autoComplete="off"
                          placeholder="Enter Title"
                          value={storeData.searchBox}
                          onChange={value => handleInputChange(value, 'searchBox')}
                        />
                      </InlineStack>
                      <InlineStack gap="800" blockAlign="center" align="space-between">
                        <Text variant="bodyMd" as="h2" alignment="center">
                          Search Button
                        </Text>
                        <TextField
                          type="text"
                          labelHidden
                          autoComplete="off"
                          placeholder="Enter Title"
                          value={storeData.searchBtn}
                          onChange={value => handleInputChange(value, 'searchBtn')}
                        />
                      </InlineStack>
                      <InlineStack gap="800" blockAlign="center" align="space-between">
                        <Text variant="bodyMd" as="h2" alignment="center">
                          No Stores Found
                        </Text>
                        <TextField
                          type="text"
                          labelHidden
                          autoComplete="off"
                          placeholder="Enter Title"
                          value={storeData.noStoreFound}
                          onChange={value => handleInputChange(value, 'noStoreFound')}
                        />
                      </InlineStack>
                      <InlineStack gap="800" blockAlign="center" align="space-between">
                        <Text variant="bodyMd" as="h2" alignment="center">
                          Location Not Found
                        </Text>
                        <TextField
                          type="text"
                          labelHidden
                          autoComplete="off"
                          placeholder="Enter Title"
                          value={storeData.locateNotFound}
                          onChange={value => handleInputChange(value, 'locateNotFound')}
                        />
                      </InlineStack>
                    </BlockStack>
                    <BlockStack gap="400">
                      <Text variant="headingMd" as="h2">
                        <div style={{ opacity: '0' }}>
                          General Settings
                        </div>
                      </Text>
                      <InlineStack gap="400" blockAlign="center" align="space-between">
                        <Text variant="headingMd" as="h2" alignment="center">
                          Google Maps API
                        </Text>
                        <InlineStack gap="400">
                          <TextField
                            type="text"
                            labelHidden
                            autoComplete="off"
                            placeholder="Enter Google Maps API"
                            value={storeData.googleMapAPI}
                            onChange={value => handleInputChange(value, 'googleMapAPI')}
                          />
                        </InlineStack>
                      </InlineStack>
                      <BlockStack gap="400">
                        <Text variant="headingMd" as="h2">
                          Map Settings
                        </Text>
                        <InlineStack gap="400" blockAlign="center" align="space-between">
                          <Text variant="bodyMd" as="h2" alignment="center">
                            Initial Radius
                          </Text>
                          <div style={{ width: '204px' }}>
                            <Select
                              label="radius"
                              options={radiusList}
                              labelHidden
                              value={storeData.radius}
                              onChange={value => handleInputChange(value, 'radius')}
                            />
                          </div>
                        </InlineStack>
                        <InlineStack gap="400" blockAlign="center" align="space-between">
                          <Text variant="bodyMd" as="h2" alignment="center">
                            Distance Format
                          </Text>
                          <div style={{ width: '204px' }}>
                            <Select
                              label="distance"
                              options={distanceList}
                              labelHidden
                              value={storeData.distanceFormat}
                              onChange={value => handleInputChange(value, 'distanceFormat')}
                            />
                          </div>
                        </InlineStack>
                      </BlockStack>
                      <InlineStack gap="400" blockAlign="center" align="space-between">
                        <Text variant="headingMd" as="h2" alignment="center">
                          Store Individual Page’s Banner
                        </Text>
                        <BlockStack gap="400">
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
                          <Text variant="bodyXs" as="h2" alignment="center">
                            Store Individual Page’s Banner
                          </Text>
                        </BlockStack>
                      </InlineStack>
                    </BlockStack>
                  </InlineStack>
                </BlockStack>
              </BlockStack >
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
            </div >
          </Card>
          <InlineStack align="center">
            <Pagination
              hasPrevious
              onPrevious={() => {}}
              hasNext
              onNext={() => {}}
            />
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page >
  )
}