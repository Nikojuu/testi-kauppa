export const getCampaigns = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/campaigns`,
    {
      headers: { "x-api-key": process.env.STOREFRONT_API_KEY || "" },
      // Cache for 5 minutes (300 seconds)
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch campaigns");
  }

  const { campaigns } = await res.json();
  return campaigns;
};
