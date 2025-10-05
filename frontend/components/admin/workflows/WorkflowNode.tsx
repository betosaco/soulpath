'use client';

import React, { useState, useRef, useCallback } from 'react';
import { WorkflowNode as WorkflowNodeType } from './VisualWorkflowBuilder';
import {
  Workflow,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  Settings,
  RotateCcw,
  GripVertical,
  MoreHorizontal
} from 'lucide-react';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<WorkflowNodeType>) => void;
  onConnectionStart: (nodeId: string, handleId: string, position: { x: number; y: number }) => void;
  onConnectionEnd: (targetNodeId: string, targetHandleId: string) => void;
  onConnectionCancel: () => void;
  zoom: number;
}

export function WorkflowNode({
  node,
  isSelected,
  onSelect,
  onUpdate,
  onConnectionStart,
  onConnectionEnd,
  onConnectionCancel,
  zoom
}: WorkflowNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const nodeConfig = getNodeConfig(node.type);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === nodeRef.current || (e.target as HTMLElement).closest('.node-handle')) {
      return; // Don't start drag from handle
    }

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y
    });
    onSelect();
  }, [node.position, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      onUpdate({ position: newPosition });
    }
  }, [isDragging, dragStart, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleHandleMouseDown = useCallback((e: React.MouseEvent, handleId: string, isOutput: boolean) => {
    e.stopPropagation();
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      const position = {
        x: node.position.x + (isOutput ? 120 : 0),
        y: node.position.y + 30
      };
      onConnectionStart(node.id, handleId, position);
    }
  }, [node, onConnectionStart]);

  const handleHandleMouseUp = useCallback((e: React.MouseEvent, handleId: string, isOutput: boolean) => {
    e.stopPropagation();
    if (!isOutput) {
      onConnectionEnd(node.id, handleId);
    }
  }, [node.id, onConnectionEnd]);

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`relative bg-white border-2 rounded-lg shadow-lg min-w-[120px] ${nodeConfig.borderColor} ${isSelected ? 'border-blue-500' : ''}`}
      >
        {/* Node Header */}
        <div className={`flex items-center gap-2 p-2 border-b ${nodeConfig.headerBg}`}>
          <div className={`p-1 rounded ${nodeConfig.iconBg}`}>
            <nodeConfig.icon size={14} className={nodeConfig.iconColor} />
          </div>
          <span className="text-sm font-medium text-gray-900 truncate flex-1">
            {nodeConfig.label}
          </span>
          <GripVertical size={12} className="text-gray-400" />
        </div>

        {/* Node Content */}
        <div className="p-3">
          <div className="text-xs text-gray-600 mb-2">
            {getNodeDescription(node)}
          </div>

          {/* Input Handles */}
          {node.inputs.map((input) => (
            <div key={input.id} className="flex items-center gap-2 mb-1">
              <div
                className="node-handle w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-crosshair hover:bg-blue-600 hover:scale-110 transition-all duration-200 shadow-md"
                onMouseDown={(e) => handleHandleMouseDown(e, input.id, false)}
                onMouseUp={(e) => handleHandleMouseUp(e, input.id, false)}
                title={`Connect to ${input.label}`}
              />
              <span className="text-xs text-gray-600 font-medium">{input.label}</span>
            </div>
          ))}

          {/* Output Handles */}
          {node.outputs.map((output) => (
            <div key={output.id} className="flex items-center justify-end gap-2 mb-1">
              <span className="text-xs text-gray-600 font-medium">{output.label}</span>
              <div
                className="node-handle w-4 h-4 bg-green-500 rounded-full border-2 border-white cursor-crosshair hover:bg-green-600 hover:scale-110 transition-all duration-200 shadow-md"
                onMouseDown={(e) => handleHandleMouseDown(e, output.id, true)}
                onMouseUp={(e) => handleHandleMouseUp(e, output.id, true)}
                title={`Connect from ${output.label}`}
              />
            </div>
          ))}

          {/* Node-specific content */}
          {renderNodeContent(node)}
        </div>
      </div>
    </div>
  );
}

function getNodeConfig(type: string) {
  const configs = {
    trigger: {
      label: 'Trigger',
      icon: Workflow,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      headerBg: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    email: {
      label: 'Email',
      icon: Mail,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      headerBg: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    telegram: {
      label: 'Telegram',
      icon: MessageSquare,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      headerBg: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    sms: {
      label: 'SMS',
      icon: Smartphone,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      headerBg: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    whatsapp: {
      label: 'WhatsApp',
      icon: Send,
      iconColor: 'text-green-700',
      iconBg: 'bg-green-100',
      headerBg: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    condition: {
      label: 'Condition',
      icon: Settings,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      headerBg: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    delay: {
      label: 'Delay',
      icon: RotateCcw,
      iconColor: 'text-gray-600',
      iconBg: 'bg-gray-100',
      headerBg: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  };

  return configs[type as keyof typeof configs] || configs.trigger;
}

function getNodeDescription(node: WorkflowNodeType): string {
  switch (node.type) {
    case 'trigger':
      return `Triggers on ${node.data.eventType}`;
    case 'email':
      return node.data.template ? `Template: ${node.data.template}` : 'Configure template';
    case 'telegram':
      return node.data.template ? `Template: ${node.data.template}` : 'Configure template';
    case 'sms':
      return node.data.template ? `Template: ${node.data.template}` : 'Configure template';
    case 'whatsapp':
      return node.data.template ? `Template: ${node.data.template}` : 'Configure template';
    case 'condition':
      return `${node.data.field} ${node.data.operator} ${node.data.value}`;
    case 'delay':
      return `${node.data.duration} ${node.data.unit}`;
    default:
      return 'Configure node';
  }
}

function renderNodeContent(node: WorkflowNodeType) {
  switch (node.type) {
    case 'email':
      return (
        <div className="text-xs text-gray-500 mt-2">
          {node.data.recipients?.length || 0} recipients
        </div>
      );
    case 'telegram':
      return (
        <div className="text-xs text-gray-500 mt-2">
          {node.data.chatIds?.length || 0} chat IDs
        </div>
      );
    case 'condition':
      return (
        <div className="text-xs text-gray-500 mt-2">
          <div>True → {node.data.trueLabel}</div>
          <div>False → {node.data.falseLabel}</div>
        </div>
      );
    default:
      return null;
  }
}
