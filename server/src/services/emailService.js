import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Base email template
const baseTemplate = (title, content, actionUrl = null, actionText = null) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                width: 50px;
                height: 50px;
                background: #22c55e;
                border-radius: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 15px;
            }
            .title {
                color: #1f2937;
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                margin: 20px 0;
                color: #4b5563;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background: #22c55e;
                color: white !important;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
            }
            .warning {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                color: #92400e;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">FD</div>
                <h1 class="title">${title}</h1>
            </div>
            
            <div class="content">
                ${content}
            </div>
            
            ${actionUrl && actionText ? `
            <div style="text-align: center;">
                <a href="${actionUrl}" class="button">${actionText}</a>
            </div>
            ` : ''}
            
            <div class="footer">
                <p>This email was sent by FarmDirect - Local Farmers' Marketplace</p>
                <p>If you didn't expect this email, you can safely ignore it.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send email verification
export const sendVerificationEmail = async (email, token, name) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.CLIENT_ORIGIN}/verify-email/${token}`;
    
    const content = `
      <p>Hello ${name},</p>
      <p>Thank you for registering with FarmDirect! To complete your account setup, please verify your email address by clicking the button below.</p>
      <p>This verification link will expire in 24 hours.</p>
      <div class="warning">
        <strong>Security Note:</strong> If you didn't create an account with FarmDirect, please ignore this email.
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify Your FarmDirect Account',
      html: baseTemplate('Verify Your Account', content, verificationUrl, 'Verify Email'),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token, name) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.CLIENT_ORIGIN}/reset-password/${token}`;
    
    const content = `
      <p>Hello ${name},</p>
      <p>We received a request to reset your FarmDirect account password. If you made this request, click the button below to reset your password.</p>
      <p>This reset link will expire in 1 hour for security purposes.</p>
      <div class="warning">
        <strong>Security Note:</strong> If you didn't request a password reset, please ignore this email or contact support if you're concerned about account security.
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset Your FarmDirect Password',
      html: baseTemplate('Reset Your Password', content, resetUrl, 'Reset Password'),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send order notification email
export const sendOrderNotificationEmail = async (email, orderData, type) => {
  try {
    const transporter = createTransporter();
    let title, content;

    switch (type) {
      case 'order_created':
        title = 'Order Confirmation';
        content = `
          <p>Hello ${orderData.buyerName},</p>
          <p>Your order #${orderData.orderNumber} has been placed successfully!</p>
          <p><strong>Order Details:</strong></p>
          <ul>
            ${orderData.items.map(item => `<li>${item.title} - ${item.quantity} ${item.unitType}</li>`).join('')}
          </ul>
          <p><strong>Total:</strong> KES ${orderData.total}</p>
          <p>The farmer has been notified and will confirm your order soon.</p>
        `;
        break;

      case 'order_confirmed':
        title = 'Order Confirmed by Farmer';
        content = `
          <p>Hello ${orderData.buyerName},</p>
          <p>Great news! Your order #${orderData.orderNumber} has been confirmed by the farmer.</p>
          <p>Expected ${orderData.fulfillmentMethod === 'delivery' ? 'delivery' : 'pickup'}: ${orderData.expectedDate}</p>
        `;
        break;

      case 'order_shipped':
        title = 'Order On The Way';
        content = `
          <p>Hello ${orderData.buyerName},</p>
          <p>Your order #${orderData.orderNumber} is now on the way!</p>
          <p>You should receive it within the estimated timeframe.</p>
        `;
        break;

      default:
        throw new Error('Invalid email type');
    }

    const orderUrl = `${process.env.CLIENT_ORIGIN}/orders/${orderData.orderId}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `FarmDirect - ${title}`,
      html: baseTemplate(title, content, orderUrl, 'View Order'),
    };

    await transporter.sendMail(mailOptions);
    console.log(`${type} email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending ${type} email:`, error);
    throw error;
  }
};

// Send farmer order notification
export const sendFarmerOrderNotificationEmail = async (email, orderData, type) => {
  try {
    const transporter = createTransporter();
    let title, content;

    switch (type) {
      case 'new_order':
        title = 'New Order Received';
        content = `
          <p>Hello ${orderData.farmerName},</p>
          <p>You have received a new order #${orderData.orderNumber}!</p>
          <p><strong>Customer:</strong> ${orderData.buyerName}</p>
          <p><strong>Order Details:</strong></p>
          <ul>
            ${orderData.items.map(item => `<li>${item.title} - ${item.quantity} ${item.unitType}</li>`).join('')}
          </ul>
          <p><strong>Total:</strong> KES ${orderData.total}</p>
          <p>Please log in to your dashboard to confirm or reject this order.</p>
        `;
        break;

      default:
        throw new Error('Invalid email type');
    }

    const orderUrl = `${process.env.CLIENT_ORIGIN}/farmer/orders/${orderData.orderId}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `FarmDirect - ${title}`,
      html: baseTemplate(title, content, orderUrl, 'View Order'),
    };

    await transporter.sendMail(mailOptions);
    console.log(`${type} email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending ${type} email:`, error);
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name, role) => {
  try {
    const transporter = createTransporter();
    
    const content = role === 'farmer' ? `
      <p>Hello ${name},</p>
      <p>Welcome to FarmDirect! We're excited to have you join our community of farmers.</p>
      <p>Here's what you can do next:</p>
      <ul>
        <li>Complete your farmer profile</li>
        <li>Add your first product listing</li>
        <li>Set up your delivery preferences</li>
        <li>Connect with local buyers</li>
      </ul>
      <p>Our platform helps you reach more customers and grow your business. If you need any help getting started, don't hesitate to contact our support team.</p>
    ` : `
      <p>Hello ${name},</p>
      <p>Welcome to FarmDirect! You can now browse fresh produce from local farmers in your area.</p>
      <p>Start exploring:</p>
      <ul>
        <li>Browse fresh produce by category</li>
        <li>Find farmers near you</li>
        <li>Place orders for pickup or delivery</li>
        <li>Connect directly with farmers</li>
      </ul>
      <p>Enjoy fresh, local produce while supporting your community farmers!</p>
    `;

    const dashboardUrl = role === 'farmer' ? 
      `${process.env.CLIENT_ORIGIN}/farmer/dashboard` : 
      `${process.env.CLIENT_ORIGIN}/browse`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Welcome to FarmDirect!',
      html: baseTemplate('Welcome to FarmDirect!', content, dashboardUrl, 'Get Started'),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};