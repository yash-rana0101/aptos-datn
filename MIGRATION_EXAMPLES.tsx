/**
 * @fileoverview Migration Examples - Web2 to Web3
 * @description Side-by-side examples showing how to update your components
 */

// ============================================================
// EXAMPLE 1: Product Listing Page
// ============================================================

// ❌ BEFORE (Web2 API)
/*
import { useProducts } from '@/lib/hooks/useProductQuery'
import { productService } from '@/lib/services/product'

function ProductsPage() {
  const { data: products, isLoading } = useProducts()
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
*/

// ✅ AFTER (Web3 Blockchain)
/*
import { useSellerProducts, useProduct } from '@/lib/hooks/useProductContract'
import { toAPT } from '@/constants'

function ProductsPage() {
  const sellerAddress = '0x...' // Get from context or props
  const { data: productAddresses, isLoading } = useSellerProducts(sellerAddress)
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {productAddresses?.map(address => (
        <ProductCard key={address} address={address} />
      ))}
    </div>
  )
}

function ProductCard({ address }: { address: string }) {
  const { data: product } = useProduct(address)
  
  if (!product) return null
  
  return (
    <div>
      <h3>{product.title}</h3>
      <p>{toAPT(product.price)} APT</p>
    </div>
  )
}
*/

// ============================================================
// EXAMPLE 2: Create Product Form
// ============================================================

// ❌ BEFORE (Web2 API)
/*
import { useCreateProduct } from '@/lib/hooks/useProductQuery'

function CreateProductForm() {
  const { mutate: createProduct, isPending } = useCreateProduct()
  
  const onSubmit = (data: FormData) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('price', data.price)
    formData.append('description', data.description)
    
    createProduct(formData)
  }
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
*/

// ✅ AFTER (Web3 Blockchain)
/*
import { useCreateProduct } from '@/lib/hooks/useProductContract'
import { toOctas } from '@/constants'

function CreateProductForm() {
  const { mutate: createProduct, isPending } = useCreateProduct()
  
  const onSubmit = (data: FormData) => {
    createProduct({
      title: data.name,
      description: data.description,
      price: toOctas(parseFloat(data.price)), // Convert APT to octas
      quantity: parseInt(data.quantity),
      imageUrls: data.images.split(','), // Array of URLs
      category: data.category,
    })
  }
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
*/

// ============================================================
// EXAMPLE 3: User Registration
// ============================================================

// ❌ BEFORE (Web2 API)
/*
import { useRegister } from '@/lib/hooks/useAuthQuery'

function RegistrationForm() {
  const { mutate: register, isPending } = useRegister()
  
  const onSubmit = (data) => {
    register({
      wallet: walletAddress,
      name: data.name,
      email: data.email,
      role: data.isSeller ? 'seller' : 'buyer',
    })
  }
  
  return <form>...</form>
}
*/

// ✅ AFTER (Web3 Blockchain)
/*
import { useRegisterProfile } from '@/lib/hooks/useProfileContract'
import { USER_ROLES } from '@/constants'

function RegistrationForm() {
  const { mutate: register, isPending } = useRegisterProfile()
  
  const onSubmit = (data) => {
    register({
      name: data.name,
      country: data.country,
      role: data.isSeller ? USER_ROLES.SELLER : USER_ROLES.BUYER,
      email: data.email,
      address: data.physicalAddress,
      bio: data.bio || '',
    })
  }
  
  return <form>...</form>
}
*/

// ============================================================
// EXAMPLE 4: Order Placement
// ============================================================

// ❌ BEFORE (Web2 API)
/*
function BuyButton({ productId }) {
  const [createOrder] = useMutation(createOrderAPI)
  
  const handleBuy = async () => {
    await createOrder({
      productId: productId,
      quantity: 1,
    })
  }
  
  return <Button onClick={handleBuy}>Buy Now</Button>
}
*/

// ✅ AFTER (Web3 Blockchain)
/*
import { usePlaceOrder } from '@/lib/hooks/useOrderContract'

function BuyButton({ productAddress }) {
  const { mutate: placeOrder, isPending } = usePlaceOrder()
  
  const handleBuy = () => {
    placeOrder({
      productAddress: productAddress,
      quantity: 1,
      shippingAddress: userProfile.physicalAddress,
      notes: 'Please deliver before 5 PM',
    })
  }
  
  return (
    <Button onClick={handleBuy} disabled={isPending}>
      {isPending ? 'Processing...' : 'Buy Now'}
    </Button>
  )
}
*/

// ============================================================
// EXAMPLE 5: Escrow Flow - Complete Implementation
// ============================================================

// ✅ NEW (Web3 Blockchain - Escrow Feature)

// Step 1: Buyer initiates trade
/*
import { useInitiateTrade } from '@/lib/hooks/useEscrowContract'

function CheckoutPage({ product, shippingAddress }) {
  const { mutate: initiateTrade, isPending } = useInitiateTrade()
  
  const handleCheckout = () => {
    initiateTrade({
      productAddress: product.productAddress,
      quantity: 1,
      shippingAddress: shippingAddress,
      transactionHash: `${Date.now()}-${Math.random()}`, // Optional reference
    })
  }
  
  return (
    <Button onClick={handleCheckout} disabled={isPending}>
      {isPending ? 'Locking Funds...' : `Checkout (${toAPT(product.price)} APT)`}
    </Button>
  )
}
*/

// Step 2: Seller marks as delivered
/*
import { useDeliverOrder, useDeliveryCode } from '@/lib/hooks/useEscrowContract'

function SellerOrderCard({ escrowOrderAddress }) {
  const { data: deliveryCode } = useDeliveryCode(escrowOrderAddress)
  const { mutate: deliverOrder, isPending } = useDeliverOrder()
  
  const handleDeliver = () => {
    deliverOrder({
      escrowOrderAddress: escrowOrderAddress,
      deliveryCode: deliveryCode!, // 6-digit code
    })
  }
  
  return (
    <Card>
      <div className="bg-blue-50 p-4 rounded">
        <p className="text-sm text-gray-600">Delivery Code (Share with buyer)</p>
        <p className="text-2xl font-mono font-bold">{deliveryCode}</p>
      </div>
      <Button onClick={handleDeliver} disabled={isPending}>
        Mark as Delivered
      </Button>
    </Card>
  )
}
*/

// Step 3: Buyer confirms delivery
/*
import { useConfirmDelivery, useReceivingCode } from '@/lib/hooks/useEscrowContract'

function BuyerOrderCard({ escrowOrderAddress }) {
  const { data: receivingCode } = useReceivingCode(escrowOrderAddress)
  const { mutate: confirmDelivery, isPending } = useConfirmDelivery()
  
  const handleConfirm = () => {
    confirmDelivery({
      escrowOrderAddress: escrowOrderAddress,
      receivingCode: receivingCode!, // 4-digit code
    })
  }
  
  return (
    <Card>
      <div className="bg-green-50 p-4 rounded">
        <p className="text-sm text-gray-600">Receiving Code (Confirm with this)</p>
        <p className="text-2xl font-mono font-bold">{receivingCode}</p>
      </div>
      <Button onClick={handleConfirm} disabled={isPending}>
        Confirm Delivery & Release Funds
      </Button>
    </Card>
  )
}
*/

// ============================================================
// EXAMPLE 6: Displaying User Profile
// ============================================================

// ❌ BEFORE (Web2 API)
/*
import { useCurrentUser } from '@/lib/hooks/useAuthQuery'

function ProfilePage() {
  const { data: user } = useCurrentUser()
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
      <Badge>{user?.role}</Badge>
    </div>
  )
}
*/

// ✅ AFTER (Web3 Blockchain)
/*
import { useUserProfile, useIsSeller } from '@/lib/hooks/useProfileContract'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { USER_ROLES } from '@/constants'

function ProfilePage() {
  const { account } = useWallet()
  const { data: profile } = useUserProfile(account?.address?.toString())
  const { data: isSeller } = useIsSeller()
  
  return (
    <div>
      <h1>{profile?.name}</h1>
      <p>{profile?.email}</p>
      <Badge>{isSeller ? 'Seller' : 'Buyer'}</Badge>
      <p className="text-sm text-gray-500">{profile?.country}</p>
    </div>
  )
}
*/

// ============================================================
// EXAMPLE 7: Order Status Badge
// ============================================================

// ✅ NEW (Web3 Blockchain)
/*
import { useOrderStatus } from '@/lib/hooks/useOrderContract'
import { ORDER_STATUS } from '@/constants'

function OrderStatusBadge({ orderAddress }: { orderAddress: string }) {
  const { data: status } = useOrderStatus(orderAddress)
  
  const getStatusInfo = (status: number) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return { label: 'Pending', color: 'yellow' }
      case ORDER_STATUS.CONFIRMED:
        return { label: 'Confirmed', color: 'blue' }
      case ORDER_STATUS.PROCESSING:
        return { label: 'Processing', color: 'purple' }
      case ORDER_STATUS.SHIPPED:
        return { label: 'Shipped', color: 'indigo' }
      case ORDER_STATUS.DELIVERED:
        return { label: 'Delivered', color: 'green' }
      case ORDER_STATUS.CANCELLED:
        return { label: 'Cancelled', color: 'red' }
      case ORDER_STATUS.REFUNDED:
        return { label: 'Refunded', color: 'gray' }
      default:
        return { label: 'Unknown', color: 'gray' }
    }
  }
  
  const info = getStatusInfo(status || 0)
  
  return (
    <Badge variant={info.color}>
      {info.label}
    </Badge>
  )
}
*/

// ============================================================
// EXAMPLE 8: Price Display with Conversion
// ============================================================

// ✅ NEW (Web3 Blockchain)
/*
import { toAPT } from '@/constants'

function PriceDisplay({ priceInOctas }: { priceInOctas: number }) {
  const aptAmount = toAPT(priceInOctas)
  
  return (
    <div>
      <span className="text-2xl font-bold">{aptAmount.toFixed(2)} APT</span>
      <span className="text-sm text-gray-500 ml-2">
        ({priceInOctas.toLocaleString()} octas)
      </span>
    </div>
  )
}
*/

// ============================================================
// EXAMPLE 9: Seller Dashboard with Multiple Products
// ============================================================

// ✅ NEW (Web3 Blockchain)
/*
import { useSellerProducts, useProduct } from '@/lib/hooks/useProductContract'
import { useWallet } from '@aptos-labs/wallet-adapter-react'

function SellerDashboard() {
  const { account } = useWallet()
  const { data: productAddresses, isLoading } = useSellerProducts(
    account?.address?.toString()
  )
  
  if (isLoading) return <Skeleton count={3} />
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productAddresses?.map(address => (
        <ProductManagementCard key={address} productAddress={address} />
      ))}
    </div>
  )
}

function ProductManagementCard({ productAddress }: { productAddress: string }) {
  const { data: product } = useProduct(productAddress)
  const { mutate: setAvailability } = useSetProductAvailability()
  const { mutate: deleteProduct } = useDeleteProduct()
  
  if (!product) return null
  
  return (
    <Card>
      <img src={product.imageUrls[0]} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{toAPT(product.price)} APT</p>
      <p>Stock: {product.quantity - product.soldQuantity}</p>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setAvailability({
            productAddress,
            isAvailable: !product.isAvailable
          })}
        >
          {product.isAvailable ? 'Disable' : 'Enable'}
        </Button>
        
        <Button
          variant="destructive"
          onClick={() => deleteProduct(productAddress)}
        >
          Delete
        </Button>
      </div>
    </Card>
  )
}
*/

// ============================================================
// EXAMPLE 10: Buyer Orders Page
// ============================================================

// ✅ NEW (Web3 Blockchain)
/*
import { useBuyerOrders, useOrder } from '@/lib/hooks/useOrderContract'
import { useWallet } from '@aptos-labs/wallet-adapter-react'

function BuyerOrdersPage() {
  const { account } = useWallet()
  const { data: orderAddresses, isLoading } = useBuyerOrders(
    account?.address?.toString()
  )
  
  if (isLoading) return <div>Loading orders...</div>
  if (!orderAddresses?.length) return <div>No orders yet</div>
  
  return (
    <div className="space-y-4">
      {orderAddresses.map(address => (
        <OrderCard key={address} orderAddress={address} />
      ))}
    </div>
  )
}

function OrderCard({ orderAddress }: { orderAddress: string }) {
  const { data: order } = useOrder(orderAddress)
  const { data: product } = useProduct(order?.productAddress || '')
  
  if (!order || !product) return null
  
  return (
    <Card>
      <div className="flex justify-between">
        <div>
          <h3>{product.title}</h3>
          <p>Quantity: {order.quantity}</p>
          <p>Total: {toAPT(order.totalPrice)} APT</p>
        </div>
        <OrderStatusBadge orderAddress={orderAddress} />
      </div>
      <p className="text-sm text-gray-500">
        Ordered: {new Date(order.createdAt * 1000).toLocaleDateString()}
      </p>
    </Card>
  )
}
*/

// ============================================================
// KEY DIFFERENCES SUMMARY
// ============================================================

/*
1. DATA FETCHING:
   - Old: REST API endpoints (useQuery with apiClient)
   - New: Smart contract view functions (useQuery with aptos.view)

2. DATA MUTATIONS:
   - Old: HTTP POST/PUT/DELETE (useMutation with apiClient)
   - New: Blockchain transactions (useMutation with signAndSubmitTransaction)

3. DATA TYPES:
   - Old: Database IDs (string UUIDs)
   - New: Blockchain addresses (0x... addresses)

4. PRICES:
   - Old: Decimal numbers (1.5)
   - New: Integers in octas (150000000)
   - Use: toOctas() and toAPT() for conversion

5. RELATIONSHIPS:
   - Old: Foreign keys (productId, userId)
   - New: Addresses (productAddress, userAddress)

6. AUTHENTICATION:
   - Old: JWT tokens / cookies
   - New: Wallet connection (account?.address)

7. AUTHORIZATION:
   - Old: Server-side role checks
   - New: Smart contract role checks (isBuyer, isSeller)

8. LOADING STATES:
   - Same: Use isPending, isLoading from React Query

9. ERROR HANDLING:
   - Same: Use isError, error from React Query
   - New: Blockchain-specific errors (gas, insufficient funds, etc.)

10. CACHING:
    - Same: React Query handles caching
    - New: Query keys use addresses instead of IDs
*/

export { }
