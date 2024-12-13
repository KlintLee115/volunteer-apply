import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyCaptcha } from "../recaptcha/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedBody = z
      .object({
        name: z.string().nonempty(),
        email: z.string().nonempty(),
        message: z.string().nonempty(),
        roles: z.string().nonempty(),
        resume: z.string().nonempty(),
        token: z.string().nonempty(),
      })
      .parse(body);

    const check = await verifyCaptcha(parsedBody.token);
    if (!check) {
      return NextResponse.json(
        { message: "reCAPTCHA failed" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during form submission:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
