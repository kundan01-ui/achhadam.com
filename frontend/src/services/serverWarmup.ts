/**
 * Server Warmup Service
 *
 * Render free tier spins down servers after 15 minutes of inactivity.
 * This service pre-warms the backend before users try to login,
 * preventing timeout errors and improving user experience.
 */

const API_BASE_URL = 'https://acchadam1-backend.onrender.com';

interface WarmupStatus {
  isWarming: boolean;
  isReady: boolean;
  lastWarmup: number | null;
  attempts: number;
}

class ServerWarmupService {
  private status: WarmupStatus = {
    isWarming: false,
    isReady: false,
    lastWarmup: null,
    attempts: 0
  };

  /**
   * Pre-warm the backend server with health check
   * Returns immediately but continues warming in background
   */
  async warmupServer(): Promise<void> {
    // Don't warm up if already warming or recently warmed
    const now = Date.now();
    if (this.status.isWarming) {
      console.log('🔥 Server warmup already in progress...');
      return;
    }

    if (this.status.lastWarmup && (now - this.status.lastWarmup) < 60000) {
      console.log('✅ Server was warmed recently, skipping warmup');
      return;
    }

    console.log('🔥 Starting server warmup...');
    console.log('⏱️ This may take 30-60 seconds on Render free tier (cold start)');

    this.status.isWarming = true;
    this.status.isReady = false;
    this.status.attempts = 0;

    // Start warmup in background
    this.performWarmup();
  }

  private async performWarmup(): Promise<void> {
    const maxAttempts = 3;
    const timeout = 90000; // 90 seconds for cold start

    while (this.status.attempts < maxAttempts && !this.status.isReady) {
      this.status.attempts++;
      console.log(`🔥 Warmup attempt ${this.status.attempts}/${maxAttempts}`);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          console.log('✅ Server is now WARM and ready!');
          console.log('✅ Backend response time should be normal now');
          this.status.isReady = true;
          this.status.lastWarmup = Date.now();
          break;
        } else {
          console.log(`⚠️ Health check returned status ${response.status}, retrying...`);
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log(`⏰ Warmup attempt ${this.status.attempts} timed out after ${timeout/1000}s`);
        } else {
          console.log(`❌ Warmup attempt ${this.status.attempts} failed:`, error.message);
        }

        // Wait before retry (exponential backoff)
        if (this.status.attempts < maxAttempts) {
          const waitTime = Math.min(5000 * this.status.attempts, 15000);
          console.log(`⏳ Waiting ${waitTime/1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    this.status.isWarming = false;

    if (!this.status.isReady) {
      console.log('⚠️ Server warmup incomplete after all attempts');
      console.log('⚠️ Login may still work but might take 60+ seconds');
    }
  }

  /**
   * Check if server is ready (warmed up)
   */
  isServerReady(): boolean {
    return this.status.isReady;
  }

  /**
   * Get warmup status
   */
  getStatus(): WarmupStatus {
    return { ...this.status };
  }

  /**
   * Wait for server to be ready
   * Returns a promise that resolves when server is warm
   */
  async waitForReady(timeoutMs: number = 120000): Promise<boolean> {
    const startTime = Date.now();

    while (!this.status.isReady && (Date.now() - startTime) < timeoutMs) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return this.status.isReady;
  }
}

// Export singleton instance
export const serverWarmupService = new ServerWarmupService();
