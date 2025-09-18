'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import KRGlue from '@lyracom/embedded-form-glue';

const Checkout = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the tokens from the URL query parameters
  const formToken = searchParams.get('formToken');
  const publicKey = searchParams.get('publicKey');

  useEffect(() => {
    console.log('🔍 Checkout useEffect - formToken:', formToken, 'publicKey:', publicKey);
    
    if (!formToken || !publicKey) {
      console.log('❌ Missing form token or public key');
      setError('Missing form token or public key');
      setIsLoading(false);
      return;
    }

    const initializePayment = async () => {
      try {
        console.log('🚀 Starting payment initialization...');
        setIsLoading(true);
        setError(null);
        
        const endpoint = "https://static.micuentaweb.pe";
        console.log('📡 Loading KRGlue from endpoint:', endpoint, 'with publicKey:', publicKey);

        const { KR } = await KRGlue.loadLibrary(endpoint, publicKey);
        
        console.log('✅ KRGlue loaded successfully');
        
        console.log('🔧 Setting form config with formToken:', formToken);
        KR.setFormConfig({
          formToken: formToken,
          'kr-language': 'es-PE',
        });

        console.log('🔧 Attaching form to #micuentawebstd_rest_wrapper');
        KR.attachForm('#micuentawebstd_rest_wrapper');
        console.log('✅ Form attached successfully');

        KR.onSubmit((paymentData: any) => {
          console.log('🚀 Form submitted with payment data:', paymentData);
          
          // Call your Next.js API route to validate the response
          fetch('/api/validate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              'kr-answer': paymentData.rawClientAnswer,
              'kr-hash': paymentData.hash,
            }),
          })
          .then(response => response.json())
          .then(data => {
            if (data === true) {
              // On successful validation, navigate to the result page
              // Pass the payment data via sessionStorage to avoid cluttering the URL
              sessionStorage.setItem('paymentResult', JSON.stringify(paymentData.clientAnswer));
              router.push('/result');
            } else {
              alert("Payment validation failed!");
            }
          })
          .catch(err => {
            console.error("Validation error:", err);
            alert("Error validating payment!");
          });
          
          return false; // Prevent the default form submission
        });

        // Set up error handler
        if (KR.onError) {
          KR.onError((error: any) => {
            console.error('❌ Payment form error:', error);
            setError(error?.errorMessage || 'Error en el formulario de pago');
          });
        }

        // Set up form ready handler
        if (KR.onFormReady) {
          KR.onFormReady(() => {
            console.log('✅ Payment form is ready');
            setIsLoading(false);
          });
        } else {
          // Fallback if onFormReady is not available
          setIsLoading(false);
        }
        
      } catch (err) {
        console.error('❌ Error initializing payment form:', err);
        setError('Error al inicializar el formulario de pago');
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [formToken, publicKey, router]);

  if (isLoading) {
    return (
      <section className="container">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="center-column col-md-6">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Cargando...</span>
              </div>
              <p className="mt-3">Cargando formulario de pago...</p>
            </div>
          </div>
          <div className="col-md-3"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="center-column col-md-6">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error</h4>
              <p>{error}</p>
              <hr />
              <button 
                className="btn btn-primary" 
                onClick={() => router.push('/')}
              >
                Volver al inicio
              </button>
            </div>
          </div>
          <div className="col-md-3"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="container">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="center-column col-md-6">
          <section className="payment-form">
            <h2>Formulario de Pago</h2>
            <p>Complete los datos de su tarjeta para procesar el pago de forma segura.</p>
            
            <div id="micuentawebstd_rest_wrapper">
              <div className="kr-embedded"></div>
            </div>
          </section>
        </div>
        <div className="col-md-3"></div>
      </div>
    </section>
  );
};

export default Checkout;
