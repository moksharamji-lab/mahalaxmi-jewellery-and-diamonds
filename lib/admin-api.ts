type ErrorResponse = {
  message?: unknown;
};

export async function sendAdminMutation(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  formData?: FormData
) {
  const response = await fetch(`/api/admin/${path}`, {
    method,
    ...(formData ? { body: formData } : {}),
  });

  if (response.ok) {
    return;
  }

  const data = (await response.json().catch(() => null)) as
    | ErrorResponse
    | null;

  throw new Error(
    typeof data?.message === "string"
      ? data.message
      : "Unable to save this record."
  );
}