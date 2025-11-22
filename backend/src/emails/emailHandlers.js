import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientUrl) => {
  try {
    // Input validation
    if (!email || !name || !clientUrl) {
      throw new Error("Missing required parameters: email, name, or clientUrl");
    }

    const { data, error } = await resendClient.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to VanChat!",
      html: createWelcomeEmailTemplate(name, clientUrl),
    });

    if (error) {
      console.error("Error sending welcome email: ", error);
      throw new Error(`Failed to send welcome email: ${error.message}`);
    }

    console.log("Welcome Email sent successfully to:", email);
    return data; // Return the data for potential use by the caller
  } catch (error) {
    console.error("Error in sendWelcomeEmail function: ", error);
    throw error; // Re-throw to let the caller handle it
  }
};
