import "server-only";

import { Client } from "node-appwrite";

export function createAppwriteAuthClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_APPWRITE_ENDPOINT is missing");
  }

  if (!projectId) {
    throw new Error("NEXT_PUBLIC_APPWRITE_PROJECT_ID is missing");
  }

  const client = new Client();

  client.setEndpoint(endpoint);
  client.setProject(projectId);

  return client;
}