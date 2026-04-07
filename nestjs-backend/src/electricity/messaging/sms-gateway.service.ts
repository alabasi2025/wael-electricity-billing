// =============================================
// خدمة SMS Gateway الفعلية
// تكامل مع SMS APIs + WhatsApp Business API
// بديل: send_sms_data / send_sms_dataW / rsed_SMS
// =============================================
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SmsGatewayConfig {
  provider: 'twilio' | 'nexmo' | 'local_gateway' | 'whatsapp' | 'mock';
  apiUrl?: string;
  apiKey?: string;
  apiSecret?: string;
  senderId?: string;
  whatsappApiUrl?: string;
  whatsappToken?: string;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
  timestamp: Date;
}

@Injectable()
export class SmsGatewayService {
  private readonly logger = new Logger(SmsGatewayService.name);
  private config: SmsGatewayConfig;

  constructor(private configSvc: ConfigService) {
    this.config = {
      provider: (this.configSvc.get('SMS_PROVIDER') || 'mock') as any,
      apiUrl: this.configSvc.get('SMS_API_URL'),
      apiKey: this.configSvc.get('SMS_API_KEY'),
      apiSecret: this.configSvc.get('SMS_API_SECRET'),
      senderId: this.configSvc.get('SMS_SENDER_ID') || 'ELECTRICITY',
      whatsappApiUrl: this.configSvc.get('WHATSAPP_API_URL'),
      whatsappToken: this.configSvc.get('WHATSAPP_TOKEN'),
    };
  }

  // ─── إرسال SMS ───
  async sendSms(phoneNumber: string, message: string): Promise<SendResult> {
    const phone = this.normalizePhone(phoneNumber);
    if (!phone) return { success: false, error: 'رقم هاتف غير صالح', provider: this.config.provider, timestamp: new Date() };

    this.logger.log(`[SMS] إرسال إلى ${phone}: ${message.substring(0, 50)}...`);

    try {
      switch (this.config.provider) {
        case 'twilio': return await this.sendViaTwilio(phone, message);
        case 'nexmo': return await this.sendViaNexmo(phone, message);
        case 'local_gateway': return await this.sendViaLocalGateway(phone, message);
        case 'mock': default: return this.sendMock(phone, message);
      }
    } catch (err) {
      this.logger.error(`[SMS] فشل الإرسال: ${err.message}`);
      return { success: false, error: err.message, provider: this.config.provider, timestamp: new Date() };
    }
  }

  // ─── إرسال WhatsApp ───
  async sendWhatsApp(phoneNumber: string, message: string): Promise<SendResult> {
    const phone = this.normalizePhone(phoneNumber);
    if (!phone) return { success: false, error: 'رقم غير صالح', provider: 'whatsapp', timestamp: new Date() };

    if (!this.config.whatsappApiUrl || !this.config.whatsappToken) {
      this.logger.warn('[WhatsApp] غير مُعد - تحويل إلى SMS');
      return this.sendSms(phoneNumber, message);
    }

    try {
      const response = await fetch(this.config.whatsappApiUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.config.whatsappToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp', to: phone, type: 'text',
          text: { body: message },
        }),
      });
      const data = await response.json();
      return { success: response.ok, messageId: data.messages?.[0]?.id, provider: 'whatsapp', timestamp: new Date() };
    } catch (err) {
      return { success: false, error: err.message, provider: 'whatsapp', timestamp: new Date() };
    }
  }

  // ─── إرسال جماعي ───
  async sendBulk(recipients: { phone: string; message: string; channel?: string }[]): Promise<{ sent: number; failed: number; results: SendResult[] }> {
    const results: SendResult[] = [];
    let sent = 0, failed = 0;

    for (const r of recipients) {
      const result = r.channel === 'whatsapp'
        ? await this.sendWhatsApp(r.phone, r.message)
        : await this.sendSms(r.phone, r.message);
      results.push(result);
      if (result.success) sent++; else failed++;
      // تأخير بسيط بين الرسائل
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return { sent, failed, results };
  }

  // ─── Twilio ───
  private async sendViaTwilio(phone: string, message: string): Promise<SendResult> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.config.apiKey}/Messages.json`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': 'Basic ' + Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: phone, From: this.config.senderId, Body: message }).toString(),
    });
    const data = await response.json();
    return { success: response.ok, messageId: data.sid, error: data.message, provider: 'twilio', timestamp: new Date() };
  }

  // ─── Nexmo/Vonage ───
  private async sendViaNexmo(phone: string, message: string): Promise<SendResult> {
    const url = 'https://rest.nexmo.com/sms/json';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: this.config.apiKey, api_secret: this.config.apiSecret, from: this.config.senderId, to: phone, text: message }),
    });
    const data = await response.json();
    const msg = data.messages?.[0];
    return { success: msg?.status === '0', messageId: msg?.['message-id'], error: msg?.['error-text'], provider: 'nexmo', timestamp: new Date() };
  }

  // ─── بوابة محلية ───
  private async sendViaLocalGateway(phone: string, message: string): Promise<SendResult> {
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': this.config.apiKey },
      body: JSON.stringify({ phone, message, sender: this.config.senderId }),
    });
    const data = await response.json();
    return { success: response.ok, messageId: data.id, error: data.error, provider: 'local_gateway', timestamp: new Date() };
  }

  // ─── محاكاة (للتطوير) ───
  private sendMock(phone: string, message: string): SendResult {
    this.logger.log(`[MOCK SMS] → ${phone}: ${message}`);
    return { success: true, messageId: `mock_${Date.now()}`, provider: 'mock', timestamp: new Date() };
  }

  // ─── تطبيع رقم الهاتف ───
  private normalizePhone(phone: string): string | null {
    if (!phone) return null;
    let clean = phone.replace(/[\s\-\(\)]/g, '');
    if (clean.startsWith('00')) clean = '+' + clean.substring(2);
    if (clean.startsWith('0') && clean.length >= 9) clean = '+967' + clean.substring(1);
    if (!clean.startsWith('+')) clean = '+967' + clean;
    if (clean.length < 10) return null;
    return clean;
  }

  // ─── التحقق من إعدادات البوابة ───
  getGatewayStatus(): { provider: string; configured: boolean; details: string } {
    const configured = this.config.provider !== 'mock' && !!this.config.apiKey;
    return {
      provider: this.config.provider,
      configured,
      details: configured ? `مُعد (${this.config.provider})` : 'وضع المحاكاة - أضف SMS_PROVIDER و SMS_API_KEY في .env',
    };
  }
}
