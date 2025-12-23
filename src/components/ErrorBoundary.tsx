
import React from 'react';
import { ErrorState } from '../types';

/**
 * Processes an unknown error from an API call and returns a structured ErrorState object
 * with a user-friendly title and actionable troubleshooting steps.
 */
export const getApiErrorState = (err: unknown): ErrorState => {
    console.error("API Error Trace:", err);
    
    // Default error state for unexpected issues
    let errorState: ErrorState = {
      title: 'Action Required',
      message: 'The AI encountered an issue generating your proposal. Please refresh and try again.',
    };

    if (err instanceof Error) {
      const lowerCaseMessage = err.message.toLowerCase();
      
      if (lowerCaseMessage.includes('api key') || lowerCaseMessage.includes('permission denied')) {
          errorState = {
              title: 'API Configuration Alert',
              message: (
                React.createElement(React.Fragment, null,
                  React.createElement("p", null, "The AI service is unreachable. This usually means the API key is invalid or missing from the deployment environment."),
                  React.createElement("ul", { className: "list-disc list-inside mt-2 space-y-1 text-sm font-medium" },
                    React.createElement("li", null, "Check Netlify/GitHub Secrets for GEMINI_API_KEY"),
                    React.createElement("li", null, "Ensure the Generative Language API is enabled"),
                    React.createElement("li", null, "Verify your Google AI Studio billing status")
                  )
                )
              ),
          };
      } else if (lowerCaseMessage.includes('billing') || lowerCaseMessage.includes('quota')) {
          errorState = {
              title: 'Service Limit Reached',
              message: "Your AI generation quota for today has been reached or your billing account is inactive. Please check your Google Cloud Console.",
          };
      } else {
        // Force conversion to string to prevent React rendering errors if err.message is an object
        errorState.message = String(err.message);
      }
    } else if (typeof err === 'string') {
        errorState.message = err;
    } else {
        errorState.message = "An unknown system error occurred. Our engineers have been notified.";
    }
    
    return errorState;
};
