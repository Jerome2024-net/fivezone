const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CONVERSIONS_TOKEN;

type UserData = {
    em?: string; // email (hashed typically, but API handles hashing if raw provided? Better to hash ourselves if using raw, but CAPI often accepts hashed. Nextjs server side we can hash)
    // Actually, Meta recommends sending hashed data.
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
};

type EventData = {
    eventName: string;
    eventTime?: number;
    userData: UserData;
    customData?: Record<string, any>;
    eventSourceUrl: string;
    actionSource?: 'website';
};

/**
 * Hash a string using SHA-256 (Meta requirement)
 */
async function hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function sendMetaEvent(event: EventData) {
    if (!PIXEL_ID || !ACCESS_TOKEN) {
        console.warn("Meta Pixel ID or Access Token missing. Event not sent.");
        return;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Hash PII data if present and not already hashed (simplistic check: length)
    // For now assuming caller passes raw and we hash, or we handle it here.
    // Meta requires SHA256 of normalized (lowercase, trimmed) data.
    
    let hashedEmail = null;
    if (event.userData.em) {
        hashedEmail = await hashData(event.userData.em);
    }

    const body = {
        data: [
            {
                event_name: event.eventName,
                event_time: event.eventTime || currentTimestamp,
                action_source: event.actionSource || "website",
                event_source_url: event.eventSourceUrl,
                user_data: {
                    em: hashedEmail ? [hashedEmail] : undefined,
                    client_ip_address: event.userData.client_ip_address,
                    client_user_agent: event.userData.client_user_agent,
                    // fbc: event.userData.fbc,
                    // fbp: event.userData.fbp
                },
                custom_data: event.customData,
            }
        ]
    };

    try {
        const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Meta CAPI Error:', JSON.stringify(error));
        } else {
            // console.log(`Meta Event ${event.eventName} sent successfully.`);
        }
    } catch (error) {
        console.error('Failed to send Meta event:', error);
    }
}
