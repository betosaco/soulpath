'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Result = () => {
  const router = useRouter();
  const [clientAnswer, setClientAnswer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve the result from sessionStorage on the client-side
    const resultData = sessionStorage.getItem('paymentResult');
    if (resultData) {
      try {
        setClientAnswer(JSON.parse(resultData));
      } catch (error) {
        console.error('Error parsing payment result:', error);
      }
    }
    setIsLoading(false);
  }, []);

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
              <p className="mt-3">Cargando resultado...</p>
            </div>
          </div>
          <div className="col-md-3"></div>
        </div>
      </section>
    );
  }

  if (!clientAnswer) {
    return (
      <section className="container">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="center-column col-md-6">
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">No se encontró resultado de pago</h4>
              <p>No se pudo encontrar información sobre el pago procesado.</p>
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'success':
        return 'success';
      case 'refused':
      case 'failed':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'Pagado';
      case 'success':
        return 'Exitoso';
      case 'refused':
        return 'Rechazado';
      case 'failed':
        return 'Fallido';
      case 'pending':
        return 'Pendiente';
      default:
        return status || 'Desconocido';
    }
  };

  return (
    <section className="container">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="center-column col-md-6">
          <section className="result-form">
            <h2>Resultado de pago:</h2>
            <hr/>
            
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Estado del Pago</h5>
                <p className="card-text">
                  <strong>Estado:</strong> 
                  <span className={`badge badge-${getStatusColor(clientAnswer.orderStatus)} ml-2`}>
                    {getStatusText(clientAnswer.orderStatus)}
                  </span>
                </p>
                
                {clientAnswer.orderDetails && (
                  <>
                    <p className="card-text">
                      <strong>Monto:</strong> {clientAnswer.orderDetails.orderCurrency} {(clientAnswer.orderDetails.orderTotalAmount / 100).toFixed(2)}
                    </p>
                    <p className="card-text">
                      <strong>Order-id:</strong> {clientAnswer.orderDetails.orderId}
                    </p>
                  </>
                )}
                
                {clientAnswer.transaction && (
                  <p className="card-text">
                    <strong>ID de Transacción:</strong> {clientAnswer.transaction.uuid || clientAnswer.transaction.transactionId}
                  </p>
                )}
              </div>
            </div>
            
            <hr/>
            
            <details open>
              <summary><h2>Respuesta recibida del servidor:</h2></summary>
              <hr/>
              <pre className="bg-light p-3 rounded" style={{ fontSize: '12px', maxHeight: '300px', overflow: 'auto' }}>
                {JSON.stringify(clientAnswer, null, 2)}
              </pre>
            </details>
            
            <hr/>
            
            <div className="text-center">
              <button 
                className="btn btn-primary" 
                onClick={() => router.push('/')}
              >
                Volver a probar
              </button>
            </div>
          </section>
        </div>
        <div className="col-md-3"></div>
      </div>
    </section>
  );
};

export default Result;
