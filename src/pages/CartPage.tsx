import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PaystackCheckout from '../components/PaystackCheckout';

const CartPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState<'paystack' | 'stripe'>('paystack');
  const [customerEmail, setCustomerEmail] = useState(authState.user?.email || '');

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

  const handlePaystackSuccess = (reference: string) => {
    console.log('Payment successful:', reference);
    dispatch({ type: 'CLEAR_CART' });
    alert(`Payment successful! Reference: ${reference}`);
    navigate('/');
  };

  const handlePaystackClose = () => {
    console.log('Payment closed');
  };

  const handleStripeCheckout = () => {
    alert('Stripe checkout will be implemented here. Contact support for Stripe integration.');
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
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-[#0d0499] transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">{state.itemCount} items in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
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
                    <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
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

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
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

              {!showCheckout ? (
                <>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate('/products')}
                    className="w-full border border-[#0d0499] text-[#0d0499] px-6 py-3 rounded-lg font-semibold hover:bg-[#0d0499] hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d0499] focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Payment Method
                    </label>

                    <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#0d0499] transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="paystack"
                        checked={paymentGateway === 'paystack'}
                        onChange={() => setPaymentGateway('paystack')}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Paystack</div>
                        <div className="text-sm text-gray-500">Pay with card, bank transfer, or USSD</div>
                      </div>
                      <img src="https://paystack.com/assets/img/logo/logo.svg" alt="Paystack" className="h-6" />
                    </label>

                    <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#0d0499] transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="stripe"
                        checked={paymentGateway === 'stripe'}
                        onChange={() => setPaymentGateway('stripe')}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Stripe</div>
                        <div className="text-sm text-gray-500">International card payments</div>
                      </div>
                    </label>
                  </div>

                  {paymentGateway === 'paystack' && customerEmail && (
                    <PaystackCheckout
                      amount={finalTotal}
                      email={customerEmail}
                      onSuccess={handlePaystackSuccess}
                      onClose={handlePaystackClose}
                    />
                  )}

                  {paymentGateway === 'stripe' && (
                    <button
                      onClick={handleStripeCheckout}
                      className="w-full bg-[#635bff] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                    >
                      Pay with Stripe
                    </button>
                  )}

                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back to Cart
                  </button>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Secure checkout
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  30-day return policy
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
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
