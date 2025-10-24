export async function GET() {
  // Verified manifest from Farcaster Base Build
  const manifest = {
  "frame": {
    "name": "PIPPU",
    "version": "1",
    "noindex": false,
    "iconUrl": "https://www.pippu.xyz/icon.png",
    "homeUrl": "https://www.pippu.xyz",
    "imageUrl": "https://www.pippu.xyz/image.png",
    "buttonTitle": "Pippu'it",
    "splashImageUrl": "https://www.pippu.xyz/splash.png",
    "splashBackgroundColor": "#3B82F6",
    "webhookUrl": "https://www.pippu.xyz/api/webhook",
    "subtitle": "Earn yield, borrow assets",
    "description": "Cute and friendly DeFi lending protocol on Base. Supply assets and earn competitive APYs, or borrow against your collateral.",
    "primaryCategory": "finance",
    "tags": [
      "defi",
      "lending",
      "borrowing",
      "base",
      "yield"
    ],
    "tagline": "Your friendly DeFi companion",
    "ogTitle": "Pippu - DeFi Lending Protocol",
    "ogDescription": "Supply assets and earn interest, or borrow against your collateral.",
    "heroImageUrl": "https://www.pippu.xyz/image.png",
    "screenshotUrls": [
      "https://www.pippu.xyz/image.png"
    ],
    "ogImageUrl": "https://www.pippu.xyz/icon.png",
    "castShareUrl": "https://www.pippu.xyz/share"

  },
  "accountAssociation": {
    "header": "eyJmaWQiOjEzODg5MzIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwRmJjNjY2ODNBMjgxMzE2Q2UxNDA1Qzc1RkY4YjUyRTNFNDNEYTg1In0",
    "payload": "eyJkb21haW4iOiJ3d3cucGlwcHUueHl6In0",
    "signature": "5nBJrnKqONNZYyxsLHohn5N+Z52f9JlJ4FM3yr/B39ldTKRHttARoBwXd/8RYDtYCV+fOnriBEuqJWNMHgRNEBw="
  }
};

  return Response.json(manifest, {
    headers: {
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // CORS headers for Base Build
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}