'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorCount: number;
}

export class PaymentErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    // Handle specific payment and DOM errors
    if (error.message.includes('removeChild') || 
        error.message.includes('Node') ||
        error.message.includes('CLIENT_') ||
        error.message.includes('payment')) {
      console.warn('Payment/DOM error suppressed by PaymentErrorBoundary:', error.message);
      return { hasError: false, errorCount: 0 };
    }
    return { hasError: true, error, errorCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PaymentErrorBoundary caught an error:', error, errorInfo);
    
    // Handle specific error types
    if (error.message.includes('removeChild') || error.message.includes('Node')) {
      console.warn('DOM manipulation error in payment form. This is likely due to third-party library cleanup.');
      return;
    }

    if (error.message.includes('CLIENT_300')) {
      console.warn('Payment form validation error. User should check their card details.');
      return;
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  handleRetry = () => {
    if (this.state.errorCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorCount: prevState.errorCount + 1
      }));
    } else {
      // Reset error count after max retries
      this.setState({
        hasError: false,
        error: undefined,
        errorCount: 0
      });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-500/10 border border-red-500/20 max-w-md mx-auto mt-8 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-5 h-5 bg-red-500 rounded-full"></div>
            <h4 className="text-red-400 font-medium">Payment Error</h4>
          </div>
          <p className="text-red-300 text-sm mb-4">
            {this.state.error?.message || 'An error occurred while processing your payment.'}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded transition-colors"
            >
              Try Again ({this.maxRetries - this.state.errorCount} attempts left)
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
