import React from 'react';
import { ErrorState } from '../types';

/**
 * Processes an unknown error from an API call and returns a structured ErrorState object.
 * Strictly normalizes messages to prevent React "Objects are not valid as a React child" crashes.
 */
export const getApiErrorState = (err: unknown): ErrorState => {
    console.error("API Error Trace:", err);
    
    let errorState: ErrorState = {
      title: 'Action Required',
      message: 'The AI encountered an issue generating your proposal. Please refresh and try again.',
    };

    if (err instanceof Error) {
      const lowerCaseMessage = err.message.toLowerCase();
      
      if (lowerCaseMessage.includes('api key') || lowerCaseMessage.includes('permission denied')) {
          errorState = {
              title: 'API Configuration Alert',
              message: 'The AI service is unreachable. This usually means the API key is invalid or missing from the deployment environment. Please check your GitHub/Netlify secrets.',
          };
      } else if (lowerCaseMessage.includes('billing') || lowerCaseMessage.includes('quota')) {
          errorState = {
              title: 'Service Limit Reached',
              message: "Your AI generation quota for today has been reached or your billing account is inactive. Please check your Google AI Studio status.",
          };
      } else {
        errorState.message = String(err.message);
      }
    } else if (typeof err === 'string') {
        errorState.message = err;
    } else if (err && typeof err === 'object') {
        // Fallback for objects that aren't instances of Error
        try {
            errorState.message = JSON.stringify(err);
        } catch {
            errorState.message = "A complex system error occurred. Please try again.";
        }
    }
    
    return errorState;
};
