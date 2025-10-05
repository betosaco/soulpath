# 🏗️ Modular Email Template System Architecture

## 📋 **System Overview**

### **1. Template Components (Reusable Blocks)**
```
components/
├── header/
│   ├── welcome-header.html
│   ├── renewal-header.html
│   └── order-header.html
├── content/
│   ├── matpass-info.html
│   ├── booking-info.html
│   ├── product-info.html
│   ├── order-summary.html
│   └── payment-info.html
├── sections/
│   ├── reminders.html
│   ├── next-steps.html
│   └── contact-info.html
└── footer/
    ├── standard-footer.html
    └── social-footer.html
```

### **2. Scenario Configuration**
```typescript
interface EmailScenario {
  id: string;
  name: string;
  description: string;
  customerType: 'new' | 'existing';
  orderTypes: OrderType[];
  components: ComponentConfig[];
  subjectTemplate: string;
  priority: number;
}
```

### **3. Dynamic Subject Generation**
```typescript
interface SubjectTemplate {
  template: string;
  placeholders: string[];
  conditions?: Condition[];
}
```

### **4. Component System**
```typescript
interface ComponentConfig {
  id: string;
  type: 'header' | 'content' | 'section' | 'footer';
  template: string;
  conditions: Condition[];
  order: number;
  dataMapping: DataMapping;
}
```

## 🎯 **Benefits**

✅ **Modular** - Mix and match components
✅ **Reusable** - Components used across scenarios  
✅ **Maintainable** - Update one component, affects all scenarios
✅ **Scalable** - Easy to add new scenarios
✅ **Dynamic** - Smart subject generation
✅ **Testable** - Each component can be tested independently

## 🔄 **Workflow**

1. **Order Created** → Analyze order data
2. **Scenario Detection** → Determine customer type + order composition
3. **Component Selection** → Choose relevant components
4. **Data Mapping** → Map order data to component placeholders
5. **Template Assembly** → Combine components into final email
6. **Subject Generation** → Create dynamic subject
7. **Email Delivery** → Send personalized email
