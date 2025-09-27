'use client';

import React, { useState } from 'react';
import { Shield, AlertCircle, DollarSign, RefreshCw, X, FileText } from 'lucide-react';
import { BaseButton } from '../ui/BaseButton';

interface ApprovalRequest {
  type: string;
  reason: string;
  details?: any;
}

interface AdminApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: ApprovalRequest) => Promise<void>;
  conversationId: string;
}

const APPROVAL_TYPES = [
  {
    id: 'refund',
    label: 'Process Refund',
    description: 'Request approval to issue a refund to the customer',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    id: 'escalation',
    label: 'Escalate to Manager',
    description: 'Escalate this conversation to a manager or supervisor',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    id: 'policy_override',
    label: 'Policy Override',
    description: 'Request permission to override standard company policies',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    id: 'service_credit',
    label: 'Service Credit',
    description: 'Apply service credit or compensation to customer account',
    icon: RefreshCw,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'custom',
    label: 'Custom Request',
    description: 'Other administrative action requiring approval',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
];

export function AdminApprovalModal({ isOpen, onClose, onSubmit, conversationId }: AdminApprovalModalProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType || !reason.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        type: selectedType,
        reason: reason.trim(),
        details: details.trim() || undefined,
      });
      
      // Reset form
      setSelectedType('');
      setReason('');
      setDetails('');
    } catch (error) {
      console.error('Approval request failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTypeInfo = APPROVAL_TYPES.find(type => type.id === selectedType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Request Admin Approval</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Request Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Request Type
            </label>
            <div className="grid gap-3">
              {APPROVAL_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedType === type.id
                        ? `${type.borderColor} ${type.bgColor}`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${selectedType === type.id ? type.color : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <h3 className={`font-medium ${selectedType === type.id ? type.color : 'text-gray-900'}`}>
                          {type.label}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Request *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this administrative action is needed..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Additional Details */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Any additional context, amounts, or specific requirements..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Preview */}
          {selectedType && reason && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Request Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="text-gray-600">{selectedTypeInfo?.label}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Reason:</span>
                  <p className="text-gray-600 mt-1">{reason}</p>
                </div>
                {details && (
                  <div>
                    <span className="font-medium text-gray-700">Details:</span>
                    <p className="text-gray-600 mt-1">{details}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Important Notice</p>
                <p className="text-yellow-700 mt-1">
                  This request will be sent to administrators for review. You will be notified once a decision is made. 
                  The conversation will remain active while the request is pending.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <BaseButton
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </BaseButton>
          <BaseButton
            onClick={handleSubmit}
            disabled={!selectedType || !reason.trim() || isSubmitting}
          >
            {isSubmitting ? 'Sending Request...' : 'Send Request'}
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
