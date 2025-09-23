'use client';

import { useEffect, useState } from 'react';

export default function CSSDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [cssInfo, setCssInfo] = useState<{
    totalStylesheets?: number;
    stylesheets?: Array<{ href?: string; rules?: number; disabled?: boolean }>;
    computedStyles?: { body?: CSSStyleDeclaration; html?: CSSStyleDeclaration };
    environment?: { nodeEnv?: string; isProduction?: boolean };
  }>({});

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (process.env.NODE_ENV === 'development' || window.location.search.includes('debug=css')) {
      setIsVisible(true);
      
      // Collect CSS information
      const stylesheets = Array.from(document.styleSheets);
      const cssInfo = {
        totalStylesheets: stylesheets.length,
        stylesheets: stylesheets.map((sheet, index) => ({
          index,
          href: sheet.href,
          rules: sheet.cssRules?.length || 0,
          disabled: sheet.disabled,
        })),
        computedStyles: {
          body: window.getComputedStyle(document.body),
          html: window.getComputedStyle(document.documentElement),
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          isProduction: process.env.NODE_ENV === 'production',
          userAgent: navigator.userAgent,
        }
      };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCssInfo(cssInfo as any);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '300px',
      height: '100vh',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      overflow: 'auto',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <h3>CSS Debug Info</h3>
      <div>
        <strong>Environment:</strong> {cssInfo.environment?.nodeEnv}
      </div>
      <div>
        <strong>Total Stylesheets:</strong> {cssInfo.totalStylesheets}
      </div>
      
      <h4>Stylesheets:</h4>
      {cssInfo.stylesheets?.map((sheet: { href?: string; rules?: number; disabled?: boolean }, index: number) => (
        <div key={index} style={{ marginBottom: '5px', padding: '5px', background: 'rgba(255,255,255,0.1)' }}>
          <div><strong>#{index}:</strong> {sheet.href || 'Inline'}</div>
          <div>Rules: {sheet.rules}</div>
          <div>Disabled: {sheet.disabled ? 'Yes' : 'No'}</div>
        </div>
      ))}
      
      <h4>Body Styles:</h4>
      <div style={{ fontSize: '10px' }}>
        {cssInfo.computedStyles?.body && Object.entries(cssInfo.computedStyles.body).slice(0, 10).map(([key, value]) => (
          <div key={key}>{key}: {value}</div>
        ))}
      </div>
    </div>
  );
}
