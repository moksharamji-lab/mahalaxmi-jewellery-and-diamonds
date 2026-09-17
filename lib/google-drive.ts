import "server-only";

import { google } from "googleapis";

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
const rootFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

if (!clientId) throw new Error("GOOGLE_OAUTH_CLIENT_ID is missing");
if (!clientSecret) throw new Error("GOOGLE_OAUTH_CLIENT_SECRET is missing");
if (!redirectUri) throw new Error("GOOGLE_OAUTH_REDIRECT_URI is missing");
if (!refreshToken) throw new Error("GOOGLE_DRIVE_REFRESH_TOKEN is missing");
if (!rootFolderId) throw new Error("GOOGLE_DRIVE_FOLDER_ID is missing");

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

export async function getPublicMediaFolderIds() {
  const folderNames = [
    "Gold",
    "Diamonds",
    "Hero",
    "Categories",
  ];

  const folderIds: string[] = [];

  for (const folderName of folderNames) {
    const folder =
      await getDriveFolder(folderName);

    if (folder?.id) {
      folderIds.push(folder.id);
    }
  }

  return folderIds;
}

export async function isPublicMediaFile(
  fileId: string
) {
  const metadata =
    await drive.files.get({
      fileId,

      fields:
        "id,name,mimeType,parents,trashed",
    });

  const file = metadata.data;

  if (!file.id || file.trashed) {
    return false;
  }

  const allowedFolderIds =
    await getPublicMediaFolderIds();

  if (allowedFolderIds.length === 0) {
    return false;
  }

  const parents = file.parents ?? [];

  return parents.some((parentId) =>
    allowedFolderIds.includes(parentId)
  );
}

/**
 * Deletes newly uploaded Google Drive files
 * when the database operation fails afterward.
 *
 * This is intentionally used only for files
 * created during the current request.
 *
 * Existing media is never deleted by this helper.
 */
export async function deleteDriveFiles(
  fileIds: string[]
) {
  const uniqueFileIds = [
    ...new Set(
      fileIds.filter(
        (fileId): fileId is string =>
          Boolean(fileId)
      )
    ),
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