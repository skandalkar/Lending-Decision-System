const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function evaluateLoanApplication(application) {
  const response = await fetch(`${API_BASE_URL}/api/v1/lending/decisions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(application),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Backend may return an empty/non-JSON response.
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      "The lending decision service returned an error.";

    throw new Error(message);
  }

  return data;
}