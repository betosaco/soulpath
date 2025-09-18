'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Formulario = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    identityType: 'DNI',
    identityCode: '',
    address: '',
    country: 'PE',
    state: '',
    city: '',
    zipCode: '',
    orderId: 'order-' + Math.floor(Math.random() * 1000),
    amount: 10,
    currency: 'PEN',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call your Next.js API route to get the formtoken
      const response = await fetch('/api/formtoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create form token');
      }
      
      // Pass formToken and publicKey to the checkout page via query params
      const params = new URLSearchParams({
        formToken: data.formToken,
        publicKey: data.publicKey
      });
      
      router.push(`/checkout?${params.toString()}`);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error: Could not connect to the payment server.');
    }
  };

  return (
    <section className="container">
      <form className="col-md-12" onSubmit={handleSubmit}>
        <div className="row">
          <div className="left-column col-md-6">
            <section className="customer-details">
              <h2>Datos del cliente</h2>
              <div className="form-group">
                <label htmlFor="firstName">Nombre:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Apellido:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Teléfono:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="identityType">Tipo de Documento:</label>
                <select
                  id="identityType"
                  name="identityType"
                  value={formData.identityType}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="DNI">DNI</option>
                  <option value="PASSPORT">Pasaporte</option>
                  <option value="CE">Carné de Extranjería</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="identityCode">Número de Documento:</label>
                <input
                  type="text"
                  id="identityCode"
                  name="identityCode"
                  value={formData.identityCode}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </section>
            <section className="billing-details">
              <h2>Datos de envío</h2>
              <div className="form-group">
                <label htmlFor="address">Dirección:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">País:</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="PE">Perú</option>
                  <option value="US">Estados Unidos</option>
                  <option value="MX">México</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="state">Estado/Región:</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">Ciudad:</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">Código Postal:</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </section>
          </div>
          <div className="right-column col-md-6">
            <section className="customer-details">
              <h2>Datos del pago</h2>
              <div className="form-group">
                <label htmlFor="orderId">ID de Orden:</label>
                <input
                  type="text"
                  id="orderId"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Monto:</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="currency">Moneda:</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="PEN">Soles (PEN)</option>
                  <option value="USD">Dólares (USD)</option>
                </select>
              </div>
              <div className="payment-summary">
                <h3>Resumen del Pago</h3>
                <p><strong>Total:</strong> {formData.currency} {formData.amount.toFixed(2)}</p>
              </div>
            </section>
            <button className="btn btn-primary" type="submit">
              Proceder al Pago
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Formulario;
