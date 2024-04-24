import googleServices from "./google-services.json";

googleServices.project_info.project_number = process.env.PROJECT_NUMBER;
googleServices.project_info.firebase_url = process.env.DATABASE_URL;
googleServices.project_info.project_id = process.env.FIREBASE_PROJECT_ID;
googleServices.project_info.storage_bucket =
  process.env.FIREBASE_STORAGE_BUCKET;

googleServices.client[0].client_info.mobilesdk_app_id =
  process.env.FIREBASE_ANDROID_APP_ID;
googleServices.client[0].client_info.android_client_info =
  process.env.BUNDLE_ID;

googleServices.client[0].oauth_client[0].client_id =
  process.env.ANDROID_CLIENT_ID_OAUTH;

googleServices.client[0].api_key[0].current_key = process.env.FIREBASE_API_KEY;

// Replace the placeholders in the other_platform_oauth_client object
googleServices.client[0].services.appinvite_service.other_platform_oauth_client[0].client_id =
  process.env.WEB_CLIENT_ID_OAUTH;
googleServices.client[0].services.appinvite_service.other_platform_oauth_client[1].client_id =
  process.env.IOS_CLIENT_ID_OAUTH;
googleServices.client[0].services.appinvite_service.other_platform_oauth_client[1].ios_info.bundle_id =
  process.env.BUNDLE_ID;

// Now googleServices contains the actual values from your environment variables
