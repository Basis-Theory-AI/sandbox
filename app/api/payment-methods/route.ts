import { NextRequest, NextResponse } from "next/server";
import { generateJWT, getJWTConfig } from "../../services/jwtService";
import { BtAiApiService } from "../../services/btAiApiService";

/**
 * POST /api/payment-methods - Route to create a payment method
 * @param request
 * @returns - 200 OK
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardNumber, expirationMonth, expirationYear, cvc } = body;

    // validate required fields
    if (!cardNumber || !expirationMonth || !expirationYear || !cvc) {
      return NextResponse.json(
        {
          error:
            "Missing one or more required fields: cardNumber, expirationMonth, expirationYear, cvc",
        },
        { status: 400 }
      );
    }

    // get JWT from Authorization header
    const authHeader = request.headers.get("Authorization");
    const entityId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || "user123"; // TODO: get entityId from JWT or body

    let jwt: string;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      jwt = authHeader.substring(7);
    } else {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const paymentMethodData = {
      entityId,
      card: {
        number: cardNumber,
        expirationMonth: expirationMonth.toString().padStart(2, "0"),
        expirationYear: expirationYear.toString(),
        cvc: cvc,
      },
    };

    // call main BT AI API
    const responseData = await BtAiApiService.createPaymentMethod(
      jwt,
      paymentMethodData
    );

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Payment method creation failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payment-methods - Route to list payment methods with pagination
 * @param request - The request object
 * @returns - 200 OK
 */
export async function GET(request: NextRequest) {
  try {
    // Get JWT from Authorization header or generate default with private role
    const authHeader = request.headers.get("Authorization");

    let jwt: string;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      jwt = authHeader.substring(7);
    } else {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    // extract pagination parameters from query string
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // call main API using paginated service
    const { data: responseData, response: apiResponse } =
      await BtAiApiService.fetchPaymentMethodsPaginated(jwt, limit, offset);

    // create response with data
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
    console.error("Payment methods fetch failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
