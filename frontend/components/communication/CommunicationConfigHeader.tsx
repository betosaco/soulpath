import { BaseButton } from '../ui/BaseButton';
import { Save, Settings, Eye } from 'lucide-react';

interface CommunicationConfigHeaderProps {
  isSaving: boolean;
  isLoading: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
  onSave: () => void;
  onTestTemplates: () => void;
}

export function CommunicationConfigHeader({
  isSaving,
  isLoading,
  message,
  onSave,
  onTestTemplates
}: CommunicationConfigHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-600" />
            Centro de Comunicación
          </h1>
          <p className="text-gray-600 mt-1">
            Configure email, SMS, Telegram, WhatsApp, and Instagram settings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <BaseButton
            onClick={onTestTemplates}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Test Templates
          </BaseButton>

          <BaseButton
            onClick={onSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Configuration
              </>
            )}
          </BaseButton>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className={`flex-shrink-0 ${
            message.type === 'success' ? 'text-green-500' : 'text-red-500'
          }`}>
            {message.type === 'success' ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="text-sm font-medium">
            {message.text}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm font-medium">Loading configuration...</span>
        </div>
      )}
    </div>
  );
}
