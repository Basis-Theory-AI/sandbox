import { NextRequest, NextResponse } from "next/server";
import { generateJWT, getJWTConfig } from "../../services/jwtService";
import { BtAiApiService } from "../../services/btAiApiService";

// Default mandates configuration
const DEFAULT_MANDATES = [
  {
    type: "maxAmount",
    value: "500",
    details: {
      currency: "840",
    },
  },
  {
    type: "merchant",
    value: "Apple Store",
    details: {
      category: "electronics",
      categoryCode: "5732",
    },
  },
  {
    type: "description",
    value: "Purchase of AirPods Pro and iPhone case",
  },
  {
    type: "expirationTime",
    value: "1767182340",
  },
  {
    type: "prompt",
    value:
      "The purchase of electronics under US$500 at Apple Store by the end of the day",
  },
  {
    type: "consumer",
    value: "3d50aca6-9d1e-4459-8254-4171a92f5bd0",
    details: {
      name: "Lucas Chociay",
      email: "lucas@basistheory.com",
      address: {
        line1: "123 Main Street",
        line2: "Apt 4B",
        line3: "Building 7",
        city: "Beverly Hills",
        postalCode: "90210",
        stateCode: "CA",
        countryCode: "USA",
      },
    },
  },
];

// POST - Create Purchase Intent (requires private role)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentMethodId, entityId } = body;

    // Validate required fields
    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Missing required field: paymentMethodId" },
        { status: 400 }
      );
    }

    // Get JWT from Authorization header or generate default with private role
    const authHeader = request.headers.get("Authorization");
    let jwt: string;
    let defaultUserId: string;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      jwt = authHeader.substring(7);
      defaultUserId =
        entityId || process.env.NEXT_PUBLIC_DEFAULT_USER_ID || "user123";
    } else {
      // fallback: generate JWT with private role for purchase intent creation
      const config = getJWTConfig();
      defaultUserId =
        entityId || process.env.NEXT_PUBLIC_DEFAULT_USER_ID || "user123";
      jwt = await generateJWT(defaultUserId, config, ["private"]);
    }

    const paymentMethodData = await BtAiApiService.fetchPaymentMethod(
      jwt,
      paymentMethodId
    );

    // Determine credential type based on card brand
    // AMEX and Discover use network-token, Visa and Mastercard use virtual-card
    const cardBrand = paymentMethodData.card?.brand?.toLowerCase();
    const credentialType =
      cardBrand === "amex" ||
      cardBrand === "american-express" ||
      cardBrand === "discover"
        ? "network-token"
        : "virtual-card";

    // Prepare purchase intent data with default mandates
    const purchaseIntentData = {
      entityId: defaultUserId,
      paymentMethodId: paymentMethodId,
      credentialType,
      mandates: DEFAULT_MANDATES,
    };

    // call main API using service
    const responseData = await BtAiApiService.createPurchaseIntent(
      jwt,
      purchaseIntentData
    );

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Purchase intent creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - List Purchase Intents with pagination (requires private role)
export async function GET(request: NextRequest) {
  try {
    // Get JWT from Authorization header or generate default with private role
    const authHeader = request.headers.get("Authorization");
    let jwt: string;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      jwt = authHeader.substring(7);
    } else {
      // fallback: generate JWT with private role for fetching purchase intents
      const config = getJWTConfig();
      const defaultUserId =
        process.env.NEXT_PUBLIC_DEFAULT_USER_ID || "user123";
      jwt = await generateJWT(defaultUserId, config, ["private"]);
    }

    // extract pagination parameters from query string
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // call main API using paginated service
    const { data: responseData, response: apiResponse } =
      await BtAiApiService.fetchPurchaseIntentsPaginated(jwt, limit, offset);

    // Create response with data
    const response = NextResponse.json(responseData);

    // forward pagination headers from the main API to the frontend
    response.headers.set(
      "X-Total-Count",
      apiResponse.headers.get("X-Total-Count") || "0"
    );
    response.headers.set(
      "X-Limit",
      apiResponse.headers.get("X-Limit") || limit.toString()
    );
    response.headers.set(
      "X-Offset",
      apiResponse.headers.get("X-Offset") || offset.toString()
    );
    response.headers.set(
      "X-Has-Next",
      apiResponse.headers.get("X-Has-Next") || "false"
    );
    response.headers.set(
      "X-Has-Previous",
      apiResponse.headers.get("X-Has-Previous") || "false"
    );

    return response;
  } catch (error) {
    console.error("Purchase intents fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
