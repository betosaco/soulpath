'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface IzipayDebugFormProps {
  publicKey: string;
  formToken: string;
}

export const IzipayDebugForm: React.FC<IzipayDebugFormProps> = ({
  publicKey,
  formToken,
}) => {
  const [debugInfo, setDebugInfo] = useState<{
    hasWindow?: boolean;
    hasKR?: boolean;
    krType?: string;
    publicKey?: string;
    formToken?: string;
    krMethods?: Record<string, string>;
    krKeys?: string[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkKR = () => {
      const info: typeof debugInfo = {
        hasWindow: typeof window !== 'undefined',
        hasKR: !!window.KR,
        krType: typeof window.KR,
        publicKey: publicKey ? 'Present' : 'Missing',
        formToken: formToken ? 'Present' : 'Missing',
      };

      if (window.KR) {
        const krMethods = [
          'setFormConfig',
          'onFormReady',
          'onError',
          'onFormValid',
          'onFormInvalid',
          'onSubmit',
          'onTransactionCreated',
          'validateForm'
        ];

        info.krMethods = krMethods.reduce((acc, method) => {
          acc[method] = typeof (window.KR as any)[method];
          return acc;
        }, {} as Record<string, string>);

        info.krKeys = Object.keys(window.KR);
      }

      setDebugInfo(info);
      setIsLoading(false);
    };

    // Check immediately
    checkKR();

    // Check again after a delay
    const timeout = setTimeout(checkKR, 2000);

    return () => clearTimeout(timeout);
  }, [publicKey, formToken]);

  const testKRMethod = (methodName: string) => {
    if (!window.KR || typeof (window.KR as any)[methodName] !== 'function') {
      console.error(`Method ${methodName} not available`);
      return;
    }

    try {
      console.log(`Testing ${methodName}...`);
      if (methodName === 'setFormConfig') {
        (window.KR as any)[methodName]({
          'kr-public-key': publicKey,
          'kr-form-token': formToken,
        }).then((result: unknown) => {
          console.log(`${methodName} result:`, result);
        }).catch((error: unknown) => {
          console.error(`${methodName} error:`, error);
        });
      } else if (methodName === 'onFormReady') {
        (window.KR as any)[methodName](() => {
          console.log('Form ready callback triggered');
        });
      } else {
        (window.KR as any)[methodName]((result: unknown) => {
          console.log(`${methodName} callback triggered:`, result);
        });
      }
    } catch (error) {
      console.error(`Error testing ${methodName}:`, error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Checking Izipay SDK...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Izipay SDK Debug Info</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium">Basic Info</h4>
          {Object.entries(debugInfo).filter(([key]) => !['krMethods', 'krKeys'].includes(key)).map(([key, value]) => (
            <div key={key} className="flex items-center text-sm">
              {value ? (
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              )}
              <span className="font-mono">{key}:</span>
              <span className="ml-2">{String(value)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">KR Methods</h4>
          {debugInfo.krMethods && (
            <>
              {Object.entries(debugInfo.krMethods as Record<string, string>).map(([method, type]) => (
                <div key={method} className="flex items-center text-sm">
                  {type === 'function' ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  )}
                  <span className="font-mono">{method}:</span>
                  <span className="ml-2">{type}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Test Methods</h4>
        <div className="flex flex-wrap gap-2">
          {['setFormConfig', 'onFormReady', 'onError', 'onFormValid'].map((method) => (
            <Button
              key={method}
              size="sm"
              variant="outline"
              onClick={() => testKRMethod(method)}
              disabled={debugInfo.krMethods?.[method] !== 'function'}
            >
              Test {method}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Raw Debug Info</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default IzipayDebugForm;
