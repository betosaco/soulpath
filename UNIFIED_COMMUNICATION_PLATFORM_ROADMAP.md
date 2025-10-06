# 🚀 **Linked Communication Systems Roadmap**

## **Executive Summary**

This roadmap presents **two linked but independent systems** that work together to create a world-class communication platform:

- **🎨 Modular Template System**: Database-driven, UI-managed email templates with scenarios, components, and subjects
- **⚡ Visual Workflow System**: Advanced workflow builder with isolated executors, node registry, and stateful execution

**Integration Points:**
- Templates can be triggered by workflows
- Workflow variables can populate template placeholders
- Shared placeholder registry and event systems
- Unified admin interface with cross-system navigation

---

## **🎨 MODULAR TEMPLATE SYSTEM**

### **Phase 1A: Database-Driven Configuration**
**Status**: Models designed, ready for implementation

**New Prisma Models:**
```prisma
model EmailScenario {
  id            Int                   @id @default(autoincrement())
  scenarioKey   String                @unique @map("scenario_key")
  name          String
  description   String?
  customerType  String                @map("customer_type")
  orderTypes    String[]              @map("order_types")
  components    EmailScenarioComponent[]
  subjectTemplateId Int?              @map("subject_template_id")
  subjectTemplate EmailSubjectTemplate? @relation(fields: [subjectTemplateId], references: [id])
  priority      Int                   @default(0)
  isActive      Boolean               @default(true) @map("is_active")
  createdAt     DateTime              @default(now()) @map("created_at")
  updatedAt     DateTime              @updatedAt @map("updated_at")

  @@index([isActive, priority])
  @@map("email_scenarios")
}

model EmailComponent {
  id          Int                       @id @default(autoincrement())
  componentKey String                   @unique @map("component_key")
  name        String
  type        String
  template    String                    @db.Text
  conditions  Json
  dataMapping Json
  required    Boolean                   @default(false)
  isActive    Boolean                   @default(true) @map("is_active")
  createdAt   DateTime                  @default(now()) @map("created_at")
  updatedAt   DateTime                  @updatedAt @map("updated_at")

  @@index([type, isActive])
  @@map("email_components")
}

model EmailSubjectTemplate {
  id          Int                        @id @default(autoincrement())
  templateKey String                     @unique @map("template_key")
  template    String                     @db.Text
  placeholders String[]
  maxLength   Int?                       @default(60)
  isActive    Boolean                    @default(true) @map("is_active")
  createdAt   DateTime                   @default(now()) @map("created_at")
  updatedAt   DateTime                   @updatedAt @map("updated_at")

  @@index([isActive])
  @@map("email_subject_templates")
}
```

### **Phase 1B: Centralized Placeholder Registry**
**Status**: Ready for implementation

```typescript
// lib/communication/placeholderRegistry.ts
export const placeholderRegistry = {
  userName: {
    description: "Customer's full name",
    category: 'user',
    resolver: (data: OrderData) => data.customerName,
  },
  // Shared with workflow system
};
```

---

## **⚡ VISUAL WORKFLOW SYSTEM**

### **Phase 1A: Node Registry & Isolated Executors** ✅
**Status**: Implemented, tested

**Key Components:**
- `lib/workflows/nodes/registry.ts` - Declarative node configuration
- `lib/workflows/executors/` - Individual node execution logic
- Event emission system for debugging

### **Phase 1B: Workflow Execution Persistence**
**Status**: Models designed, ready for implementation

**New Prisma Models:**
```prisma
model WorkflowExecution {
  id            String             @id @default(cuid())
  workflowId    String             @map("workflow_id")
  status        ExecutionStatus    @default(RUNNING)
  currentNodeId String?            @map("current_node_id")
  input         Json?
  variables     Json?
  results       Json?
  executionPath String[]           @default([])
  startedAt     DateTime           @default(now()) @map("started_at")
  resumeAt      DateTime?          @map("resume_at")
  createdAt     DateTime           @default(now()) @map("created_at")
  updatedAt     DateTime           @updatedAt @map("updated_at")

  @@index([status, resumeAt])
  @@map("workflow_executions")
}

enum ExecutionStatus {
  RUNNING
  PAUSED
  COMPLETED
  FAILED
  CANCELLED
}
```

---

## **🎨 TEMPLATE SYSTEM - PHASE 2: VISUAL STUDIO**

### **Template Workbench** 🎯 **Next Priority**
**New Component:** `components/admin/templates/TemplateStudio.tsx`

**Three-Pane Interface:**
- **Left Pane:** Scenario selector with drag-and-drop component reordering
- **Center Pane:** Component assembly canvas with visual component cards
- **Right Pane:** Live preview with real-time updates

**Features:**
- Interactive scenario builder (customer type, order types, priority)
- Context-aware placeholder autocomplete
- Visual component editing with validation
- A/B testing controls for subject lines

---

## **⚡ WORKFLOW SYSTEM - PHASE 2: STATEFUL EXECUTION**

### **Database Persistence** 🎯 **Next Priority**
**Implementation:** Workflow execution state storage

**Features:**
- Long-running workflow support (hours/days)
- Execution resume capability
- Background worker for delayed tasks
- Execution history and debugging

### **Live Debug System**
**Integration:** Real-time execution monitoring

**Features:**
- WebSocket/SSE event streaming
- Node-by-node result inspection
- Animated connection data flow
- Performance metrics dashboard

---

## **PHASE 3: ADVANCED FEATURES**

### **Template System - Advanced**
- Visual diffing and version history
- Automated A/B testing
- Performance analytics (open rates, conversions)
- AI-powered optimization suggestions

### **Workflow System - Advanced**
- Sub-workflow components
- Visual sub-workflow embedding
- Advanced node library (API calls, database queries)
- Enterprise workflow templates

---

## **🔗 SYSTEM INTEGRATION POINTS**

### **Template ↔ Workflow Integration**
```typescript
// Email node in workflow can reference template scenarios
const emailNode = {
  type: 'email',
  data: {
    useTemplateScenario: true,
    scenarioId: 'new_customer_matpass_only',
    customOverrides: {
      subject: '{{userName}}, your MatPass is ready!'
    }
  }
};
```

### **Shared Placeholder Registry**
```typescript
// Both systems use the same placeholder resolver
import { placeholderRegistry } from '@/lib/communication/placeholderRegistry';

const templateValue = placeholderRegistry.userName.resolver(orderData);
const workflowValue = placeholderRegistry.userName.resolver(orderData);
```

### **Unified Admin Navigation**
- Cross-system breadcrumbs
- Shared search and filtering
- Unified analytics dashboard
- Integrated documentation

---

## **TECHNICAL INTEGRATION POINTS**

### **Template ↔ Workflow Integration**
```typescript
// Workflow email node can reference scenarios
const emailNode = {
  type: 'email',
  data: {
    scenarioId: 'new_customer_matpass_only',
    customSubject: '{{userName}}, your MatPass is ready!',
    additionalData: { /* workflow variables */ }
  }
};
```

### **Shared Placeholder System**
```typescript
// Workflows and templates share the same placeholder registry
const workflowVariable = placeholderRegistry.userName.resolver(orderData);
const templateVariable = placeholderRegistry.userName.resolver(orderData);
```

### **Unified Event System**
```typescript
// Both systems emit compatible events
workflowExecutor.emit('node:success', { nodeId, result });
templateRenderer.emit('render:complete', { scenarioId, html });
```

---

## **📅 IMPLEMENTATION ROADMAP**

### **Sprint 1: Template System Foundation** (2 weeks)
- [ ] Create EmailScenario, EmailComponent, EmailSubjectTemplate models
- [ ] Generate database migrations
- [ ] Create seeding scripts from existing config files
- [ ] Update ModularEmailService to use database
- [ ] Implement centralized placeholder registry

### **Sprint 2: Workflow System Persistence** (2 weeks)
- [ ] Create WorkflowExecution model and enum
- [ ] Implement stateful execution logic
- [ ] Add background worker for delayed tasks
- [ ] Create execution history and debugging APIs

### **Sprint 3: Template Studio UI** (3 weeks)
- [ ] Build TemplateStudio three-pane component
- [ ] Implement scenario builder interface
- [ ] Add drag-and-drop component reordering
- [ ] Create live preview system
- [ ] Context-aware placeholder autocomplete

### **Sprint 4: Workflow Live Debug** (2 weeks)
- [ ] Implement WebSocket/SSE event streaming
- [ ] Create live execution visualization
- [ ] Node-by-node result inspection
- [ ] Animated connection data flow

### **Sprint 5: Advanced Features** (3 weeks)
- [ ] A/B testing for subject lines
- [ ] Visual diffing and version history
- [ ] Sub-workflow components
- [ ] Performance analytics dashboard

### **Sprint 6: Integration & Polish** (2 weeks)
- [ ] Cross-system navigation and breadcrumbs
- [ ] Unified analytics dashboard
- [ ] Comprehensive testing
- [ ] Documentation and training materials

---

## **📊 SUCCESS METRICS**

### **Template System Goals:**
- ✅ Zero-code template management (marketing can create templates)
- ✅ 50% faster template creation and iteration
- ✅ Context-aware editing experience
- ✅ A/B testing and performance optimization

### **Workflow System Goals:**
- ✅ Support for long-running workflows (hours/days)
- ✅ Real-time debugging and monitoring
- ✅ Visual execution feedback
- ✅ Reusable workflow components

### **Integration Goals:**
- ✅ Seamless template ↔ workflow connectivity
- ✅ 80% reduction in technical barriers
- ✅ Shared placeholder and event systems
- ✅ Unified admin experience

---

## **📁 FILE STRUCTURE**

### **Template System Files:**
```
prisma/schema.prisma                           # EmailScenario, EmailComponent, EmailSubjectTemplate
lib/communication/placeholderRegistry.ts        # Centralized placeholder system
components/admin/templates/TemplateStudio.tsx   # Main workbench interface
components/admin/templates/ScenarioBuilder.tsx  # Scenario configuration UI
components/admin/templates/ComponentAssembler.tsx # Drag-drop component management
components/admin/templates/LivePreview.tsx      # Real-time preview component
api/admin/communication/templates/              # CRUD APIs for scenarios/components
```

### **Workflow System Files:**
```
prisma/schema.prisma                           # WorkflowExecution model
lib/workflows/stateful-execution.ts            # Persistent execution logic
components/admin/workflows/LiveDebugger.tsx    # Real-time debug interface
components/admin/workflows/StatefulExecutionManager.ts # Background processing
api/admin/workflows/executions/                 # Execution management APIs
```

### **Shared Integration Files:**
```
lib/communication/placeholderRegistry.ts        # Shared placeholder resolver
lib/communication/eventEmitter.ts               # Cross-system event system
components/admin/CommunicationDashboard.tsx     # Unified admin interface
components/admin/AnalyticsDashboard.tsx         # Combined analytics
```

---

## **🎯 CONCLUSION**

This roadmap presents **two linked but independent systems** that together create a world-class communication platform:

### **🎨 Template System Benefits:**
- **Empowers Non-Developers**: Marketing and support teams can create and manage email templates without code
- **Visual Template Creation**: Drag-and-drop interface with live preview eliminates guesswork
- **Performance Optimization**: A/B testing and analytics drive better engagement
- **Version Control**: Visual diffing and rollback capabilities ensure reliability

### **⚡ Workflow System Benefits:**
- **Long-Running Automation**: Support for workflows that span hours, days, or weeks
- **Real-Time Debugging**: Live execution monitoring with animated data flow
- **Scalable Architecture**: Isolated executors and stateful persistence
- **Reusable Components**: Sub-workflows promote consistency and efficiency

### **🔗 Integration Benefits:**
- **Seamless Connectivity**: Templates can be triggered by workflows, workflows can populate template variables
- **Shared Resources**: Common placeholder registry and event systems reduce duplication
- **Unified Experience**: Single admin interface with cross-system navigation
- **Enterprise Ready**: Scalable, maintainable, and extensible architecture

---

## **🚀 READY FOR IMPLEMENTATION**

**Phase 1 Foundation**: ✅ **COMPLETED**
- Template system models designed
- Workflow node registry implemented
- Isolated executors created
- Event emission system ready

**Next Steps**: Choose your starting point
- **Template-focused**: Start with Sprint 1 (Template System Foundation)
- **Workflow-focused**: Start with Sprint 2 (Workflow System Persistence)
- **Balanced approach**: Alternate between systems

The architecture supports **incremental development** - you can build and deploy improvements to one system while the other remains stable. The integration points ensure they work together seamlessly when both are enhanced.

Let's build this communication platform that empowers your entire team! 🚀
