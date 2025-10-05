# 🔄 Migration Guide: Modular Email System

## 📋 **Current System vs New System**

### **Current System Problems:**
- ❌ Monolithic templates (one giant template per scenario)
- ❌ Hard to maintain (changes require updating multiple files)
- ❌ No reusability (duplicate code across templates)
- ❌ Complex routing (hard to add new scenarios)
- ❌ Static subjects (no dynamic personalization)

### **New Modular System Benefits:**
- ✅ **Modular** - Mix and match components
- ✅ **Reusable** - Components used across scenarios
- ✅ **Maintainable** - Update one component, affects all scenarios
- ✅ **Scalable** - Easy to add new scenarios
- ✅ **Dynamic** - Smart subject generation
- ✅ **Testable** - Each component can be tested independently

## 🚀 **Integration Steps**

### **Step 1: Update Order Email Service**

Replace the current `OrderEmailService` with the modular system:

```typescript
// OLD WAY (current)
import { OrderEmailService } from '@/lib/communication/order-email-service';

// NEW WAY (modular)
import { generateModularEmail } from '@/lib/communication/templates';
```

### **Step 2: Update Order Creation API**

In `/app/api/orders/create-unified/route.ts`:

```typescript
// Replace this section:
const result = await OrderEmailService.sendOrderConfirmationEmail(templateEmailData, 'es');

// With this:
const emailResult = await generateModularEmail(templateEmailData);
if (emailResult.success) {
  // Send email using your email service
  await sendEmail({
    to: templateEmailData.customerEmail,
    subject: emailResult.subject,
    html: emailResult.content
  });
}
```

### **Step 3: Database Migration**

Create new tables for the modular system:

```sql
-- Scenarios table
CREATE TABLE email_scenarios (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  customer_type ENUM('new', 'existing', 'both') NOT NULL,
  order_types JSON NOT NULL,
  components JSON NOT NULL,
  subject_template VARCHAR(100) NOT NULL,
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Components table
CREATE TABLE email_components (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('header', 'content', 'section', 'footer') NOT NULL,
  template TEXT NOT NULL,
  conditions JSON,
  order_index INT DEFAULT 0,
  data_mapping JSON,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Subject templates table
CREATE TABLE email_subject_templates (
  id VARCHAR(50) PRIMARY KEY,
  template VARCHAR(200) NOT NULL,
  placeholders JSON,
  conditions JSON,
  max_length INT DEFAULT 60,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🎯 **Usage Examples**

### **Basic Usage:**
```typescript
import { generateModularEmail } from '@/lib/communication/templates';

const orderData = {
  customerName: 'Alberto Saco',
  customerEmail: 'betosaco@gmail.com',
  isNewCustomer: false,
  matpassItems: [{ name: '08 MATPASS', sessions: 8, totalPrice: 350 }],
  // ... other order data
};

const emailResult = await generateModularEmail(orderData);
```

### **Testing Scenarios:**
```typescript
import { testScenario } from '@/lib/communication/templates';

// Test specific scenario
const result = await testScenario('existing_customer_matpass_only', orderData);
```

### **Getting Available Options:**
```typescript
import { getAvailableScenarios, getAvailableComponents } from '@/lib/communication/templates';

const scenarios = getAvailableScenarios();
const components = getAvailableComponents();
```

## 🔧 **Customization**

### **Adding New Components:**
1. Add component to `config/components.ts`
2. Update scenarios that need the component
3. Test the new component

### **Adding New Scenarios:**
1. Add scenario to `config/scenarios.ts`
2. Add subject template to `config/subjects.ts`
3. Test the new scenario

### **Modifying Existing Components:**
1. Update component in `config/components.ts`
2. All scenarios using that component will automatically use the new version

## 📊 **Performance Benefits**

- **Faster Development** - Reuse components instead of duplicating code
- **Easier Maintenance** - Update one component, affects all scenarios
- **Better Testing** - Test components individually
- **Scalable** - Easy to add new scenarios and components
- **Dynamic** - Smart subject generation based on order data

## 🎉 **Migration Complete!**

Once migrated, you'll have:
- ✅ Clean, maintainable code
- ✅ Reusable components
- ✅ Dynamic subject generation
- ✅ Easy scenario management
- ✅ Better testing capabilities
- ✅ Scalable architecture
