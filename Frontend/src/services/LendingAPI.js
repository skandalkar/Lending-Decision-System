const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Ignoring the empty/non-JSON response
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.message || data?.error || "The lending decision service returned an error.";
    throw new Error(message);
  }

  return data;
}

// Submit application 
export async function submitLoanApplication(application) {
  return request("/api/v1/applications", {
    method: "POST",
    body: JSON.stringify(application),
  });
}

// Get decision
export async function getLoanDecision(applicationId) {
  return request(`/api/v1/applications/${applicationId}/decision`);
}

// Submit and waiting for asynchronous decision from system
export async function evaluateLoanApplication(application) {
  const submission = await submitLoanApplication(application);

  const applicationId = submission?.data?.applicationId;

  if (!applicationId) {
    throw new Error("Application was submitted, but no application ID was returned.");
  }


  for (let attempt = 0; attempt < 10; attempt++) {
    const result = await getLoanDecision(applicationId);

    if (result?.data?.status === "COMPLETED") {
      return result;
    }

    if (result?.data?.status === "FAILED") {
      throw new Error("Decision processing failed.");
    }

    // Wait 500ms before checking again 
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );
  }

  throw new Error("Decision is taking longer than expected. Please try again.");
}