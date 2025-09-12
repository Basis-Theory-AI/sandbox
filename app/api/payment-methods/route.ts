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
 * GET /api/payment-methods - Route to list payment methods
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

    // call main BT AI API
    const responseData = await BtAiApiService.fetchPaymentMethods(jwt);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Payment methods fetch failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
