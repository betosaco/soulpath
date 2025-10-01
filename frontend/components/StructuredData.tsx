import React from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'LocalBusiness' | 'Service' | 'Product' | 'BreadcrumbList' | 'FAQPage' | 'YogaPackage' | 'AboutPage';
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "MatMax Yoga Studio",
          "url": "https://matmax.world",
          "logo": "https://matmax.world/matpass-logo.png",
          "description": "Premium yoga studio in Miraflores, Lima offering personalized yoga classes, wellness programs, and evidence-based approaches to physical and mental well-being.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Calle Alcanfores 425",
            "addressLocality": "Miraflores",
            "addressRegion": "Lima",
            "addressCountry": "PE"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+51-916-172-368",
            "contactType": "customer service",
            "email": "info@matmax.world"
          },
          "sameAs": [
            "https://www.instagram.com/matmaxyoga",
            "https://www.facebook.com/matmaxyoga"
          ]
        };

      case 'LocalBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://matmax.world/#business",
          "name": "MatMax Yoga Studio",
          "image": "https://matmax.world/matpass-logo.png",
          "description": "Premium yoga studio in Miraflores, Lima offering personalized yoga classes and wellness programs.",
          "url": "https://matmax.world",
          "telephone": "+51-916-172-368",
          "email": "info@matmax.world",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Calle Alcanfores 425",
            "addressLocality": "Miraflores",
            "addressRegion": "Lima",
            "postalCode": "15074",
            "addressCountry": "PE"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-12.1194",
            "longitude": "-77.0342"
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "07:00",
              "closes": "21:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Saturday", "Sunday"],
              "opens": "08:00",
              "closes": "20:00"
            }
          ],
          "priceRange": "$$",
          "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
          "currenciesAccepted": "PEN"
        };

      case 'Service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data.name || "Yoga Classes",
          "description": data.description || "Premium yoga classes and wellness programs in Miraflores, Lima.",
          "provider": {
            "@type": "LocalBusiness",
            "name": "MatMax Yoga Studio",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Calle Alcanfores 425",
              "addressLocality": "Miraflores",
              "addressRegion": "Lima",
              "addressCountry": "PE"
            }
          },
          "areaServed": {
            "@type": "City",
            "name": "Lima",
            "containedInPlace": {
              "@type": "Country",
              "name": "Peru"
            }
          },
          "serviceType": "Yoga Classes",
          "offers": data.offers || {
            "@type": "Offer",
            "price": "190",
            "priceCurrency": "PEN",
            "availability": "https://schema.org/InStock"
          }
        };

      case 'Product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.name || "Yoga Package",
          "description": data.description || "Premium yoga package with personalized sessions.",
          "image": data.image || "https://matmax.world/matpass-logo.png",
          "sku": data.sku || data.id || "MATMAX-YOGA-001",
          "brand": {
            "@type": "Brand",
            "name": "MatMax Yoga Studio"
          },
          "offers": {
            "@type": "Offer",
            "url": data.url || "https://matmax.world/packages/enhanced",
            "price": data.price || "190",
            "priceCurrency": "PEN",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "MatMax Yoga Studio"
            },
            "validFrom": new Date().toISOString(),
            "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
          }
        };

      case 'YogaPackage':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.name || "Yoga Package",
          "description": data.description || "Premium yoga package with personalized sessions and flexible scheduling.",
          "image": data.image || "https://matmax.world/matpass-logo.png",
          "sku": data.sku || data.id || "MATMAX-YOGA-001",
          "category": "Yoga Classes",
          "brand": {
            "@type": "Brand",
            "name": "MatMax Yoga Studio"
          },
          "manufacturer": {
            "@type": "Organization",
            "name": "MatMax Yoga Studio"
          },
          "offers": {
            "@type": "Offer",
            "url": data.url || "https://matmax.world/packages/enhanced",
            "price": data.price || "190",
            "priceCurrency": "PEN",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
              "@type": "Organization",
              "name": "MatMax Yoga Studio",
              "url": "https://matmax.world"
            },
            "validFrom": new Date().toISOString(),
            "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "PEN"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "businessDays": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                }
              }
            }
          },
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "Sessions",
              "value": data.sessions || "4"
            },
            {
              "@type": "PropertyValue",
              "name": "Duration",
              "value": data.duration || "60 minutes"
            },
            {
              "@type": "PropertyValue",
              "name": "Validity",
              "value": "30 days"
            },
            {
              "@type": "PropertyValue",
              "name": "Package Type",
              "value": data.packageType || "Individual"
            }
          ]
        };

      case 'BreadcrumbList':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };

      case 'FAQPage':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.faqs.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };

      case 'AboutPage':
        return {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": data.name || "About MatMax Yoga Studio",
          "description": data.description || "Learn about MatMax Yoga Studio's story, mission, and values.",
          "url": data.url || "https://matmax.world/about",
          "mainEntity": {
            "@type": "Organization",
            "name": data.mainEntity?.name || "MatMax Yoga Studio",
            "description": data.mainEntity?.description || "Premium yoga studio offering personalized yoga classes and wellness programs.",
            "foundingDate": data.mainEntity?.foundingDate || "2024",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": data.mainEntity?.location?.address || "Miraflores, Lima, Peru"
            },
            "geo": data.mainEntity?.location?.geo ? {
              "@type": "GeoCoordinates",
              "latitude": data.mainEntity.location.geo.latitude,
              "longitude": data.mainEntity.location.geo.longitude
            } : undefined
          }
        };

      default:
        return data;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2)
      }}
    />
  );
};

export default StructuredData;
