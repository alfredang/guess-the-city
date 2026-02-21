import { CONFIG } from "./config.js";

export function hasApiKey() {
  // Always true — API key is handled server-side by the proxy
  return true;
}

export function saveApiKey(key) {
  // No-op — key is server-side
}

export async function fetchCityPhoto(query) {
  const url = new URL(`${CONFIG.UNSPLASH_BASE_URL}/search/photos`);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "10");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");

  // Check sessionStorage cache
  const cacheKey = `photo_${query}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore bad cache
    }
  }

  try {
    const response = await fetch(url.toString());

    if (response.status === 401) return { error: "invalid_key" };
    if (response.status === 403) return { error: "rate_limited" };
    if (!response.ok) return { error: "server_error" };

    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;

    const photo = data.results[Math.floor(Math.random() * data.results.length)];
    const result = {
      imageUrl: photo.urls[CONFIG.IMAGE_SIZE] || photo.urls.regular,
      photographerName: photo.user.name,
      photographerUrl: photo.user.links.html,
      unsplashUrl: photo.links.html,
    };

    // Cache in sessionStorage
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    } catch {
      // storage full, ignore
    }

    return result;
  } catch {
    return { error: "network" };
  }
}

export async function prefetchAllRounds(rounds) {
  const results = await Promise.allSettled(
    rounds.map((round) => fetchCityPhoto(round.correctCity.query))
  );

  let firstError = null;

  results.forEach((result, i) => {
    if (result.status === "fulfilled" && result.value && !result.value.error) {
      const photo = result.value;
      rounds[i].imageUrl = photo.imageUrl;
      rounds[i].photographerName = photo.photographerName;
      rounds[i].photographerUrl = photo.photographerUrl;
      rounds[i].unsplashUrl = photo.unsplashUrl;
    } else if (result.status === "fulfilled" && result.value?.error && !firstError) {
      firstError = result.value.error;
    }
  });

  return firstError;
}
