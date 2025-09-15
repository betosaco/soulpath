import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withCache } from '@/lib/cache';

// ISR Configuration - This route will be statically generated and revalidated
export const revalidate = 3600; // Revalidate every hour


interface NestedContent {
  [key: string]: string | NestedContent;
}

interface TransformedContent {
  en: NestedContent;
  es: NestedContent;
}

function transformFlatContentToNested(flatContent: Record<string, string>): TransformedContent {
  const nestedContent: TransformedContent = {
    en: {} as NestedContent,
    es: {} as NestedContent
  };

  // Transform the flat Prisma Content model to nested structure
  if (flatContent) {
    // Hero section
    nestedContent.en.hero = {
      title: flatContent.heroTitleEn || 'MatMax Yoga Studio',
      tagline: 'Transform your life through spiritual guidance and healing',
      description: 'Experience profound transformation through personalized spiritual sessions, energy healing, and guidance on your journey to inner peace and self-discovery.',
      ctaPrimary: 'Book Your Session',
      ctaSecondary: 'Learn More',
      subtitle: flatContent.heroSubtitleEn || 'Your journey to wellness starts here'
    };
    nestedContent.es.hero = {
      title: flatContent.heroTitleEs || 'MatMax Yoga Studio',
      tagline: 'Transforma tu vida a través de la guía espiritual y la sanación',
      description: 'Experimenta una transformación profunda a través de sesiones espirituales personalizadas, sanación energética y guía en tu camino hacia la paz interior y el autodescubrimiento.',
      ctaPrimary: 'Reserva tu Sesión',
      ctaSecondary: 'Conoce Más',
      subtitle: flatContent.heroSubtitleEs || 'Tu camino al bienestar comienza aquí'
    };

    // About section
    nestedContent.en.about = {
      title: flatContent.aboutTitleEn || 'About MatMax Yoga Studio',
      text: flatContent.aboutContentEn || 'MatMax Yoga Studio is dedicated to helping people build strength, flexibility, and inner peace through mindful movement and breath. Our classes support wellbeing and balance for all levels.',
      description: flatContent.aboutContentEn || 'MatMax Yoga Studio is dedicated to helping people build strength, flexibility, and inner peace through mindful movement and breath. Our classes support wellbeing and balance for all levels.',
      statsClients: 'Clients Helped',
      statsYears: 'Years Experience',
      statsSessions: 'Sessions Completed',
      statsCountries: 'Countries Served',
      valuesTitle: 'Our Core Values',
      value1Title: 'Compassion',
      value1Description: 'We approach every client with deep empathy and understanding, creating a safe space for healing and growth.',
      value2Title: 'Authenticity',
      value2Description: 'Our guidance comes from genuine spiritual wisdom and personal experience, not from textbooks or theories.',
      value3Title: 'Transformation',
      value3Description: 'We believe in the power of real change and are committed to helping you achieve lasting transformation.',
      storyTitle: 'Jose\'s Story',
      storyText: 'My journey began over 15 years ago when I experienced a profound spiritual awakening that changed my life forever. Since then, I\'ve dedicated myself to helping others find their own path to spiritual growth and personal transformation. Through years of study, practice, and working with clients from around the world, I\'ve developed a unique approach that combines traditional spiritual wisdom with modern understanding of human psychology and energy work.'
    };
    nestedContent.es.about = {
      title: flatContent.aboutTitleEs || 'Acerca de MatMax Yoga Studio',
      text: flatContent.aboutContentEs || 'MatMax Yoga Studio está dedicado a ayudarte a construir fuerza, flexibilidad y paz interior a través del movimiento consciente y la respiración. Nuestras clases apoyan el bienestar y el equilibrio para todos los niveles.',
      description: flatContent.aboutContentEs || 'MatMax Yoga Studio está dedicado a ayudarte a construir fuerza, flexibilidad y paz interior a través del movimiento consciente y la respiración. Nuestras clases apoyan el bienestar y el equilibrio para todos los niveles.',
      statsClients: 'Clientes Ayudados',
      statsYears: 'Años de Experiencia',
      statsSessions: 'Sesiones Completadas',
      statsCountries: 'Países Atendidos',
      valuesTitle: 'Nuestros Valores Fundamentales',
      value1Title: 'Compasión',
      value1Description: 'Nos acercamos a cada cliente con profunda empatía y comprensión, creando un espacio seguro para la sanación y el crecimiento.',
      value2Title: 'Autenticidad',
      value2Description: 'Nuestra guía proviene de la sabiduría espiritual genuina y la experiencia personal, no de libros de texto o teorías.',
      value3Title: 'Transformación',
      value3Description: 'Creemos en el poder del cambio real y estamos comprometidos a ayudarte a lograr una transformación duradera.',
      storyTitle: 'La Historia de José',
      storyText: 'Mi viaje comenzó hace más de 15 años cuando experimenté un despertar espiritual profundo que cambió mi vida para siempre. Desde entonces, me he dedicado a ayudar a otros a encontrar su propio camino hacia el crecimiento espiritual y la transformación personal. A través de años de estudio, práctica y trabajo con clientes de todo el mundo, he desarrollado un enfoque único que combina la sabiduría espiritual tradicional con la comprensión moderna de la psicología humana y el trabajo energético.'
    };

    // Approach section
    nestedContent.en.approach = {
      title: flatContent.approachTitleEn || 'Our Approach',
      content: flatContent.approachContentEn || 'We use a holistic approach to wellness.',
      items: [
        {
          title: 'Heart-Centered Healing',
          text: 'Connect with your emotional core and release past traumas through compassionate guidance and energy work.'
        },
        {
          title: 'Mindful Transformation',
          text: 'Develop mental clarity and break free from limiting beliefs that hold you back from your true potential.'
        },
        {
          title: 'Spiritual Awakening',
          text: 'Discover your spiritual path and deepen your connection to the divine through meditation and spiritual practices.'
        }
      ] as any
    };
    nestedContent.es.approach = {
      title: flatContent.approachTitleEs || 'Nuestro Enfoque',
      content: flatContent.approachContentEs || 'Usamos un enfoque holístico para el bienestar.',
      items: [
        {
          title: 'Sanación Centrada en el Corazón',
          text: 'Conecta con tu núcleo emocional y libera traumas pasados a través de guía compasiva y trabajo energético.'
        },
        {
          title: 'Transformación Consciente',
          text: 'Desarrolla claridad mental y libérate de creencias limitantes que te impiden alcanzar tu verdadero potencial.'
        },
        {
          title: 'Despertar Espiritual',
          text: 'Descubre tu camino espiritual y profundiza tu conexión con lo divino a través de la meditación y prácticas espirituales.'
        }
      ] as any
    };

    // Services section
    nestedContent.en.services = {
      title: flatContent.servicesTitleEn || 'Our Services',
      content: flatContent.servicesContentEn || 'Professional wellness services in a peaceful environment.'
    };
    nestedContent.es.services = {
      title: flatContent.servicesTitleEs || 'Nuestros Servicios',
      content: flatContent.servicesContentEs || 'Servicios profesionales de bienestar en un ambiente pacífico.'
    };

    // Navigation
    nestedContent.en.nav = {
      invitation: 'Invitation',
      approach: 'Approach',
      session: 'Session',
      about: 'About',
      apply: 'Apply'
    };
    nestedContent.es.nav = {
      invitation: 'Invitación',
      approach: 'Enfoque',
      session: 'Sesión',
      about: 'Acerca de',
      apply: 'Aplicar'
    };

    // CTA buttons
    nestedContent.en.cta = {
      bookReading: 'Book Your Reading'
    };
    nestedContent.es.cta = {
      bookReading: 'Reserva Tu Lectura'
    };
  }

  return nestedContent;
}

export async function GET() {
  try {
    // Use caching for content data
    const transformedContent = await withCache(
      'content',
      async () => {
        try {
          // Try to get content from the Content table using Prisma
          const content = await prisma.content.findFirst();

          if (!content) {
            console.log('No content found, attempting to create default content');
            try {
              const defaultContent = await prisma.content.create({
                data: {
                  heroTitleEn: 'MatMax Yoga Studio',
                  heroTitleEs: 'MatMax Yoga Studio',
                  heroSubtitleEn: 'Your journey to wellness starts here',
                  heroSubtitleEs: 'Tu camino al bienestar comienza aquí',
                  aboutTitleEn: 'About Us',
                  aboutTitleEs: 'Sobre Nosotros',
                  aboutContentEn: 'We are dedicated to helping you achieve your wellness goals.',
                  aboutContentEs: 'Estamos dedicados a ayudarte a alcanzar tus metas de bienestar.',
                  approachTitleEn: 'Our Approach',
                  approachTitleEs: 'Nuestro Enfoque',
                  approachContentEn: 'We use a holistic approach to wellness.',
                  approachContentEs: 'Usamos un enfoque holístico para el bienestar.',
                  servicesTitleEn: 'Our Services',
                  servicesTitleEs: 'Nuestros Servicios',
                  servicesContentEn: 'Professional wellness services in a peaceful environment.',
                  servicesContentEs: 'Servicios profesionales de bienestar en un ambiente pacífico.'
                }
              });
              return transformFlatContentToNested(defaultContent as unknown as Record<string, string>);
            } catch (createError) {
              console.warn('Could not create default content, using in-memory defaults:', createError);
              const defaultContent: Record<string, string> = {
                heroTitleEn: 'MatMax Yoga Studio',
                heroTitleEs: 'MatMax Yoga Studio',
                heroSubtitleEn: 'Your journey to wellness starts here',
                heroSubtitleEs: 'Tu camino al bienestar comienza aquí',
                aboutTitleEn: 'About Us',
                aboutTitleEs: 'Sobre Nosotros',
                aboutContentEn: 'We are dedicated to helping you achieve your wellness goals.',
                aboutContentEs: 'Estamos dedicados a ayudarte a alcanzar tus metas de bienestar.',
                approachTitleEn: 'Our Approach',
                approachTitleEs: 'Nuestro Enfoque',
                approachContentEn: 'We use a holistic approach to wellness.',
                approachContentEs: 'Usamos un enfoque holístico para el bienestar.',
                servicesTitleEn: 'Our Services',
                servicesTitleEs: 'Nuestros Servicios',
                servicesContentEn: 'Professional wellness services in a peaceful environment.',
                servicesContentEs: 'Servicios profesionales de bienestar en un ambiente pacífico.'
              };
              return transformFlatContentToNested(defaultContent);
            }
          }

          // Transform flat content to nested structure
          return transformFlatContentToNested(content as unknown as Record<string, string>);
        } catch (dbError) {
          console.warn('Content table not available, using in-memory defaults');
          const defaultContent: Record<string, string> = {
            heroTitleEn: 'MatMax Yoga Studio',
            heroTitleEs: 'MatMax Yoga Studio',
            heroSubtitleEn: 'Your journey to wellness starts here',
            heroSubtitleEs: 'Tu camino al bienestar comienza aquí',
            aboutTitleEn: 'About Us',
            aboutTitleEs: 'Sobre Nosotros',
            aboutContentEn: 'We are dedicated to helping you achieve your wellness goals.',
            aboutContentEs: 'Estamos dedicados a ayudarte a alcanzar tus metas de bienestar.',
            approachTitleEn: 'Our Approach',
            approachTitleEs: 'Nuestro Enfoque',
            approachContentEn: 'We use a holistic approach to wellness.',
            approachContentEs: 'Usamos un enfoque holístico para el bienestar.',
            servicesTitleEn: 'Our Services',
            servicesTitleEs: 'Nuestros Servicios',
            servicesContentEn: 'Professional wellness services in a peaceful environment.',
            servicesContentEs: 'Servicios profesionales de bienestar en un ambiente pacífico.'
          };
          return transformFlatContentToNested(defaultContent);
        }
      },
      15 * 60 * 1000 // Cache for 15 minutes (content changes less frequently)
    );

    console.log('✅ Content loaded from cache/database and transformed');
    return NextResponse.json({ content: transformedContent });
  } catch (error) {
    console.error('Error fetching content (final fallback):', error);
    // Final in-memory fallback to avoid 500s
    const defaultContent: Record<string, string> = {
      heroTitleEn: 'MatMax Yoga Studio',
      heroTitleEs: 'MatMax Yoga Studio',
      heroSubtitleEn: 'Your journey to wellness starts here',
      heroSubtitleEs: 'Tu camino al bienestar comienza aquí',
      aboutTitleEn: 'About Us',
      aboutTitleEs: 'Sobre Nosotros',
      aboutContentEn: 'We are dedicated to helping you achieve your wellness goals.',
      aboutContentEs: 'Estamos dedicados a ayudarte a alcanzar tus metas de bienestar.',
      approachTitleEn: 'Our Approach',
      approachTitleEs: 'Nuestro Enfoque',
      approachContentEn: 'We use a holistic approach to wellness.',
      approachContentEs: 'Usamos un enfoque holístico para el bienestar.',
      servicesTitleEn: 'Our Services',
      servicesTitleEs: 'Nuestros Servicios',
      servicesContentEn: 'Professional wellness services in a peaceful environment.',
      servicesContentEs: 'Servicios profesionales de bienestar en un ambiente pacífico.'
    };
    const transformedContent = transformFlatContentToNested(defaultContent);
    return NextResponse.json({ content: transformedContent });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the first content record or create one
    let content = await prisma.content.findFirst();
    
    if (!content) {
      // Create new content record
      content = await prisma.content.create({
        data: {
          heroTitleEn: body.heroTitleEn || 'Welcome to SOULPATH',
          heroTitleEs: body.heroTitleEs || 'Bienvenido a SOULPATH',
          heroSubtitleEn: body.heroSubtitleEn || 'Your journey to wellness starts here',
          heroSubtitleEs: body.heroSubtitleEs || 'Tu camino al bienestar comienza aquí',
          aboutTitleEn: body.aboutTitleEn || 'About Us',
          aboutTitleEs: body.aboutTitleEs || 'Sobre Nosotros',
          aboutContentEn: body.aboutContentEn || 'We are dedicated to helping you achieve your wellness goals.',
          aboutContentEs: body.aboutContentEs || 'Estamos dedicados a ayudarte a alcanzar tus metas de bienestar.',
          approachTitleEn: body.approachTitleEn || 'Our Approach',
          approachTitleEs: body.approachTitleEs || 'Nuestro Enfoque',
          approachContentEn: body.approachContentEn || 'We use a holistic approach to wellness.',
          approachContentEs: body.approachContentEs || 'Usamos un enfoque holístico para el bienestar.',
          servicesTitleEn: body.servicesTitleEn || 'Our Services',
          servicesTitleEs: body.servicesTitleEs || 'Nuestros Servicios',
          servicesContentEn: body.servicesContentEn || 'Professional wellness services in a peaceful environment.',
          servicesContentEs: body.servicesContentEs || 'Servicios profesionales de bienestar en un ambiente pacífico.'
        }
      });
    } else {
      // Update existing content record
      content = await prisma.content.update({
        where: { id: content.id },
        data: {
          heroTitleEn: body.heroTitleEn,
          heroTitleEs: body.heroTitleEs,
          heroSubtitleEn: body.heroSubtitleEn,
          heroSubtitleEs: body.heroSubtitleEs,
          aboutTitleEn: body.aboutTitleEn,
          aboutTitleEs: body.aboutTitleEs,
          aboutContentEn: body.aboutContentEn,
          aboutContentEs: body.aboutContentEs,
          approachTitleEn: body.approachTitleEn,
          approachTitleEs: body.approachTitleEs,
          approachContentEn: body.approachContentEn,
          approachContentEs: body.approachContentEs,
          servicesTitleEn: body.servicesTitleEn,
          servicesTitleEs: body.servicesTitleEs,
          servicesContentEn: body.servicesContentEn,
          servicesContentEs: body.servicesContentEs
        }
      });
    }

    const transformedContent = transformFlatContentToNested(content as unknown as Record<string, string>);
    return NextResponse.json({ content: transformedContent });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
