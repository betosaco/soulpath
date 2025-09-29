/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const policies = [
    {
      title: 'Puntualidad y Asistencia',
      summary:
        'Llega al menos 10 minutos antes para preparar el espacio y recibir a los alumnos. Si surge un imprevisto o retraso, avisa de inmediato a tu supervisor. Este podrá confirmar asistencia por los canales oficiales antes de la clase. Las ausencias no justificadas podrán conllevar sanciones, descuentos o revisión de contrato.',
      contentType: 'url',
      contentUrl: null,
    },
    {
      title: 'Preparación de Clases',
      summary:
        'Ten lista la secuencia pedagógica antes de iniciar. Respeta 60 minutos de clase activa y 15 minutos de transición. Adapta el contenido al nivel y condiciones del grupo, priorizando la seguridad: calentamiento y cierre adecuados, variaciones accesibles y un enfoque integral (físico, mental y emocional).',
      contentType: 'url',
      contentUrl: null,
    },
    {
      title: 'Imagen y Presentación',
      summary:
        'Viste de forma apropiada, limpia, cómoda y neutra, alineada con la identidad del estudio. Tu presentación personal debe reflejar profesionalismo y respeto. Mantén siempre un trato amable, empático e inspirador con alumnos y colegas.',
      contentType: 'url',
      contentUrl: null,
    },
    {
      title: 'Relación con los Alumnos',
      summary:
        'Fomenta un ambiente seguro, inclusivo y libre de discriminación. Evita comentarios personales o juicios que puedan incomodar. Protege la confidencialidad y privacidad de los datos, preferencias y condiciones médicas de los alumnos.',
      contentType: 'url',
      contentUrl: null,
    },
    {
      title: 'Distancia Profesional',
      summary:
        'Mantén respeto, neutralidad y límites claros. Evita involucramientos personales, emocionales, sentimentales o financieros que afecten tu imparcialidad. El contacto físico debe ser con consentimiento explícito y con fines pedagógicos seguros. No favorezcas a nadie ni compartas/solicites datos personales fuera de los canales oficiales. Evita discusiones ideológicas o privadas durante la enseñanza.',
      contentType: 'url',
      contentUrl: null,
    },
    {
      title: 'Uso del Espacio y Recursos',
      summary:
        'Mantén el estudio ordenado y operativo: limpia y devuelve mats y accesorios a su lugar; apaga luces, ventilación y equipos al terminar. Practica el uso responsable de agua y electricidad, y cuida los implementos como si fueran propios.',
      contentType: 'url',
      contentUrl: null,
    },
    {
      title: 'Responsabilidad Financiera',
      summary:
        'La remuneración es el 50.86% de las ventas netas de clases/pases impartidos, según contrato. El pago se realiza el día 7 de cada mes (o siguiente hábil), conforme a reporte interno. Las comisiones de productos y workshops se liquidan de acuerdo con los acuerdos vigentes.',
      contentType: 'url',
      contentUrl: null,
    },
    {
      title: 'Conducta Profesional',
      summary:
        'No ofrezcas clases o servicios privados dentro del estudio sin autorización expresa de la administración. Mantén la confidencialidad sobre procesos internos y datos de alumnos. Está prohibido consumir alcohol, tabaco o sustancias ilícitas en el estudio. Practica autocuidado para modelar bienestar.',
      contentType: 'url',
      contentUrl: null,
    },
    {
      title: 'Protocolo en Caso de No Respuesta del Profesor',
      summary:
        'Si no respondes hasta 15 minutos antes del inicio, se activa el protocolo: se contacta a profesores suplentes; de no haber, se informa a los alumnos y se ofrece reprogramación o pase compensatorio. El evento se registra (hora, medio y acciones). Gerencia evalúa si es justificado o negligencia; de serlo, pueden aplicarse advertencias, descuentos o suspensiones por reincidencia.',
      contentType: 'url',
      contentUrl: null,
    },
    {
      title: 'Feedback y Evaluación',
      summary:
        'El desempeño se evalúa periódicamente: puntualidad y asistencia, preparación y calidad pedagógica, feedback de los alumnos y cumplimiento de políticas. Las observaciones se asumen con apertura y enfoque en mejora continua. Contamos con espacios de formación y capacitación interna.',
      contentType: 'url',
      contentUrl: null,
    },
    {
      title: 'Video: Políticas para Profesores – MatMax Wellness Studio',
      summary:
        'Video explicativo. Marca como visto y reconocido tras revisar el material.',
      contentType: 'video',
      // Place the video under frontend/public/policies/Text20250929122933.mp4 for the link to work in prod
      contentUrl: '/policies/Text20250929122933.mp4',
    },
  ];

  for (const p of policies) {
    // Find by title (not unique), then update or create
    const existing = await prisma.policy.findFirst({ where: { title: p.title } });
    if (existing) {
      await prisma.policy.update({
        where: { id: existing.id },
        data: { summary: p.summary, contentType: p.contentType, contentUrl: p.contentUrl, isActive: true },
      });
      console.log('Updated policy:', p.title);
    } else {
      await prisma.policy.create({
        data: { title: p.title, summary: p.summary, contentType: p.contentType, contentUrl: p.contentUrl, isActive: true },
      });
      console.log('Created policy:', p.title);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Policies seeding complete.');
  })
  .catch(async (e) => {
    console.error('❌ Policies seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });


