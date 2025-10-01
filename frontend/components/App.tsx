'use client';

import React from 'react';
import { MatmaxHomepage } from './MatmaxHomepage';
import { StructuredData } from './StructuredData';

export function App() {
  return (
    <>
      <StructuredData 
        type="Organization" 
        data={{
          name: "MatMax Yoga Studio",
          url: "https://matmax.world",
          logo: "https://matmax.world/matpass-logo.png",
          description: "Premium yoga studio offering personalized yoga classes, Hatha and Vinyasa yoga, and evidence-based wellness programs in Miraflores, Lima, Peru.",
          foundingDate: "2024",
          address: {
            streetAddress: "Miraflores",
            addressLocality: "Lima",
            addressCountry: "PE"
          },
          contactPoint: {
            telephone: "+51-916-172-368",
            contactType: "customer service",
            availableLanguage: ["English", "Spanish"]
          },
          sameAs: [
            "https://www.instagram.com/matmaxyoga",
            "https://www.facebook.com/matmaxyoga"
          ]
        }} 
      />
      <StructuredData 
        type="LocalBusiness" 
        data={{
          name: "MatMax Yoga Studio",
          description: "Premium yoga studio in Miraflores, Lima offering Hatha and Vinyasa yoga classes, personalized sessions, and wellness programs.",
          url: "https://matmax.world",
          telephone: "+51-916-172-368",
          address: {
            streetAddress: "Miraflores",
            addressLocality: "Lima",
            addressRegion: "Lima",
            addressCountry: "PE"
          },
          geo: {
            latitude: "-12.1194",
            longitude: "-77.0342"
          },
          openingHoursSpecification: [
            {
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "06:00",
              closes: "21:00"
            },
            {
              dayOfWeek: ["Saturday", "Sunday"],
              opens: "07:00",
              closes: "20:00"
            }
          ],
          priceRange: "$$",
          currenciesAccepted: "PEN",
          paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
          image: "https://matmax.world/matpass-logo.png",
          logo: "https://matmax.world/matpass-logo.png"
        }} 
      />
      <MatmaxHomepage />
    </>
  );
}
