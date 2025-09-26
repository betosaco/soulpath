import TeacherLayout from './TeacherLayout';
import '@/styles/tokens/theme-teacher.css';
import '@/styles/teacher-profile.css';

export default function TeacherAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherLayout>{children}</TeacherLayout>;
}
