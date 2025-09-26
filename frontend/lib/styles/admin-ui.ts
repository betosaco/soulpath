// Centralized styling tokens and classnames for the Admin portal layout
// This keeps header, sidebar and main content consistent and easy to customize.
// Follows the same structure as teacher-ui.ts for consistency

export const adminUI = {
  layout: {
    shell: 'flex h-screen bg-[var(--unified-bg-primary)] inner-page mobile-scrollable',
    main: 'flex-1 flex flex-col overflow-hidden',
    content: 'flex-1 overflow-y-auto p-6 mobile-scrollable',
  },
  sidebar: {
    container: 'flex w-64 flex-col bg-[var(--unified-primary)] border-r border-[var(--unified-border-medium)] overflow-y-auto',
    header: 'flex h-16 items-center justify-center border-b border-[var(--unified-border-medium)]',
    section: 'px-4 py-4 border-b border-[var(--unified-border-medium)]',
    nav: 'flex-1 space-y-1 px-4 py-6',
    footer: 'border-t border-[var(--unified-border-medium)] p-4',
    brandTitle: 'text-xl font-bold text-[var(--unified-text-inverse)]',
    brandTagline: 'text-xs text-[var(--unified-accent-light)]',
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
    container: 'bg-[var(--unified-bg-surface)] rounded-lg border border-[var(--unified-border-light)] shadow-sm',
    header: 'p-6 border-b border-[var(--unified-border-light)]',
    body: 'p-6',
    footer: 'p-6 border-t border-[var(--unified-border-light)] bg-[var(--unified-bg-secondary)]',
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
    tertiary: 'text-[var(--unified-text-tertiary)]',
  },
  button: {
    primary: 'px-4 py-2 bg-[var(--unified-primary)] text-[var(--unified-primary-contrast)] rounded-lg hover:bg-[var(--unified-primary-hover)] transition-colors duration-200 font-medium',
    secondary: 'px-4 py-2 bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)] border border-[var(--unified-border-medium)] rounded-lg hover:bg-[var(--unified-bg-tertiary)] transition-colors duration-200 font-medium',
    accent: 'px-4 py-2 bg-[var(--unified-accent)] text-[var(--unified-accent-contrast)] rounded-lg hover:bg-[var(--unified-accent-hover)] transition-colors duration-200 font-medium',
    ghost: 'px-4 py-2 text-[var(--unified-text-primary)] hover:bg-[var(--unified-bg-secondary)] rounded-lg transition-colors duration-200 font-medium',
    danger: 'px-4 py-2 bg-[var(--unified-error)] text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium',
  },
  input: {
    base: 'w-full px-3 py-2 border border-[var(--unified-border-medium)] rounded-lg bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] placeholder-[var(--unified-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--unified-primary)] focus:border-transparent transition-colors duration-200',
    error: 'border-[var(--unified-error)] focus:ring-[var(--unified-error)]',
  },
  table: {
    container: 'bg-[var(--unified-bg-surface)] rounded-lg border border-[var(--unified-border-light)] overflow-hidden',
    header: 'bg-[var(--unified-bg-secondary)] border-b border-[var(--unified-border-light)]',
    row: 'border-b border-[var(--unified-border-light)] last:border-b-0 hover:bg-[var(--unified-bg-secondary)] transition-colors duration-150',
    cell: 'px-6 py-4 text-[var(--unified-text-primary)]',
    headerCell: 'px-6 py-4 text-left text-sm font-semibold text-[var(--unified-text-secondary)] uppercase tracking-wide',
  },
  modal: {
    overlay: 'fixed inset-0 bg-[var(--unified-bg-overlay)] flex items-center justify-center z-50',
    container: 'bg-[var(--unified-bg-surface)] rounded-lg border border-[var(--unified-border-light)] shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden',
    header: 'p-6 border-b border-[var(--unified-border-light)] bg-[var(--unified-bg-secondary)]',
    body: 'p-6 overflow-y-auto',
    footer: 'p-6 border-t border-[var(--unified-border-light)] bg-[var(--unified-bg-secondary)] flex justify-end space-x-3',
  },
  badge: {
    success: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full',
    warning: 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full',
    error: 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full',
    info: 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full',
    neutral: 'px-2 py-1 text-xs font-medium bg-[var(--unified-bg-secondary)] text-[var(--unified-text-secondary)] rounded-full',
  },
  navigation: {
    item: 'flex items-center px-4 py-3 text-sm font-medium text-[var(--unified-text-inverse)] hover:bg-[var(--unified-primary-hover)] rounded-lg transition-colors duration-200',
    itemActive: 'flex items-center px-4 py-3 text-sm font-medium bg-[var(--unified-accent)] text-[var(--unified-accent-contrast)] rounded-lg',
    icon: 'w-5 h-5 mr-3 flex-shrink-0',
  },
  stats: {
    container: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    card: 'bg-[var(--unified-bg-surface)] rounded-lg border border-[var(--unified-border-light)] p-6',
    value: 'text-2xl font-bold text-[var(--unified-text-primary)]',
    label: 'text-sm text-[var(--unified-text-secondary)] mt-1',
    change: 'text-sm font-medium mt-2',
    positive: 'text-green-600',
    negative: 'text-red-600',
  },
};