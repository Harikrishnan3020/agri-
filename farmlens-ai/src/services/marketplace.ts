import type { MarketplaceListing } from "@/components/screens/Marketplace";

const fallbackHost =
  typeof window !== "undefined" && window.location.hostname
    ? window.location.hostname
    : "localhost";

const baseUrl =
  import.meta.env.VITE_MARKETPLACE_API_URL || `http://${fallbackHost}:8081`;

export const fetchListings = async (): Promise<MarketplaceListing[]> => {
  const response = await fetch(`${baseUrl}/api/listings`);
  if (!response.ok) {
    throw new Error("Failed to fetch listings");
  }
  const data = (await response.json()) as { listings: MarketplaceListing[] };
  return data.listings || [];
};

export const createListing = async (
  listing: MarketplaceListing
): Promise<MarketplaceListing> => {
  const response = await fetch(`${baseUrl}/api/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(listing),
  });

  if (!response.ok) {
    throw new Error("Failed to create listing");
  }

  const data = (await response.json()) as { listing: MarketplaceListing };
  return data.listing;
};

export const subscribeListings = (
  onListing: (listing: MarketplaceListing) => void,
  onError?: () => void
) => {
  const source = new EventSource(`${baseUrl}/api/listings/stream`);

  source.addEventListener("listing", (event) => {
    try {
      const listing = JSON.parse((event as MessageEvent).data) as MarketplaceListing;
      onListing(listing);
    } catch {
      // Ignore malformed events
    }
  });

  source.onerror = () => {
    onError?.();
  };

  return () => {
    source.close();
  };
};
