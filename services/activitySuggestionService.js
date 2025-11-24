export async function fetchActivitySuggestions() {
  try {
    const res = await fetch('/api/activity_suggestions/public');
    if (!res.ok) throw new Error('Failed to fetch activity suggestions');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Submit a new activity suggestion
export async function submitActivitySuggestion(suggestion) {
  try {
    const response = await fetch("/api/activity_suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(suggestion),
    });

    if (!response.ok) throw new Error("Failed to submit suggestion");
    const data = await response.json();
    console.log("✅ Suggestion submitted:", data);
    return data;
  } catch (err) {
    console.error("❌ Error submitting activity suggestion:", err);
    throw err;
  }
}

