import { resend } from "@/lib/resend";
import verificationEmail from "@/emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function VerificationMail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: verificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Successfully sent  verification email" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);

    return { success: false, message: "Failed to send verification mail" };
  }
}
