// Razorpay Payment Service
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  description: string;
  created_at: number;
}

export interface RazorpayConfig {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
    order_id: string;
  };
  theme: {
    color: string;
  };
  handler: (response: any) => void;
  modal: {
    ondismiss: () => void;
  };
}

class RazorpayService {
  private keyId: string;
  private keySecret: string;

  constructor() {
    this.keyId = 'rzp_test_RLB4SWduV7kkkH';
    this.keySecret = 'uInXqvJaNy3K007tsSxk3X96';
  }

  // Create Razorpay Order (Direct - No Backend)
  async createOrder(amount: number, currency: string = 'INR', receipt: string): Promise<RazorpayOrder> {
    try {
      // Create order directly without backend
      const order: RazorpayOrder = {
        id: `order_${Date.now()}`,
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt,
        status: 'created'
      };

      console.log('🔑 Razorpay Order Created:', order);
      return order;
    } catch (error) {
      console.error('❌ Error creating Razorpay order:', error);
      throw error;
    }
  }

  // Initialize Razorpay Payment
  initializePayment(config: RazorpayConfig): void {
    try {
      // Wait for Razorpay to be available
      const initRazorpay = () => {
        if ((window as any).Razorpay) {
          const razorpay = (window as any).Razorpay;
          
          // Create a simplified config without order_id for demo
          const demoConfig = {
            key: config.key,
            amount: config.amount,
            currency: config.currency,
            name: config.name,
            description: config.description,
            prefill: config.prefill,
            notes: config.notes,
            theme: config.theme,
            handler: config.handler,
            modal: config.modal
          };
          
          const razorpayInstance = new razorpay(demoConfig);
          razorpayInstance.open();
        } else {
          console.error('❌ Razorpay not available');
        }
      };

      // Check if Razorpay is already loaded
      if ((window as any).Razorpay) {
        initRazorpay();
      } else {
        // Wait for script to load
        const checkRazorpay = setInterval(() => {
          if ((window as any).Razorpay) {
            clearInterval(checkRazorpay);
            initRazorpay();
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkRazorpay);
          console.error('❌ Razorpay loading timeout');
        }, 10000);
      }
    } catch (error) {
      console.error('❌ Error initializing Razorpay:', error);
      throw error;
    }
  }

  // Verify Payment (Direct - No Backend)
  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      // For demo purposes, always return true
      // In production, you would verify the signature
      console.log('✅ Payment verified successfully (Demo Mode)');
      return true;
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      return false;
    }
  }

  // Get Payment Details
  async getPaymentDetails(paymentId: string): Promise<RazorpayPayment | null> {
    try {
      // In a real application, this would be a backend API call
      // For now, we'll simulate payment details
      const mockPayment: RazorpayPayment = {
        id: paymentId,
        amount: 1000,
        currency: 'INR',
        status: 'captured',
        order_id: `order_${Date.now()}`,
        method: 'card',
        description: 'Crop Purchase',
        created_at: Date.now()
      };

      return mockPayment;
    } catch (error) {
      console.error('❌ Error getting payment details:', error);
      return null;
    }
  }

  // Get Key ID
  getKeyId(): string {
    return this.keyId;
  }

  // Create Payment Link for UPI/QR Code (Direct - No Backend)
  async createPaymentLink(amount: number, currency: string = 'INR', receipt: string): Promise<any> {
    try {
      // Create payment link directly without backend
      const paymentLink = {
        id: `plink_${Date.now()}`,
        short_url: `https://rzp.io/i/${receipt}`,
        amount: Math.round(amount * 100),
        currency,
        description: `Payment for ${receipt}`,
        status: 'created'
      };

      console.log('🔗 Payment Link Created:', paymentLink);
      return paymentLink;
    } catch (error) {
      console.error('❌ Error creating payment link:', error);
      throw error;
    }
  }
}

export default new RazorpayService();
