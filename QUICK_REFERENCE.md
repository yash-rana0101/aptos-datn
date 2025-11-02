# 🚀 Quick Reference Card - Smart Contract Integration

## 📦 Import Statements

```typescript
// Profile
import { 
  useUserProfile, 
  useRegisterProfile, 
  useUpdateProfile,
  useIsBuyer,
  useIsSeller 
} from '@/lib/hooks/useProfileContract'

// Product
import { 
  useProduct, 
  useSellerProducts,
  useCreateProduct, 
  useUpdateProduct,
  useDeleteProduct,
  useSetProductAvailability 
} from '@/lib/hooks/useProductContract'

// Order
import { 
  useOrder, 
  useBuyerOrders, 
  useSellerOrders,
  usePlaceOrder, 
  useUpdateOrderStatus,
  useCancelOrder 
} from '@/lib/hooks/useOrderContract'

// Escrow
import { 
  useEscrowOrder,
  useBuyerEscrowOrders, 
  useSellerEscrowOrders,
  useInitiateTrade, 
  useDeliverOrder,
  useConfirmDelivery,
  useDeliveryCode,
  useReceivingCode 
} from '@/lib/hooks/useEscrowContract'

// Constants
import { 
  USER_ROLES, 
  ORDER_STATUS, 
  ESCROW_STATUS,
  toOctas, 
  toAPT 
} from '@/constants'

// Wallet
import { useWallet } from '@aptos-labs/wallet-adapter-react'
```

---

## 🔑 Common Patterns

### **Get Wallet Address**
```typescript
const { account, connected } = useWallet()
const address = account?.address?.toString()
```

### **Read User Profile**
```typescript
const { data: profile, isLoading } = useUserProfile(address)
// profile: { name, email, role, country, ... }
```

### **Read Product**
```typescript
const { data: product } = useProduct(productAddress)
// product: { title, price, quantity, imageUrls, ... }
```

### **Read Order**
```typescript
const { data: order } = useOrder(orderAddress)
// order: { productAddress, quantity, totalPrice, status, ... }
```

### **Read Escrow**
```typescript
const { data: escrow } = useEscrowOrder(escrowOrderAddress)
// escrow: { deliveryCode, receivingCode, status, lockedFunds, ... }
```

---

## ✍️ Write Operations

### **Register Profile**
```typescript
const { mutate: register, isPending } = useRegisterProfile()

register({
  name: 'John Doe',
  country: 'USA',
  role: USER_ROLES.BUYER, // or USER_ROLES.SELLER
  email: 'john@example.com',
  address: '123 Main St',
  bio: 'Love shopping!',
})
```

### **Create Product**
```typescript
const { mutate: createProduct, isPending } = useCreateProduct()

createProduct({
  title: 'Gaming Laptop',
  description: 'High-performance laptop',
  price: toOctas(1500), // 1500 APT → octas
  quantity: 10,
  imageUrls: ['https://...', 'https://...'],
  category: 'Electronics',
})
```

### **Place Order**
```typescript
const { mutate: placeOrder, isPending } = usePlaceOrder()

placeOrder({
  productAddress: '0x...',
  quantity: 2,
  shippingAddress: '123 Main St, City',
  notes: 'Please deliver before 5 PM',
})
```

### **Initiate Escrow Trade**
```typescript
const { mutate: initiateTrade, isPending } = useInitiateTrade()

initiateTrade({
  productAddress: '0x...',
  quantity: 1,
  shippingAddress: '123 Main St',
  transactionHash: `${Date.now()}`,
})
```

### **Deliver Order (Seller)**
```typescript
const { data: deliveryCode } = useDeliveryCode(escrowOrderAddress)
const { mutate: deliverOrder } = useDeliverOrder()

deliverOrder({
  escrowOrderAddress: '0x...',
  deliveryCode: deliveryCode, // 6-digit code
})
```

### **Confirm Delivery (Buyer)**
```typescript
const { data: receivingCode } = useReceivingCode(escrowOrderAddress)
const { mutate: confirmDelivery } = useConfirmDelivery()

confirmDelivery({
  escrowOrderAddress: '0x...',
  receivingCode: receivingCode, // 4-digit code
})
```

---

## 💰 Price Conversion

```typescript
// Display to user (APT)
const priceInAPT = toAPT(product.price) 
// 150000000 → 1.5 APT

// Send to contract (octas)
const priceInOctas = toOctas(1.5) 
// 1.5 APT → 150000000 octas

// Format for display
<span>{toAPT(product.price).toFixed(2)} APT</span>
```

---

## 🎨 Status Constants

### **User Roles**
```typescript
USER_ROLES.BUYER   // 1
USER_ROLES.SELLER  // 2
```

### **Order Status**
```typescript
ORDER_STATUS.PENDING    // 1
ORDER_STATUS.CONFIRMED  // 2
ORDER_STATUS.PROCESSING // 3
ORDER_STATUS.SHIPPED    // 4
ORDER_STATUS.DELIVERED  // 5
ORDER_STATUS.CANCELLED  // 6
ORDER_STATUS.REFUNDED   // 7
```

### **Escrow Status**
```typescript
ESCROW_STATUS.INITIATED  // 1 - Trade initiated
ESCROW_STATUS.LOCKED     // 2 - Funds locked
ESCROW_STATUS.DELIVERED  // 3 - Seller delivered
ESCROW_STATUS.CONFIRMED  // 4 - Buyer confirmed
ESCROW_STATUS.CANCELLED  // 5 - Cancelled
ESCROW_STATUS.REFUNDED   // 6 - Refunded
```

---

## 🔄 Loading & Error States

```typescript
const { 
  data, 
  isLoading, 
  isError, 
  error,
  refetch 
} = useUserProfile(address)

if (isLoading) return <Spinner />
if (isError) return <Error message={error.message} />
if (!data) return <div>No data</div>

return <Profile data={data} />
```

```typescript
const { 
  mutate, 
  isPending, 
  isError, 
  error 
} = useCreateProduct()

<Button onClick={() => mutate(data)} disabled={isPending}>
  {isPending ? 'Creating...' : 'Create Product'}
</Button>

{isError && <Alert variant="error">{error.message}</Alert>}
```

---

## 📋 Common Component Patterns

### **Product Card**
```typescript
function ProductCard({ productAddress }: { productAddress: string }) {
  const { data: product, isLoading } = useProduct(productAddress)
  
  if (isLoading) return <Skeleton />
  if (!product) return null
  
  return (
    <Card>
      <img src={product.imageUrls[0]} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{toAPT(product.price)} APT</p>
      <Badge>{product.category}</Badge>
      <p>Stock: {product.quantity - product.soldQuantity}</p>
    </Card>
  )
}
```

### **Order Card**
```typescript
function OrderCard({ orderAddress }: { orderAddress: string }) {
  const { data: order } = useOrder(orderAddress)
  const { data: product } = useProduct(order?.productAddress || '')
  
  if (!order || !product) return null
  
  return (
    <Card>
      <h3>{product.title}</h3>
      <p>Quantity: {order.quantity}</p>
      <p>Total: {toAPT(order.totalPrice)} APT</p>
      <OrderStatusBadge status={order.status} />
    </Card>
  )
}
```

### **Status Badge**
```typescript
function OrderStatusBadge({ status }: { status: number }) {
  const statusMap = {
    [ORDER_STATUS.PENDING]: { label: 'Pending', color: 'yellow' },
    [ORDER_STATUS.CONFIRMED]: { label: 'Confirmed', color: 'blue' },
    [ORDER_STATUS.SHIPPED]: { label: 'Shipped', color: 'purple' },
    [ORDER_STATUS.DELIVERED]: { label: 'Delivered', color: 'green' },
  }
  
  const { label, color } = statusMap[status] || { label: 'Unknown', color: 'gray' }
  
  return <Badge variant={color}>{label}</Badge>
}
```

### **List Component**
```typescript
function ProductList() {
  const { account } = useWallet()
  const { data: productAddresses, isLoading } = useSellerProducts(
    account?.address?.toString()
  )
  
  if (isLoading) return <Skeleton count={3} />
  if (!productAddresses?.length) return <EmptyState />
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {productAddresses.map(address => (
        <ProductCard key={address} productAddress={address} />
      ))}
    </div>
  )
}
```

---

## 🎯 Escrow Flow Cheat Sheet

### **1. Buyer Initiates (Lock Funds)**
```typescript
const { mutate: initiate } = useInitiateTrade()
initiate({ productAddress, quantity, shippingAddress, transactionHash })
// ✅ Result: Funds locked, 6-digit delivery code generated
```

### **2. Seller Delivers**
```typescript
const { data: deliveryCode } = useDeliveryCode(escrowOrderAddress)
// Display: "123456"

const { mutate: deliver } = useDeliverOrder()
deliver({ escrowOrderAddress, deliveryCode })
// ✅ Result: Order marked delivered, 4-digit receiving code generated
```

### **3. Buyer Confirms (Release Funds)**
```typescript
const { data: receivingCode } = useReceivingCode(escrowOrderAddress)
// Display: "1234"

const { mutate: confirm } = useConfirmDelivery()
confirm({ escrowOrderAddress, receivingCode })
// ✅ Result: Delivery confirmed, funds released to seller
```

### **4. Cancel (Optional)**
```typescript
const { mutate: cancel } = useCancelEscrow()
cancel({ escrowOrderAddress, reason: 'Out of stock' })
// ✅ Result: Escrow cancelled, funds refunded to buyer
```

---

## 🐛 Common Issues

### **Issue: AccountAddress type error**
```typescript
// ❌ Wrong
const address = account?.address

// ✅ Correct
const address = account?.address?.toString()
```

### **Issue: Price showing as huge number**
```typescript
// ❌ Wrong - displaying octas
<span>{product.price}</span> // Shows: 150000000

// ✅ Correct - convert to APT
<span>{toAPT(product.price)} APT</span> // Shows: 1.5 APT
```

### **Issue: Can't find product by ID**
```typescript
// ❌ Wrong - using database ID
const { data } = useProduct(product.id)

// ✅ Correct - using blockchain address
const { data } = useProduct(product.productAddress)
```

### **Issue: Query not updating after mutation**
```typescript
// The hooks already handle this! 
// They automatically invalidate queries after mutations.
// If it's not working, check that you're using the correct query keys.
```

---

## 📚 File Locations

| Purpose | Location |
|---------|----------|
| Contract Services | `src/lib/contracts/*.ts` |
| React Hooks | `src/lib/hooks/use*Contract.ts` |
| Type Definitions | `src/lib/types/contracts.ts` |
| Constants | `src/constants.ts` |
| Aptos Client | `src/lib/aptos.ts` |
| Documentation | `*.md` files in root |

---

## 🎓 Learning Resources

1. **`SMART_CONTRACT_INTEGRATION.md`** - Full API reference (57 functions)
2. **`MIGRATION_EXAMPLES.tsx`** - Before/After code examples
3. **`INTEGRATION_CHECKLIST.md`** - Step-by-step guide
4. **This file** - Quick copy-paste reference

---

**Keep this file open while coding! 📌**

*Copy-paste these patterns and adapt them to your needs.*
