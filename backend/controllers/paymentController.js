const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Helper to get Razorpay instance
const getRazorpayInstance = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret || keyId === 'rzp_test_placeholder') {
        return null;
    }
    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret
    });
};

// Helper to parse price string to number in Rupees (e.g. "₹499", "499", "$10", "Free")
const parsePriceToINR = (priceStr) => {
    if (!priceStr) return 0;
    if (typeof priceStr === 'number') return Math.max(0, priceStr);
    const cleaned = priceStr.toString().trim();
    if (cleaned.toLowerCase() === 'free') return 0;
    // Extract first number (integer or float)
    const match = cleaned.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
    if (!match) return 0;
    const val = parseFloat(match[1]);
    return isNaN(val) ? 0 : val;
};

// @desc    Get Razorpay public configuration
// @route   GET /api/payment/config
// @access  Public
exports.getPaymentConfig = async (req, res) => {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET);
    const isConfigured = Boolean(keyId && hasSecret && keyId !== 'rzp_test_placeholder');
    const isTestMode = keyId.startsWith('rzp_test_');

    res.json({
        success: true,
        keyId: isConfigured ? keyId : (keyId || 'rzp_test_placify_demo'),
        isConfigured,
        isTestMode,
        currency: 'INR'
    });
};

// @desc    Create a new Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { itemType = 'course', itemId, planId, customAmount, notes = {} } = req.body;
        const userId = req.user._id;

        let amountInRupees = 0;
        let itemName = 'Placify Item';
        let resolvedItemId = itemId || planId || null;

        if (itemType === 'course') {
            if (!itemId) {
                return res.status(400).json({ success: false, message: 'Course ID is required' });
            }
            const course = await Course.findById(itemId);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Course not found' });
            }

            // Check if student already enrolled
            const isAlreadyEnrolled = (course.enrolledStudents || []).some(
                id => id.toString() === userId.toString()
            );
            if (isAlreadyEnrolled) {
                return res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
            }

            amountInRupees = parsePriceToINR(course.price);
            if (amountInRupees <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'This course is free. Please enroll directly without payment.'
                });
            }
            itemName = course.name || 'Placify Course';
        } else if (itemType === 'subscription') {
            // Subscription / Pro packages
            const SUBSCRIPTION_PLANS = {
                'pro_monthly': { name: 'Placify Pro - 1 Month', price: 499 },
                'pro_quarterly': { name: 'Placify Pro - 3 Months', price: 1199 },
                'pro_annual': { name: 'Placify Pro - 1 Year', price: 2499 },
                'pro_pass': { name: 'Placify Placement Accelerator Pass', price: 999 }
            };

            const selectedPlan = SUBSCRIPTION_PLANS[planId] || {
                name: 'Placify Pro Subscription',
                price: parsePriceToINR(customAmount) || 499
            };

            amountInRupees = selectedPlan.price;
            itemName = selectedPlan.name;
            resolvedItemId = planId || 'pro_pass';
        } else {
            // Custom or assessment fee
            amountInRupees = parsePriceToINR(customAmount);
            if (amountInRupees <= 0) {
                return res.status(400).json({ success: false, message: 'Valid amount is required' });
            }
            itemName = req.body.itemName || 'Placify Service';
        }

        const amountInPaise = Math.round(amountInRupees * 100);
        const receipt = `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

        const razorpay = getRazorpayInstance();
        let razorpayOrder;
        let isSimulated = false;

        if (razorpay) {
            try {
                razorpayOrder = await razorpay.orders.create({
                    amount: amountInPaise,
                    currency: 'INR',
                    receipt: receipt,
                    notes: {
                        userId: userId.toString(),
                        itemType,
                        itemId: resolvedItemId || '',
                        itemName,
                        ...notes
                    }
                });
            } catch (rzpErr) {
                console.error('Razorpay SDK order creation error:', rzpErr);
                return res.status(502).json({
                    success: false,
                    message: 'Razorpay service error: ' + (rzpErr.error?.description || rzpErr.message)
                });
            }
        } else {
            // Simulated order for development/testing when keys are not yet configured in .env
            isSimulated = true;
            console.warn('⚠️ Razorpay keys not provided or set to placeholder. Generating simulated order for development testing.');
            razorpayOrder = {
                id: `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
                amount: amountInPaise,
                currency: 'INR',
                receipt: receipt,
                status: 'created'
            };
        }

        // Save pending payment record in DB
        const paymentRecord = await Payment.create({
            userId,
            userEmail: req.user.email,
            userName: req.user.profile?.fullName || req.user.username,
            orderId: razorpayOrder.id,
            amount: amountInRupees,
            amountInPaise: amountInPaise,
            currency: 'INR',
            status: 'created',
            itemType,
            itemId: resolvedItemId,
            itemName,
            receipt,
            notes: {
                ...notes,
                isSimulated: isSimulated ? 'true' : 'false'
            }
        });

        res.status(201).json({
            success: true,
            order: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                receipt: razorpayOrder.receipt
            },
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placify_demo',
            item: {
                type: itemType,
                id: resolvedItemId,
                name: itemName,
                amount: amountInRupees
            },
            paymentRecordId: paymentRecord._id,
            isSimulated,
            user: {
                name: req.user.profile?.fullName || req.user.username,
                email: req.user.email,
                phone: req.user.profile?.phone || ''
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, message: 'Failed to create payment order', error: error.message });
    }
};

// @desc    Verify Razorpay Payment Signature and Grant Access
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentRecordId
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id) {
            return res.status(400).json({ success: false, message: 'Missing order ID or payment ID' });
        }

        // Find payment record
        let payment = null;
        if (paymentRecordId) {
            payment = await Payment.findById(paymentRecordId);
        }
        if (!payment) {
            payment = await Payment.findOne({ orderId: razorpay_order_id });
        }

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment record not found for this order' });
        }

        // Already captured check (idempotency)
        if (payment.status === 'captured') {
            return res.json({
                success: true,
                message: 'Payment was already verified and captured',
                payment
            });
        }

        const isSimulated = payment.notes?.get('isSimulated') === 'true' || razorpay_order_id.startsWith('order_sim_');
        const secret = process.env.RAZORPAY_KEY_SECRET;

        // Signature verification
        if (!isSimulated && secret && secret !== 'your_razorpay_secret_key') {
            if (!razorpay_signature) {
                payment.status = 'failed';
                payment.failureReason = 'Signature missing';
                await payment.save();
                return res.status(400).json({ success: false, message: 'Razorpay signature is missing' });
            }

            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                payment.status = 'failed';
                payment.failureReason = 'Invalid signature mismatch';
                await payment.save();
                return res.status(400).json({ success: false, message: 'Payment verification failed: signature mismatch' });
            }
        }

        // Mark payment as captured
        payment.status = 'captured';
        payment.paymentId = razorpay_payment_id;
        payment.signature = razorpay_signature || 'simulated_signature';
        await payment.save();

        const userId = payment.userId;
        const studentUser = await User.findById(userId);

        // Fulfill purchase according to itemType
        let fulfillmentDetails = {};

        if (payment.itemType === 'course' && payment.itemId) {
            const course = await Course.findById(payment.itemId);
            if (course) {
                const alreadyInCourse = (course.enrolledStudents || []).some(
                    id => id.toString() === userId.toString()
                );
                if (!alreadyInCourse) {
                    course.enrolledStudents = [...(course.enrolledStudents || []), userId];
                    await course.save();
                }

                // Notify student
                await Notification.create({
                    recipientId: userId,
                    type: 'course_enrollment',
                    title: '🎓 Course Enrollment Confirmed!',
                    message: `Payment of ₹${payment.amount} successful! You now have lifetime access to "${course.name}".`,
                    relatedCourse: course._id,
                    relatedPayment: payment._id,
                    read: false
                });

                // Notify company coordinator if course is company-owned
                if (course.companyId) {
                    await Notification.create({
                        recipientId: course.companyId,
                        type: 'payment',
                        title: '💰 Course Enrollment & Payment Received',
                        message: `A student (${payment.userName || payment.userEmail}) enrolled in "${course.name}" (₹${payment.amount}).`,
                        relatedCourse: course._id,
                        relatedPayment: payment._id,
                        relatedStudent: userId,
                        read: false
                    });
                }

                fulfillmentDetails = {
                    courseId: course._id,
                    courseName: course.name,
                    enrolled: true
                };
            }
        } else if (payment.itemType === 'subscription') {
            // Activate Pro Subscription
            if (studentUser) {
                studentUser.isProMember = true;
                studentUser.proPlan = payment.itemName;
                const validityDays = payment.itemName.includes('1 Year') ? 365 : (payment.itemName.includes('3 Months') ? 90 : 30);
                studentUser.proSubscriptionExpiresAt = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000);
                await studentUser.save();

                await Notification.create({
                    recipientId: userId,
                    type: 'payment',
                    title: '⭐ Welcome to Placify Pro!',
                    message: `Your payment of ₹${payment.amount} was confirmed. Pro features and priority matching are now active on your account!`,
                    relatedPayment: payment._id,
                    read: false
                });

                fulfillmentDetails = {
                    isProMember: true,
                    plan: payment.itemName,
                    expiresAt: studentUser.proSubscriptionExpiresAt
                };
            }
        }

        // Notify client via Socket.io if active
        try {
            const io = req.app.get('io');
            const connectedUsers = req.app.get('connectedUsers');
            if (io && connectedUsers) {
                const socketId = connectedUsers.get(userId.toString());
                if (socketId) {
                    io.to(socketId).emit('paymentSuccess', {
                        paymentId: payment._id,
                        orderId: payment.orderId,
                        amount: payment.amount,
                        itemName: payment.itemName,
                        fulfillment: fulfillmentDetails
                    });
                }
            }
        } catch (socketErr) {
            console.error('Socket emission error:', socketErr);
        }

        res.json({
            success: true,
            message: 'Payment verified and access unlocked successfully!',
            payment: {
                id: payment._id,
                orderId: payment.orderId,
                paymentId: payment.paymentId,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                itemName: payment.itemName,
                receipt: payment.receipt,
                createdAt: payment.createdAt
            },
            fulfillment: fulfillmentDetails
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ success: false, message: 'Error verifying payment', error: error.message });
    }
};

// @desc    Get user's personal payment history
// @route   GET /api/payment/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const payments = await Payment.find({ userId })
            .sort({ createdAt: -1 })
            .select('-signature -failureReason');

        res.json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payment history', error: error.message });
    }
};

// @desc    Get all transactions (Admin / Company Coordinator overview)
// @route   GET /api/payment/all
// @access  Private
exports.getAllPayments = async (req, res) => {
    try {
        const query = {};
        // If company user, filter payments for courses belonging to this company
        if (req.user.userType === 'company') {
            const companyCourses = await Course.find({ companyId: req.user._id }).select('_id');
            const courseIds = companyCourses.map(c => c._id.toString());
            query.itemId = { $in: courseIds };
            query.itemType = 'course';
        }

        const payments = await Payment.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'username email profile.fullName');

        const totalRevenue = payments
            .filter(p => p.status === 'captured')
            .reduce((sum, p) => sum + (p.amount || 0), 0);

        res.json({
            success: true,
            totalRevenue,
            count: payments.length,
            payments
        });
    } catch (error) {
        console.error('Get all payments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
    }
};

// @desc    Razorpay Webhook Handler
// @route   POST /api/payment/webhook
// @access  Public (Signature-verified)
exports.handleWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature'];

        if (webhookSecret && signature) {
            const expectedSig = crypto
                .createHmac('sha256', webhookSecret)
                .update(JSON.stringify(req.body))
                .digest('hex');

            if (expectedSig !== signature) {
                console.warn('⚠️ Razorpay webhook signature verification failed');
                return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
            }
        }

        const event = req.body.event;
        const payload = req.body.payload;

        console.log(`🔔 Razorpay Webhook Event Received: ${event}`);

        if (event === 'payment.captured' && payload?.payment?.entity) {
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.order_id;
            const paymentId = paymentEntity.id;

            const existingPayment = await Payment.findOne({ orderId });
            if (existingPayment && existingPayment.status !== 'captured') {
                existingPayment.status = 'captured';
                existingPayment.paymentId = paymentId;
                await existingPayment.save();

                // Auto-fulfill course enrollment if course
                if (existingPayment.itemType === 'course' && existingPayment.itemId) {
                    const course = await Course.findById(existingPayment.itemId);
                    if (course) {
                        const enrolled = (course.enrolledStudents || []).some(
                            id => id.toString() === existingPayment.userId.toString()
                        );
                        if (!enrolled) {
                            course.enrolledStudents.push(existingPayment.userId);
                            await course.save();
                        }
                    }
                }
            }
        } else if (event === 'payment.failed' && payload?.payment?.entity) {
            const paymentEntity = payload.payment.entity;
            const orderId = paymentEntity.order_id;
            const payment = await Payment.findOne({ orderId });
            if (payment) {
                payment.status = 'failed';
                payment.failureReason = paymentEntity.error_description || 'Payment failed';
                await payment.save();
            }
        }

        res.json({ status: 'ok' });
    } catch (err) {
        console.error('Webhook processing error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};
