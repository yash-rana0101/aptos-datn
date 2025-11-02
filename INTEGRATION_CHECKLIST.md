# 🎯 Frontend Integration Checklist

Use this checklist to systematically update your frontend components to use the blockchain integration.

---

## ✅ Phase 1: Environment Setup (DONE)

- [x] Smart contracts compiled
- [x] Contract services created
- [x] React Query hooks created
- [x] Type definitions created
- [x] Constants configured
- [x] Aptos client configured

---

## 🔧 Phase 2: Configuration (YOUR WORK)

### **Update Environment Variables**
- [ ] Set `NEXT_PUBLIC_MODULE_ADDRESS` to your deployed contract address
- [ ] Set `NEXT_PUBLIC_APP_NETWORK` (testnet/mainnet)
- [ ] (Optional) Set `NEXT_PUBLIC_APTOS_API_KEY`

**File:** `.env.local`
```env
NEXT_PUBLIC_APP_NETWORK=testnet
NEXT_PUBLIC_MODULE_ADDRESS=0xYOUR_ADDRESS_HERE
NEXT_PUBLIC_APTOS_API_KEY=your_key_optional
```

---

## 📝 Phase 3: Update Components (YOUR WORK)

### **1. Authentication & Profile**

#### File: `src/components/auth/RegistrationForm.tsx`
- [ ] Replace `useRegister()` with `useRegisterProfile()`
- [ ] Update form fields to match Move struct
- [ ] Add `country`, `address`, `bio` fields
- [ ] Use `USER_ROLES.BUYER` or `USER_ROLES.SELLER`

**Import:**
```typescript
import { useRegisterProfile } from '@/lib/hooks/useProfileContract'
import { USER_ROLES } from '@/constants'
```

#### File: `src/app/profile/page.tsx`
- [ ] Replace `useCurrentUser()` with `useUserProfile()`
- [ ] Update to use `account?.address?.toString()`
- [ ] Display blockchain profile data

**Import:**
```typescript
import { useUserProfile, useIsSeller } from '@/lib/hooks/useProfileContract'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
```

---

### **2. Product Management**

#### File: `src/app/seller/products/page.tsx` (Seller Dashboard)
- [ ] Replace `useProducts()` with `useSellerProducts()`
- [ ] Update to fetch products by seller address
- [ ] Map over `productAddresses` array
- [ ] Use `useProduct(address)` for each product

**Import:**
```typescript
import { useSellerProducts, useProduct } from '@/lib/hooks/useProductContract'
```

#### File: `src/components/product/ProductCard.tsx`
- [ ] Update props to accept `productAddress` instead of `product object`
- [ ] Use `useProduct(productAddress)` hook
- [ ] Convert price with `toAPT(product.price)`
- [ ] Display `product.imageUrls[0]`

**Import:**
```typescript
import { useProduct } from '@/lib/hooks/useProductContract'
import { toAPT } from '@/constants'
```

#### File: Create Product Form
- [ ] Replace `useCreateProduct()` with blockchain version
- [ ] Convert price with `toOctas(price)`
- [ ] Change `name` → `title`
- [ ] Change `images` → `imageUrls` (array of strings)
- [ ] Add `quantity` field

**Import:**
```typescript
import { useCreateProduct } from '@/lib/hooks/useProductContract'
import { toOctas } from '@/constants'
```

#### File: Update Product Form
- [ ] Pass `productAddress` instead of product ID
- [ ] Use `useUpdateProduct()` hook
- [ ] Convert price with `toOctas()`

**Import:**
```typescript
import { useUpdateProduct } from '@/lib/hooks/useProductContract'
```

#### File: Product Listing/Marketplace
- [ ] Get all seller addresses (you may need to maintain a list)
- [ ] For each seller, fetch their products
- [ ] Or implement product discovery mechanism
- [ ] Display products with blockchain data

---

### **3. Orders**

#### File: `src/app/order/page.tsx` (Buyer Orders)
- [ ] Replace `getUserOrders()` with `useBuyerOrders()`
- [ ] Map over `orderAddresses` array
- [ ] Use `useOrder(address)` for each order
- [ ] Fetch product details with `useProduct(order.productAddress)`

**Import:**
```typescript
import { useBuyerOrders, useOrder } from '@/lib/hooks/useOrderContract'
import { useProduct } from '@/lib/hooks/useProductContract'
```

#### File: `src/app/seller/page.tsx` (Seller Orders)
- [ ] Replace with `useSellerOrders()`
- [ ] Same pattern as buyer orders

**Import:**
```typescript
import { useSellerOrders, useOrder } from '@/lib/hooks/useOrderContract'
```

#### File: Place Order / Buy Button
- [ ] Replace order creation with `usePlaceOrder()`
- [ ] Pass `productAddress` instead of product ID
- [ ] Add `shippingAddress` and `notes`

**Import:**
```typescript
import { usePlaceOrder } from '@/lib/hooks/useOrderContract'
```

#### File: Order Status Updates (Seller)
- [ ] Use `useUpdateOrderStatus()` hook
- [ ] Use constants from `ORDER_STATUS`
- [ ] Pass `orderAddress` and `newStatus`

**Import:**
```typescript
import { useUpdateOrderStatus } from '@/lib/hooks/useOrderContract'
import { ORDER_STATUS } from '@/constants'
```

---

### **4. Escrow Flow (NEW FEATURE)**

#### File: `src/app/checkout/page.tsx`
- [ ] Create checkout page
- [ ] Implement `useInitiateTrade()` hook
- [ ] Lock funds when buyer clicks "Buy Now"
- [ ] Show transaction confirmation

**Import:**
```typescript
import { useInitiateTrade } from '@/lib/hooks/useEscrowContract'
```

**Implementation:**
```typescript
const { mutate: initiateTrade, isPending } = useInitiateTrade()

const handleCheckout = () => {
  initiateTrade({
    productAddress: product.productAddress,
    quantity: 1,
    shippingAddress: userProfile.physicalAddress,
    transactionHash: `${Date.now()}`,
  })
}
```

#### File: `src/app/seller/page.tsx` (Seller Escrow Orders)
- [ ] Add tab for "Escrow Orders"
- [ ] Use `useSellerEscrowOrders()` hook
- [ ] Display delivery codes with `useDeliveryCode()`
- [ ] Implement "Mark as Delivered" button with `useDeliverOrder()`

**Import:**
```typescript
import { 
  useSellerEscrowOrders, 
  useEscrowOrder,
  useDeliveryCode, 
  useDeliverOrder 
} from '@/lib/hooks/useEscrowContract'
```

**Implementation:**
```typescript
// Display delivery code
const { data: deliveryCode } = useDeliveryCode(escrowOrderAddress)

// Deliver order
const { mutate: deliverOrder } = useDeliverOrder()
deliverOrder({
  escrowOrderAddress: escrowOrderAddress,
  deliveryCode: deliveryCode,
})
```

#### File: `src/app/order/page.tsx` (Buyer Escrow Orders)
- [ ] Add tab for "Escrow Orders"
- [ ] Use `useBuyerEscrowOrders()` hook
- [ ] Display receiving codes with `useReceivingCode()`
- [ ] Implement "Confirm Delivery" button with `useConfirmDelivery()`

**Import:**
```typescript
import { 
  useBuyerEscrowOrders, 
  useEscrowOrder,
  useReceivingCode, 
  useConfirmDelivery 
} from '@/lib/hooks/useEscrowContract'
```

**Implementation:**
```typescript
// Display receiving code
const { data: receivingCode } = useReceivingCode(escrowOrderAddress)

// Confirm delivery
const { mutate: confirmDelivery } = useConfirmDelivery()
confirmDelivery({
  escrowOrderAddress: escrowOrderAddress,
  receivingCode: receivingCode,
})
```

#### File: Escrow Status Component
- [ ] Create component to show escrow status
- [ ] Use `useEscrowStatus()` hook
- [ ] Display status badge with `ESCROW_STATUS` constants

**Import:**
```typescript
import { useEscrowStatus } from '@/lib/hooks/useEscrowContract'
import { ESCROW_STATUS } from '@/constants'
```

---

### **5. UI Components**

#### Create: `src/components/PriceDisplay.tsx`
- [ ] Component to display APT prices
- [ ] Convert octas to APT with `toAPT()`

```typescript
import { toAPT } from '@/constants'

export function PriceDisplay({ octas }: { octas: number }) {
  return (
    <div>
      <span className="text-xl font-bold">{toAPT(octas).toFixed(2)} APT</span>
    </div>
  )
}
```

#### Create: `src/components/OrderStatusBadge.tsx`
- [ ] Component to display order status
- [ ] Use `ORDER_STATUS` constants
- [ ] Color-coded badges

```typescript
import { ORDER_STATUS } from '@/constants'

export function OrderStatusBadge({ status }: { status: number }) {
  const getStatusInfo = (status: number) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return { label: 'Pending', color: 'yellow' }
      case ORDER_STATUS.CONFIRMED: return { label: 'Confirmed', color: 'blue' }
      // ... etc
    }
  }
  
  const info = getStatusInfo(status)
  return <Badge variant={info.color}>{info.label}</Badge>
}
```

#### Create: `src/components/EscrowStatusBadge.tsx`
- [ ] Component to display escrow status
- [ ] Use `ESCROW_STATUS` constants

```typescript
import { ESCROW_STATUS } from '@/constants'

export function EscrowStatusBadge({ status }: { status: number }) {
  // Similar to OrderStatusBadge
}
```

---

## 🗑️ Phase 4: Remove Old Files (YOUR WORK)

### **Delete Web2 API Files**
- [ ] `src/lib/api/client.ts`
- [ ] `src/lib/services/auth.ts`
- [ ] `src/lib/services/product.ts`
- [ ] `src/lib/services/order.ts`
- [ ] `src/lib/services/users.ts`

### **Delete Old Hooks**
- [ ] `src/lib/hooks/useAuthQuery.ts`
- [ ] `src/lib/hooks/useProductQuery.ts`
- [ ] `src/lib/hooks/useOrderQuery.ts`
- [ ] `src/lib/hooks/useUserQuery.ts`

### **Delete Database Files**
- [ ] `src/db/getLastSuccessVersion.ts`
- [ ] `src/db/getMessage.ts`
- [ ] `src/db/getMessages.ts`
- [ ] `src/db/getUserStats.ts`

### **Delete Old Entry Functions**
- [ ] `src/entry-functions/createMessage.ts`
- [ ] `src/entry-functions/updateMessage.ts`

### **Update Web3 Config**
- [ ] Remove Volta network config from `src/lib/web3/config.ts`
- [ ] Keep only Aptos configuration

---

## 🧪 Phase 5: Testing (YOUR WORK)

### **Test User Registration**
- [ ] Connect wallet
- [ ] Fill registration form
- [ ] Sign transaction
- [ ] Verify profile created on blockchain

### **Test Product Creation**
- [ ] Register as seller
- [ ] Create product
- [ ] Verify product appears in seller dashboard
- [ ] Check price conversion (APT ↔ octas)

### **Test Order Flow**
- [ ] Browse products
- [ ] Place order
- [ ] Verify order appears in buyer dashboard
- [ ] Check order status updates

### **Test Escrow Flow**
- [ ] Buyer: Initiate trade (funds locked)
- [ ] Buyer: Check balance decreased
- [ ] Seller: See delivery code (6 digits)
- [ ] Seller: Mark as delivered
- [ ] Buyer: See receiving code (4 digits)
- [ ] Buyer: Confirm delivery
- [ ] Seller: Check balance increased (funds released)

### **Test Edge Cases**
- [ ] Try to create product as buyer (should fail)
- [ ] Try to update order as buyer (should fail)
- [ ] Try to deliver with wrong code (should fail)
- [ ] Try to confirm with wrong code (should fail)
- [ ] Cancel escrow and verify refund

---

## 📊 Phase 6: Optimization (YOUR WORK)

### **Implement Loading States**
- [ ] Add skeletons for loading products
- [ ] Add spinners for mutations
- [ ] Disable buttons during transactions

### **Implement Error Handling**
- [ ] Add error boundaries
- [ ] Show user-friendly error messages
- [ ] Handle wallet connection errors
- [ ] Handle insufficient balance errors

### **Implement Caching Strategy**
- [ ] Configure staleTime for queries
- [ ] Implement optimistic updates
- [ ] Add manual refetch buttons

### **Implement Real-time Updates**
- [ ] Use React Query refetchInterval for orders
- [ ] Update UI when transaction confirms
- [ ] Show transaction pending states

---

## 📱 Phase 7: UI/UX Polish (YOUR WORK)

### **Add Visual Feedback**
- [ ] Transaction pending indicators
- [ ] Success animations
- [ ] Error toast notifications
- [ ] Loading skeletons

### **Add Wallet Integration**
- [ ] Wallet connection modal
- [ ] Display wallet address
- [ ] Display APT balance
- [ ] Disconnect button

### **Add Confirmation Dialogs**
- [ ] Confirm before expensive transactions
- [ ] Show gas estimates
- [ ] Show price in APT and USD

### **Add Empty States**
- [ ] No products message
- [ ] No orders message
- [ ] No escrow orders message

---

## ✅ Phase 8: Final Checks

### **Code Quality**
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] All imports resolved
- [ ] All unused code removed

### **Functionality**
- [ ] All CRUD operations work
- [ ] Escrow flow complete
- [ ] Role-based access works
- [ ] Price conversions correct

### **Performance**
- [ ] No unnecessary re-renders
- [ ] Queries cached properly
- [ ] Images optimized
- [ ] Bundle size reasonable

### **Documentation**
- [ ] Code comments added
- [ ] README updated
- [ ] ENV variables documented
- [ ] Deployment guide created

---

## 📚 Reference Documents

1. **`SMART_CONTRACT_INTEGRATION.md`** - Complete API reference
2. **`INTEGRATION_COMPLETE.md`** - What was done summary
3. **`MIGRATION_EXAMPLES.tsx`** - Side-by-side code examples
4. **This file** - Step-by-step checklist

---

## 🆘 Troubleshooting

### **Issue: "Wallet not connected"**
```typescript
// Solution: Check wallet connection
const { account, connected } = useWallet()

if (!connected) {
  return <WalletConnectModal />
}
```

### **Issue: "Transaction failed"**
```typescript
// Solution: Add better error handling
const { mutate, error } = useCreateProduct()

if (error) {
  console.error('Transaction error:', error)
  // Show user-friendly message
}
```

### **Issue: "Module not found"**
```typescript
// Solution: Check MODULE_ADDRESS in .env.local
// Make sure it matches your deployed contract address
```

### **Issue: "Price showing wrong"**
```typescript
// Solution: Always use toAPT() for display
import { toAPT } from '@/constants'

const displayPrice = toAPT(product.price) // Convert octas to APT
```

### **Issue: "Query not refetching"**
```typescript
// Solution: Invalidate queries after mutations
queryClient.invalidateQueries({ queryKey: productKeys.list() })
```

---

## 🎉 Completion

When all checkboxes are ✅:
- [ ] All components updated
- [ ] All old files removed
- [ ] All tests passing
- [ ] UI/UX polished
- [ ] Documentation complete

**Your e-commerce platform is now 100% blockchain-powered! 🚀**

---

## 📞 Need Help?

1. Check `SMART_CONTRACT_INTEGRATION.md` for API reference
2. Check `MIGRATION_EXAMPLES.tsx` for code examples
3. Check smart contract tests in `contract/tests/`
4. Check existing hooks implementation in `src/lib/hooks/`

**Remember: Your UI theme and components stay the same - only data sources changed!**
