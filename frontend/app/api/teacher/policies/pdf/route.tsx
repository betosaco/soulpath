import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import React from 'react';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { Document, Page, Text, View, StyleSheet, Link, pdf } = await import('@react-pdf/renderer');
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
  }

  const professorId = (user as any).userId || (user as any).id || (user as any).email || '';
  const policies = await prisma.policy.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      title: true,
      summary: true,
      contentUrl: true,
      contentType: true,
      acknowledgments: {
        where: { professorId: String(professorId) },
        select: { id: true, acknowledgedAt: true },
      },
    },
  });

  const styles = StyleSheet.create({
    page: { padding: 32, fontSize: 11 },
    title: { fontSize: 18, marginBottom: 8 },
    small: { fontSize: 9, color: '#555' },
    section: { marginTop: 12 },
    heading: { fontSize: 14, marginBottom: 4 },
    body: { fontSize: 11, color: '#333' },
    ack: { fontSize: 9, color: '#0A7F2E', marginTop: 2 },
    link: { fontSize: 10, color: '#1d4ed8', marginTop: 2 },
  });

  const Pdf = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Políticas para Profesores – MatMax Wellness Studio</Text>
        <Text style={styles.small}>Generado: {new Date().toLocaleString()}</Text>
        <View style={styles.section}>
          <Text style={styles.body}>
            Esta guía reúne los lineamientos esenciales para nuestra labor docente en MatMax Wellness Studio. Por favor, revisa cada sección con atención.
          </Text>
        </View>
        {policies.map((p, idx) => (
          <View key={p.id} style={styles.section}>
            <Text style={styles.heading}>{idx + 1}. {p.title}</Text>
            {p.acknowledgments && p.acknowledgments.length > 0 ? (
              <Text style={styles.ack}>✓ Acknowledged</Text>
            ) : null}
            {p.summary ? <Text style={styles.body}>{p.summary}</Text> : null}
            {p.contentUrl ? (
              // @ts-expect-error react-pdf Link
              <Link src={p.contentUrl} style={styles.link}>Material: {p.contentUrl}</Link>
            ) : null}
          </View>
        ))}
      </Page>
    </Document>
  );

  const buffer = await pdf(Pdf).toBuffer();
  const filename = `MatMax-Politicas-Profesores.pdf`;
  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}


