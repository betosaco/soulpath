import '@/styles/tokens/theme-client.css';
import '@/styles/mobile.css';
import '@/styles/unified-component-styles.css';
import '@/styles/service-display.css';
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="client-theme">{children}</div>;
}
