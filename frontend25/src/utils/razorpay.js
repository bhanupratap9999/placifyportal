import { API_BASE } from '../config';

/**
 * Dynamically loads the official Razorpay Checkout SDK script
 * @returns {Promise<boolean>} Resolves to true when script is ready
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      return resolve(true);
    }
    const existingScript = document.getElementById('razorpay-checkout-sdk');
    if (existingScript) {
      existingScript.onload = () => resolve(true);
      existingScript.onerror = () => resolve(false);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay Checkout SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Initiates Razorpay payment for a course, subscription, or custom item
 * @param {Object} params
 * @param {'course'|'subscription'|'assessment'} params.itemType
 * @param {string} [params.itemId] - Course ID or Plan ID
 * @param {string} [params.planId] - Subscription plan ID
 * @param {number} [params.customAmount] - Optional custom amount
 * @param {Function} [params.onSuccess] - Callback when payment is verified
 * @param {Function} [params.onError] - Callback on error or failure
 * @param {Function} [params.onClose] - Callback when user dismisses checkout
 */
export const initiateRazorpayPayment = async ({
  itemType = 'course',
  itemId,
  planId,
  customAmount,
  notes = {},
  onSuccess,
  onError,
  onClose
}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    const errorMsg = 'Please login to proceed with payment';
    if (onError) onError(new Error(errorMsg));
    else alert(errorMsg);
    return;
  }

  try {
    // 1. Create order on backend
    const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        itemType,
        itemId,
        planId,
        customAmount,
        notes
      })
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.success) {
      throw new Error(orderData.message || 'Failed to initialize payment order');
    }

    // 2. If simulated mode (e.g. backend running without Razorpay API keys in dev),
    // provide an interactive mock confirmation or proceed with simulation
    if (orderData.isSimulated) {
      console.warn('Running in Razorpay Simulated Dev Mode');
      const confirmMock = window.confirm(
        `💳 [Razorpay Test Mode]\n\nItem: ${orderData.item.name}\nAmount: ₹${orderData.item.amount}\n\nRazorpay keys are not yet configured in backend/.env. Would you like to simulate a SUCCESSFUL payment to test full enrollment/unlocking?`
      );

      if (!confirmMock) {
        if (onClose) onClose();
        return;
      }

      // Verify the simulated payment
      const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_order_id: orderData.order.id,
          razorpay_payment_id: `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          razorpay_signature: 'simulated_signature_ok',
          paymentRecordId: orderData.paymentRecordId
        })
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        if (onSuccess) onSuccess(verifyData);
      } else {
        throw new Error(verifyData.message || 'Verification of simulated payment failed');
      }
      return;
    }

    // 3. Load official Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
    }

    // 4. Configure Razorpay checkout options
    const options = {
      key: orderData.keyId,
      amount: orderData.order.amount,
      currency: orderData.order.currency || 'INR',
      name: 'Placify Portal',
      description: orderData.item.name,
      order_id: orderData.order.id,
      prefill: {
        name: orderData.user?.name || '',
        email: orderData.user?.email || '',
        contact: orderData.user?.phone || ''
      },
      notes: {
        itemId: orderData.item?.id || '',
        itemType: orderData.item?.type || ''
      },
      theme: {
        color: '#443097' // Placify signature purple
      },
      handler: async function (response) {
        try {
          // 5. Verify payment on backend
          const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentRecordId: orderData.paymentRecordId
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            if (onSuccess) onSuccess(verifyData);
          } else {
            throw new Error(verifyData.message || 'Payment signature verification failed');
          }
        } catch (verifyErr) {
          console.error('Payment verification error:', verifyErr);
          if (onError) onError(verifyErr);
          else alert(`Payment verification failed: ${verifyErr.message}`);
        }
      },
      modal: {
        ondismiss: function () {
          console.log('Razorpay checkout window closed');
          if (onClose) onClose();
        }
      }
    };

    const rzpInstance = new window.Razorpay(options);
    rzpInstance.on('payment.failed', function (response) {
      console.error('Razorpay payment failed:', response.error);
      const errMsg = response.error?.description || 'Payment was unsuccessful or cancelled';
      if (onError) onError(new Error(errMsg));
      else alert(`Payment Failed: ${errMsg}`);
    });

    rzpInstance.open();
  } catch (error) {
    console.error('Razorpay initialization error:', error);
    if (onError) onError(error);
    else alert(error.message || 'An error occurred while launching Razorpay');
  }
};
