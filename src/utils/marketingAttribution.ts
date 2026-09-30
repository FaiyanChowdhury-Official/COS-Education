export interface MarketingAttribution {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  utmTerm?: string;
  leadSourceCategory: 'Website' | 'Facebook' | 'Instagram' | 'YouTube' | 'TikTok' | 'Google' | 'Referral' | 'WhatsApp' | 'Manual' | 'Other';
}

export function getMarketingAttribution(): MarketingAttribution {
  if (typeof window === 'undefined') {
    return {
      utmSource: 'direct',
      utmMedium: 'direct',
      utmCampaign: 'organic',
      leadSourceCategory: 'Website',
    };
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');
  const utmContent = params.get('utm_content') || undefined;
  const utmTerm = params.get('utm_term') || undefined;

  // Determine category based on source / referrer
  const ref = (document.referrer || '').toLowerCase();
  const sourceLower = (utmSource || '').toLowerCase();

  let leadSourceCategory: MarketingAttribution['leadSourceCategory'] = 'Website';

  if (sourceLower.includes('facebook') || ref.includes('facebook.com') || ref.includes('fb.com')) {
    leadSourceCategory = 'Facebook';
  } else if (sourceLower.includes('instagram') || ref.includes('instagram.com')) {
    leadSourceCategory = 'Instagram';
  } else if (sourceLower.includes('youtube') || ref.includes('youtube.com') || ref.includes('youtu.be')) {
    leadSourceCategory = 'YouTube';
  } else if (sourceLower.includes('tiktok') || ref.includes('tiktok.com')) {
    leadSourceCategory = 'TikTok';
  } else if (sourceLower.includes('google') || ref.includes('google.com')) {
    leadSourceCategory = 'Google';
  } else if (sourceLower.includes('whatsapp') || ref.includes('whatsapp.com')) {
    leadSourceCategory = 'WhatsApp';
  } else if (sourceLower.includes('referral') || (ref && !ref.includes(window.location.hostname))) {
    leadSourceCategory = 'Referral';
  }

  return {
    utmSource: utmSource || (ref ? new URL(ref).hostname : 'website'),
    utmMedium: utmMedium || (leadSourceCategory === 'Website' ? 'direct' : 'organic_referral'),
    utmCampaign: utmCampaign || 'general_portal_enquiry',
    utmContent,
    utmTerm,
    leadSourceCategory,
  };
}
