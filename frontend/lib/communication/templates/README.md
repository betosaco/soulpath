# 🏗️ Modular Email Template System + Visual Workflows

## 📋 Overview

This system provides a comprehensive, scalable solution for managing communication workflows with:

- **Modular Template System**: Reusable components for email templates
- **Visual Workflow Builder**: n8n-like drag-and-drop interface
- **Multi-Channel Support**: Email, Telegram, SMS, WhatsApp
- **Dynamic Scenarios**: Smart routing based on order data
- **Bilingual Support**: Spanish/English interface

## 🏛️ Architecture

### Core Components

```
├── types.ts                    # TypeScript interfaces
├── scenario-detector.ts        # Smart scenario detection
├── component-engine.ts         # Reusable component management
├── subject-generator.ts        # Dynamic subject generation
├── modular-email-service.ts    # Main email service
├── index.ts                    # Public API
├── config/
│   ├── scenarios.ts           # Scenario definitions
│   ├── components.ts          # Component definitions
│   └── subjects.ts            # Subject templates
└── migration-guide.md         # Migration documentation
```

### Visual Workflow Components

```
components/admin/workflows/
├── VisualWorkflowBuilder.tsx   # Main workflow builder
├── WorkflowCanvas.tsx          # Canvas with drag-and-drop
├── WorkflowNode.tsx            # Individual node components
└── WorkflowEngine.ts           # Execution engine
```

## 🎯 Key Features

### ✅ Modular Templates
- **Reusable Components**: Header, content, section, footer blocks
- **Conditional Logic**: Components show/hide based on data
- **Data Mapping**: Flexible placeholder replacement
- **Multi-Language**: Spanish/English support

### ✅ Visual Workflow Builder
- **Drag & Drop**: Intuitive n8n-style interface
- **Node-Based**: Connect communication steps visually
- **Real-time Preview**: See changes immediately
- **Multi-Channel**: Email, Telegram, SMS, WhatsApp nodes

### ✅ Smart Scenario Detection
- **Auto-Routing**: Based on customer type and order composition
- **Priority System**: Control execution order
- **Conditional Logic**: Visual condition builders
- **Error Handling**: Graceful failure management

### ✅ Dynamic Subject Generation
- **Personalized**: Use customer data in subjects
- **Template-Based**: Reusable subject patterns
- **Length Control**: Automatic truncation
- **Multi-Language**: Localized subjects

## 🚀 Usage

### Basic Email Generation

```typescript
import { generateModularEmail } from '@/lib/communication/templates';

const orderData = {
  customerName: 'Alberto Saco',
  isNewCustomer: false,
  matpassItems: [{ name: '08 MATPASS' }],
  // ... other data
};

const result = await generateModularEmail(orderData);
```

### Visual Workflow Creation

```tsx
import { VisualWorkflowBuilder } from '@/components/admin/workflows';

<VisualWorkflowBuilder
  language="es"
  onSave={handleWorkflowSave}
  onTest={handleWorkflowTest}
/>
```

### Custom Component Creation

```typescript
const customComponent: ComponentConfig = {
  id: 'custom_header',
  name: 'Custom Header',
  type: 'header',
  template: '<div class="custom">{{customField}}</div>',
  conditions: [{ field: 'isVIP', operator: 'equals', value: true }],
  dataMapping: { customField: 'customer.vipStatus' }
};
```

## 🎨 Available Node Types

### Trigger Nodes
- **Order Created**: Fires on new orders
- **Booking Created**: Fires on new bookings
- **Payment Completed**: Fires on successful payments

### Communication Nodes
- **Email**: Send email using modular templates
- **Telegram**: Send Telegram messages
- **SMS**: Send SMS notifications
- **WhatsApp**: Send WhatsApp messages

### Logic Nodes
- **Condition**: Route based on order data
- **Delay**: Add time delays between steps

## 🔧 Configuration

### Adding New Scenarios

1. Define scenario in `config/scenarios.ts`
2. Add subject template in `config/subjects.ts`
3. Test with preview system

### Creating Custom Components

1. Create component template
2. Define data mapping
3. Set conditions
4. Add to configuration

### Building Workflows

1. Drag nodes from palette
2. Connect with drag handles
3. Configure each node
4. Test workflow execution

## 📊 Scenarios Supported

- ✅ **New Customer + MatPass**
- ✅ **Existing Customer + MatPass Renewal**
- ✅ **MatPass + Booking**
- ✅ **MatPass + Products**
- ✅ **Complete Orders** (MatPass + Booking + Products)
- ✅ **Fallback** (unmatched scenarios)

## 🌐 Multi-Language Support

### Spanish Interface
- Plantillas modulares
- Constructor visual de flujos
- Gestión de escenarios
- Soporte completo en español

### English Interface
- Modular templates
- Visual workflow builder
- Scenario management
- Full English support

## 🔄 Migration Guide

### From Old System

1. **Install New System**: Components are backward compatible
2. **Migrate Templates**: Use migration script
3. **Update Code**: Replace old service calls
4. **Test Workflows**: Use visual builder for new workflows

### Database Setup

```sql
-- Run setup-modular-templates.js
node scripts/setup-modular-templates.js
```

## 🎉 Benefits

- **🚀 Scalable**: Easy to add new scenarios and channels
- **🔧 Maintainable**: Component-based architecture
- **🎨 Visual**: Intuitive drag-and-drop interface
- **🌐 Bilingual**: Full Spanish/English support
- **⚡ Performant**: Optimized execution engine
- **🛡️ Reliable**: Error handling and recovery

## 📈 Performance

- **Lazy Loading**: Components load on demand
- **Caching**: Template compilation caching
- **Async Execution**: Non-blocking workflow execution
- **Timeout Protection**: Prevents hanging workflows

## 🔒 Security

- **Input Validation**: All data validated before processing
- **Template Sanitization**: HTML templates are safe
- **Rate Limiting**: Prevents spam and abuse
- **Audit Logging**: All executions logged

## 🎯 Next Steps

1. **Add More Channels**: Push notifications, webhooks
2. **Advanced Conditions**: Complex logic builders
3. **Template Analytics**: Track performance metrics
4. **A/B Testing**: Test different templates
5. **Integration APIs**: Connect with external services

---

*This system transforms communication management from a complex, error-prone process into an intuitive, visual experience similar to modern workflow automation tools like n8n.*
