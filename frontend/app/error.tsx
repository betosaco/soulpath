'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void 
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="relative">
        {/* Constellation background effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary to-card opacity-50" />
        
        {/* Error content */}
        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'color-mix(in srgb, var(--color-status-error) 20%, transparent)' }}>
            <AlertCircle size={40} className="text-[var(--color-status-error)]" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4 text-primary">Oops! Something went wrong</h2>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            We encountered an unexpected error while loading your page. 
            This might be a temporary issue that will resolve itself.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-primary mb-2">Error Details</summary>
              <pre className="bg-secondary p-4 rounded-lg text-sm text-[var(--color-status-error)] overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => reset()} 
              className="transition-colors"
              style={{ background: 'var(--color-accent-500)', color: 'var(--accent-foreground)' }}
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="outline"
              className="transition-colors"
              style={{ borderColor: 'var(--color-accent-500)', color: 'var(--color-accent-500)' }}
            >
              <Home size={16} className="mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
