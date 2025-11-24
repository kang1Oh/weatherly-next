export async function fetchOutfitImages() {
  try {
    const res = await fetch('/api/outfit_images');
    if (!res.ok) throw new Error('Failed to fetch outfit images');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
