import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, User, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PaystackCheckout from '../components/PaystackCheckout';
import { supabase } from '../lib/supabase';
import { nigerianStates } from '../data/nigerianStates';

const CartPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const { state: authState } = useAuth();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  const [customerInfo, setCustomerInfo] = useState({
    fullName: authState.user?.full_name || '',
    email: authState.user?.email || '',
    phone: authState.user?.phone || '',
  });
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const shippingCost = state.total >= 15000 ? 0 : 1500;
  const taxAmount = state.total * 0.075;
  const finalTotal = state.total + shippingCost + taxAmount;

  const validateCustomerInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!customerInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone number is required';

    if (!shippingAddress.address.trim()) newErrors.address = 'Street address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state) newErrors.state = 'Please select a state';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContinueToPayment = () => {
    if (validateCustomerInfo()) {
      setCheckoutStep('payment');
    }
  };

  const createOrder = async (paymentReference: string) => {
    try {
      setIsProcessing(true);

      let userId = authState.user?.id;

      if (!userId) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', customerInfo.email)
          .maybeSingle();

        if (existingUser) {
          userId = existingUser.id;
        } else {
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
              email: customerInfo.email,
              full_name: customerInfo.fullName,
              phone: customerInfo.phone,
            })
            .select()
            .single();

          if (userError) throw userError;
          userId = newUser.id;
        }
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: finalTotal,
          status: 'pending',
          payment_reference: paymentReference,
          shipping_address: {
            fullName: customerInfo.fullName,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
          },
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = state.items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      dispatch({ type: 'CLEAR_CART' });

      alert(`Order placed successfully! Your order ID is: ${order.id.slice(0, 8)}`);
      navigate('/');
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(`Error creating order: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaystackSuccess = (reference: string) => {
    createOrder(reference);
  };

  const handlePaystackClose = () => {
    console.log('Payment closed');
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Discover our amazing skincare products</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => {
              if (checkoutStep !== 'cart') {
                setCheckoutStep(checkoutStep === 'payment' ? 'shipping' : 'cart');
              } else {
                navigate(-1);
              }
            }}
            className="flex items-center text-gray-600 hover:text-[#0d0499] transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {checkoutStep === 'cart' ? 'Continue Shopping' : 'Back'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {checkoutStep === 'cart' && 'Shopping Cart'}
            {checkoutStep === 'shipping' && 'Shipping Information'}
            {checkoutStep === 'payment' && 'Payment'}
          </h1>
          <div className="flex items-center mt-2 space-x-4">
            <div className={`flex items-center ${checkoutStep === 'cart' ? 'text-[#0d0499]' : 'text-gray-400'}`}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              <span className="text-sm">Cart</span>
            </div>
            <div className="h-px w-8 bg-gray-300"></div>
            <div className={`flex items-center ${checkoutStep === 'shipping' ? 'text-[#0d0499]' : 'text-gray-400'}`}>
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">Shipping</span>
            </div>
            <div className="h-px w-8 bg-gray-300"></div>
            <div className={`flex items-center ${checkoutStep === 'payment' ? 'text-[#0d0499]' : 'text-gray-400'}`}>
              <CreditCard className="h-4 w-4 mr-1" />
              <span className="text-sm">Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {checkoutStep === 'cart' && (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.picture}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">{item.product.brand}</p>
                        <p className="text-lg font-bold text-[#0d0499] mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {item.quantity} × {formatPrice(item.product.price)}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {checkoutStep === 'shipping' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={customerInfo.fullName}
                      onChange={handleCustomerInfoChange}
                      className={`block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d0499] ${
                        errors.fullName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleCustomerInfoChange}
                        className={`block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d0499] ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleCustomerInfoChange}
                        className={`block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d0499] ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="+234 XXX XXX XXXX"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleShippingChange}
                      className={`block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d0499] ${
                        errors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        className={`block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d0499] ${
                          errors.city ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Lagos"
                      />
                      {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleShippingChange}
                        className={`block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d0499] ${
                          errors.state ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select State</option>
                        {nigerianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleShippingChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d0499]"
                        placeholder="100001"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleContinueToPayment}
                  className="w-full mt-6 bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Shipping to:</h3>
                  <p className="text-sm text-gray-600">{customerInfo.fullName}</p>
                  <p className="text-sm text-gray-600">{shippingAddress.address}</p>
                  <p className="text-sm text-gray-600">
                    {shippingAddress.city}, {shippingAddress.state}
                    {shippingAddress.postalCode && ` ${shippingAddress.postalCode}`}
                  </p>
                  <p className="text-sm text-gray-600">{customerInfo.phone}</p>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-[#0d0499] rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <CreditCard className="h-5 w-5 text-[#0d0499] mr-2" />
                      <span className="font-medium">Pay with Paystack</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Secure payment via card, bank transfer, or USSD
                    </p>
                    <PaystackCheckout
                      amount={finalTotal}
                      email={customerInfo.email}
                      onSuccess={handlePaystackSuccess}
                      onClose={handlePaystackClose}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({state.itemCount} items)</span>
                  <span className="font-medium">{formatPrice(state.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7.5%)</span>
                  <span className="font-medium">{formatPrice(taxAmount)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-[#0d0499]">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {state.total < 15000 && (
                <div className="bg-[#c6f2f4] rounded-lg p-3 mb-4">
                  <p className="text-sm text-[#0d0499]">
                    Add {formatPrice(15000 - state.total)} more to get free shipping!
                  </p>
                </div>
              )}

              {checkoutStep === 'cart' && (
                <div className="space-y-3">
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className="w-full bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate('/products')}
                    className="w-full border border-[#0d0499] text-[#0d0499] px-6 py-3 rounded-lg font-semibold hover:bg-[#0d0499] hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Secure checkout
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  30-day return policy
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Free shipping over ₦15,000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
