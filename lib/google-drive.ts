
import "server-only";

import { google } from "googleapis";

const clientId =
  process.env.GOOGLE_OAUTH_CLIENT_ID;

const clientSecret =
  process.env.GOOGLE_OAUTH_CLIENT_SECRET;

const redirectUri =
  process.env.GOOGLE_OAUTH_REDIRECT_URI;

const refreshToken =
  process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const rootFolderId =
  process.env.GOOGLE_DRIVE_FOLDER_ID;

if (!clientId) {
  throw new Error("GOOGLE_OAUTH_CLIENT_ID is missing");
}

if (!clientSecret) {
  throw new Error("GOOGLE_OAUTH_CLIENT_SECRET is missing");
}

if (!redirectUri) {
  throw new Error("GOOGLE_OAUTH_REDIRECT_URI is missing");
}

if (!refreshToken) {
  throw new Error("GOOGLE_DRIVE_REFRESH_TOKEN is missing");
}

if (!rootFolderId) {
  throw new Error("GOOGLE_DRIVE_FOLDER_ID is missing");
}

const auth = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

auth.setCredentials({
  refresh_token: refreshToken,
});

export const drive = google.drive({
  version: "v3",
  auth,
});

export const GOOGLE_DRIVE_ROOT_FOLDER_ID =
  rootFolderId;

/* =====================================================
   GET GOOGLE DRIVE FOLDER
===================================================== */

export async function getDriveFolder(
  folderName: string,
  parentFolderId = GOOGLE_DRIVE_ROOT_FOLDER_ID
) {
  const response = await drive.files.list({
    q: [
      `'${parentFolderId}' in parents`,
      `name = '${folderName.replace(/'/g, "\\'")}'`,
      "mimeType = 'application/vnd.google-apps.folder'",
      "trashed = false",
    ].join(" and "),

    fields: "files(id,name,mimeType)",
    spaces: "drive",
  });

  return response.data.files?.[0] ?? null;
}

/* =====================================================
   PUBLIC MEDIA FOLDERS
===================================================== */

export async function getPublicMediaFolderIds() {
  const folderNames = [
    "Gold",
    "Diamonds",
    "Hero",
    "Categories",
    "Gallery",
    "OurStory",
  ];

  const folderIds: string[] = [];

  for (const folderName of folderNames) {
    const folder = await getDriveFolder(folderName);

    if (folder?.id) {
      folderIds.push(folder.id);
    } else {
      console.warn(
        "PUBLIC_MEDIA_FOLDER_NOT_FOUND:",
        folderName
      );
    }
  }

  console.log("PUBLIC_MEDIA_FOLDERS_DIAGNOSTIC", {
    folderCount: folderIds.length,
    folderNames,
    folderIds,
  });

  return folderIds;
}

/* =====================================================
   CHECK PUBLIC MEDIA FILE
===================================================== */

export async function isPublicMediaFile(
  fileId: string
) {
  const metadata = await drive.files.get({
    fileId,
    fields: "id,name,mimeType,parents,trashed",
  });

  const file = metadata.data;

  if (!file.id || file.trashed) {
    console.warn(
      "MEDIA_FILE_MISSING_OR_TRASHED:",
      fileId
    );

    return false;
  }

  const allowedFolderIds =
    await getPublicMediaFolderIds();

  const parents = file.parents ?? [];

  const isAllowed = parents.some(
    (parentId) =>
      allowedFolderIds.includes(parentId)
  );

  console.log("MEDIA_FOLDER_DIAGNOSTIC", {
    fileId,
    fileName: file.name,
    mimeType: file.mimeType,
    parentIds: parents,
    allowedFolderIds,
    isAllowed,
  });

  return isAllowed;
}

/* =====================================================
   DELETE GOOGLE DRIVE FILES
===================================================== */

export async function deleteDriveFiles(
  fileIds: string[]
) {
  const uniqueFileIds = [
    ...new Set(fileIds.filter(Boolean)),
  ];

  for (const fileId of uniqueFileIds) {
    try {
      await drive.files.delete({
        fileId,
      });
    } catch (error) {
      console.error(
        `Failed to delete orphaned Google Drive file "${fileId}".`,
        error
      );
    }
  }
}
