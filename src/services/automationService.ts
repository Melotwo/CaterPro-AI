
/**
 * Automation Service
 * Handles webhooks for Make.com / Klaviyo integrations
 */

export interface User {
  name: string;
  email: string;
  businessType?: string;
}

export const automationService = {
  /**
   * Trigger a signup webhook to Make.com
   * @param user The user data to send
   */
  async triggerSignupWebhook(user: User): Promise<void> {
    const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
    
    if (!user || !webhookUrl) {
      console.warn("Automation Service: User data or VITE_MAKE_WEBHOOK_URL is missing.");
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user,
          source: 'CaterProAI_App',
          timestamp: new Date().toISOString(),
          environment: import.meta.env.MODE,
        }),
      });

      if (!response.ok) {
        console.error(`Webhook failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Automation Service Error:", error);
    }
  }
};
