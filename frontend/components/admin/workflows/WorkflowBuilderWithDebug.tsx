/**
 * 🔧 Workflow Builder with Debug
 *
 * Integrated interface combining Visual Workflow Builder and Workflow Debug
 * functionality in a tabbed interface, similar to Template Studio.
 */

'use client';

import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { BaseButton } from '../../ui/BaseButton';
import { VisualWorkflowBuilder } from './VisualWorkflowBuilder';
import { WorkflowExecutionsManager } from './WorkflowExecutionsManager';
import {
  Workflow,
  Activity,
  Plus,
} from 'lucide-react';

export function WorkflowBuilderWithDebug() {
  const [activeTab, setActiveTab] = useState<'builder' | 'debug'>('builder');

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header with Description and Actions */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflow Studio</h1>
            <p className="text-gray-600 mt-1">Create and manage communication workflows</p>
          </div>
          <div className="flex items-center gap-3">
            <BaseButton
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                // TODO: Implement create new workflow functionality
                console.log('➕ Creating new workflow...');
              }}
            >
              <Plus className="w-4 h-4" />
              Create New Workflow
            </BaseButton>
            <div className="flex items-center gap-2 ml-4">
              <BaseButton
                onClick={() => setActiveTab('builder')}
                variant={activeTab === 'builder' ? 'primary' : 'outline'}
                size="sm"
                className="flex items-center gap-2"
              >
                <Workflow className="w-4 h-4" />
                Builder
              </BaseButton>
              <BaseButton
                onClick={() => setActiveTab('debug')}
                variant={activeTab === 'debug' ? 'primary' : 'outline'}
                size="sm"
                className="flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Debug
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'builder' ? (
          <VisualWorkflowBuilder
            language="en"
            onSave={(workflow) => {
              console.log('💾 Saving workflow:', workflow);
              // TODO: Implement save functionality
            }}
            onTest={(workflow) => {
              console.log('🧪 Testing workflow:', workflow);
              // TODO: Implement test functionality
            }}
          />
        ) : (
          <WorkflowExecutionsManager />
        )}
      </div>
    </div>
  );
}
