function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || "https://www.pippu.xyz";

  // Initial manifest without account association
  // These fields will be added later after account association verification
  const manifest = withValidProperties({
    "accountAssociation": {
      "header": "",
      "payload": "",
      "signature": ""
    },
    "baseBuilder": {
      "allowedAddresses": [] // Add your Base Account address here
    },
    "miniapp": {
      "version": "1",
      "name": "Pippu - DeFi Lending",
      "homeUrl": URL,
      "iconUrl": `${URL}/icon.png`,
      "splashImageUrl": `${URL}/splash-image.png`,
      "splashBackgroundColor": "#3B82F6",
      "webhookUrl": `${URL}/api/webhook`,
      "subtitle": "Earn yield, borrow assets",
      "description": "Cute and friendly DeFi lending protocol on Base. Supply assets and earn competitive APYs, or borrow against your collateral.",
      "screenshotUrls": [
        `${URL}/screenshots/dashboard.png`,
        `${URL}/screenshots/lending.png`,
        `${URL}/screenshots/borrowing.png`
      ],
      "primaryCategory": "defi",
      "tags": ["defi", "lending", "borrowing", "base", "yield", "crypto", "pippu"],
      "heroImageUrl": `${URL}/og-image.png`,
      "tagline": "Your friendly DeFi companion",
      "ogTitle": "Pippu - DeFi Lending Protocol",
      "ogDescription": "Cute and friendly DeFi lending protocol on Base. Supply assets and earn interest, or borrow against your collateral.",
      "ogImageUrl": `${URL}/og-image.png`,
      "noindex": false
    }
  });

  return Response.json(manifest, {
    headers: {
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'Content-Type': 'application/json',
    },
  });
}