// Centralized styling tokens and classnames for the Teacher portal layout
// This keeps header, sidebar and main content consistent and easy to customize.

export const teacherUI = {
  layout: {
    shell: 'flex h-screen bg-[var(--unified-bg-primary)] inner-page mobile-scrollable',
    main: 'flex-1 flex flex-col overflow-hidden',
    content: 'flex-1 overflow-y-auto p-6 mobile-scrollable',
  },
  sidebar: {
    container: 'flex w-64 flex-col bg-gray-800 border-r border-gray-700',
    header: 'flex h-16 items-center justify-center border-b border-gray-700',
    section: 'px-4 py-4 border-b border-gray-700',
    nav: 'flex-1 space-y-1 px-4 py-6',
    footer: 'border-t border-gray-700 p-4',
    brandTitle: 'text-xl font-bold text-white',
    brandTagline: 'text-xs text-gray-300',
  },
  header: {
    container: 'bg-[var(--unified-bg-secondary)] border-b border-[var(--unified-border-light)] px-6 py-4',
    title: 'text-xl font-semibold text-[var(--unified-text-primary)]',
    subtitle: 'text-sm text-[var(--unified-text-secondary)]',
    actions: 'flex items-center space-x-3',
    left: 'flex items-center space-x-4',
    center: 'hidden md:flex items-center space-x-6',
    right: 'flex items-center space-x-3',
  },
  card: {
    container: 'bg-[var(--unified-bg-surface)] rounded-lg border border-[var(--unified-border-light)]',
    header: 'p-6 border-b border-[var(--unified-border-light)]',
    body: 'p-6',
  },
  avatar: {
    circleLg: 'w-12 h-12 bg-[var(--unified-primary)] rounded-full flex items-center justify-center',
    circleSm: 'w-8 h-8 bg-[var(--unified-primary)] rounded-full flex items-center justify-center',
    initialLg: 'text-white font-semibold text-lg',
    initialSm: 'text-white text-sm font-semibold',
  },
  text: {
    inverse: 'text-[var(--unified-text-inverse)]',
    secondary: 'text-[var(--unified-text-secondary)]',
  },
  button: {
    primary: 'px-4 py-2 bg-[var(--unified-primary)] text-[var(--unified-primary-contrast)] rounded-lg hover:bg-[var(--unified-primary-hover)] transition-colors',
    dangerSm: 'px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors',
  },
};


