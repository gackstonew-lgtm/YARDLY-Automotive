import { siteConfig } from '../../config/site';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const EmailService = {
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || `${siteConfig.name} <notifications@yardlyautomotives.co.ke>`;

    if (!apiKey) {
      console.log(`[Email Service - Dev Mode] To: ${options.to} | Subject: ${options.subject}`);
      return { success: true, id: `dev-email-${Date.now()}` };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [options.to],
          subject: options.subject,
          html: options.html
        })
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, id: data.id };
      }
      return { success: false, error: data.message || 'Failed to dispatch email' };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown email error';
      return { success: false, error: errorMsg };
    }
  },

  generateReservationEmailHtml(buyerName: string, vehicleTitle: string, depositAmountKES: number, reservationId: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #050505; margin: 0; padding: 20px; color: #F2F7F3; }
          .container { max-width: 600px; margin: 0 auto; background: #121212; border-radius: 16px; padding: 32px; box-shadow: 0 8px 32px rgba(45, 125, 255,0.08); border: 1px solid rgba(255, 255, 255,0.18); }
          .header { text-align: center; border-bottom: 1px solid rgba(255, 255, 255,0.12); padding-bottom: 20px; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: 800; color: #2D7DFF; letter-spacing: -0.5px; }
          .badge { display: inline-block; background: #1A1A1A; color: #2D7DFF; border: 1px solid rgba(45, 125, 255,0.3); padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 13px; }
          .price { font-size: 24px; font-weight: 700; color: #2D7DFF; margin: 16px 0; }
          .footer { margin-top: 32px; font-size: 12px; color: #8EA79C; text-align: center; border-top: 1px solid rgba(255, 255, 255,0.12); padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">${siteConfig.name}</div>
            <p style="color: #8EA79C; margin-top: 4px;">${siteConfig.tagline}</p>
          </div>
          <span class="badge">RESERVATION CONFIRMED</span>
          <h2 style="color: #F2F7F3;">Hello ${buyerName},</h2>
          <p style="color: #8EA79C;">Your reservation for <strong style="color: #F2F7F3;">${vehicleTitle}</strong> has been successfully confirmed!</p>
          <div class="price">Deposit Paid: KES ${depositAmountKES.toLocaleString()}</div>
          <p style="color: #8EA79C;"><strong style="color: #F2F7F3;">Reservation Ref:</strong> <span style="color: #2D7DFF; font-family: monospace;">${reservationId}</span></p>
          <p style="color: #8EA79C;">Our sales team at <strong style="color: #F2F7F3;">${siteConfig.name} Hub</strong> will contact you shortly to schedule your physical viewing or final transfer.</p>
          <div style="background: #0A0A0A; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(255, 255, 255,0.12);">
            <h4 style="margin-top:0; color: #F2F7F3;">Need assistance?</h4>
            <p style="margin-bottom:0; color: #8EA79C;">Call us: ${siteConfig.contact.phone} | WhatsApp: ${siteConfig.contact.whatsapp}</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} ${siteConfig.legalName}. All rights reserved.<br/>
            ${siteConfig.contact.address}
          </div>
        </div>
      </body>
      </html>
    `;
  },

  generateSellerSubmissionEmailHtml(sellerName: string, vehicleTitle: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #050505; margin: 0; padding: 20px; color: #F2F7F3; }
          .container { max-width: 600px; margin: 0 auto; background: #121212; border-radius: 16px; padding: 32px; border: 1px solid rgba(255, 255, 255,0.18); }
          .logo { font-size: 28px; font-weight: 800; color: #2D7DFF; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">${siteConfig.name}</div>
          <h2 style="color: #F2F7F3;">Vehicle Submission Received</h2>
          <p style="color: #8EA79C;">Dear ${sellerName},</p>
          <p style="color: #8EA79C;">Thank you for submitting your <strong style="color: #F2F7F3;">${vehicleTitle}</strong> to ${siteConfig.name}.</p>
          <p style="color: #8EA79C;">Our car-yard administration team is reviewing your details and logbook verification. Once verified, your listing will go live across Kenya's digital marketplace.</p>
          <p style="color: #8EA79C;">Status: <strong style="color: #2D7DFF;">Pending Review</strong></p>
        </div>
      </body>
      </html>
    `;
  }
};
