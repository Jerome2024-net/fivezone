import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// From address - use your verified domain or Resend's default
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'FreelanceHub'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface MissionNotificationData {
    freelanceEmail: string
    freelanceName: string
    clientName: string
    clientEmail: string
    clientPhone?: string | null
    clientCompany?: string | null
    projectTitle: string
    projectDescription: string
    budget?: number | null
    budgetType?: string
    deadline?: Date | null
    duration?: string | null
    businessId: string
}

export async function sendMissionNotificationEmail(data: MissionNotificationData) {
    const {
        freelanceEmail,
        freelanceName,
        clientName,
        clientEmail,
        clientPhone,
        clientCompany,
        projectTitle,
        projectDescription,
        budget,
        budgetType,
        deadline,
        duration,
        businessId
    } = data

    const budgetTypeLabels: Record<string, string> = {
        FIXED: 'Forfait',
        HOURLY: 'Horaire',
        DAILY: 'TJM',
        TO_DISCUSS: 'À discuter'
    }

    const budgetText = budget 
        ? `${budget}€ (${budgetTypeLabels[budgetType || 'TO_DISCUSS']})`
        : 'À discuter'

    const deadlineText = deadline 
        ? new Date(deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Non spécifiée'

    try {
        const { data: result, error } = await resend.emails.send({
            from: `${APP_NAME} <${FROM_EMAIL}>`,
            to: freelanceEmail,
            subject: `🎯 Nouvelle demande de devis : ${projectTitle}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #34E0A1 0%, #2bc98e 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 700;">
                🎯 Nouvelle demande de devis !
            </h1>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Bonjour <strong>${freelanceName || 'Freelance'}</strong>,
            </p>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Vous avez reçu une nouvelle demande de devis sur votre profil !
            </p>
            
            <!-- Project Card -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
                    ${projectTitle}
                </h2>
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0; white-space: pre-wrap;">
                    ${projectDescription.substring(0, 300)}${projectDescription.length > 300 ? '...' : ''}
                </p>
                
                <div style="display: grid; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #94a3b8;">💰</span>
                        <span style="color: #475569; font-size: 14px;"><strong>Budget :</strong> ${budgetText}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #94a3b8;">📅</span>
                        <span style="color: #475569; font-size: 14px;"><strong>Date limite :</strong> ${deadlineText}</span>
                    </div>
                    ${duration ? `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #94a3b8;">⏱️</span>
                        <span style="color: #475569; font-size: 14px;"><strong>Durée estimée :</strong> ${duration}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Client Info -->
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                    👤 Contact du client
                </h3>
                <div style="display: grid; gap: 8px;">
                    <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
                        <strong>${clientName}</strong>
                        ${clientCompany ? `<span style="color: #3b82f6;"> - ${clientCompany}</span>` : ''}
                    </p>
                    <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
                        📧 <a href="mailto:${clientEmail}" style="color: #2563eb; text-decoration: none;">${clientEmail}</a>
                    </p>
                    ${clientPhone ? `
                    <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
                        📞 <a href="tel:${clientPhone}" style="color: #2563eb; text-decoration: none;">${clientPhone}</a>
                    </p>
                    ` : ''}
                </div>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 24px;">
                <a href="${APP_URL}/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #34E0A1 0%, #2bc98e 100%); color: #0f172a; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 14px rgba(52, 224, 161, 0.4);">
                    Voir la demande complète →
                </a>
            </div>
            
            <p style="color: #94a3b8; font-size: 13px; text-align: center; margin: 0;">
                Répondez rapidement pour augmenter vos chances de décrocher cette mission !
            </p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 24px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Cet email a été envoyé par ${APP_NAME}.<br>
                Vous recevez cet email car quelqu'un a demandé un devis sur votre profil.
            </p>
        </div>
    </div>
</body>
</html>
            `
        })

        if (error) {
            console.error('Resend Error:', error)
            return { success: false, error }
        }

        console.log('Email sent successfully:', result)
        return { success: true, data: result }
    } catch (error) {
        console.error('Email Error:', error)
        return { success: false, error }
    }
}

// Notification when freelance responds to a mission request
interface MissionResponseNotificationData {
    clientEmail: string
    clientName: string
    freelanceName: string
    projectTitle: string
    status: 'PROPOSAL' | 'ACCEPTED' | 'REJECTED'
    proposedPrice?: number | null
    proposedDeadline?: Date | null
    freelanceMessage?: string | null
    businessId: string
}

export async function sendMissionResponseEmail(data: MissionResponseNotificationData) {
    const {
        clientEmail,
        clientName,
        freelanceName,
        projectTitle,
        status,
        proposedPrice,
        proposedDeadline,
        freelanceMessage,
        businessId
    } = data

    const statusConfig = {
        PROPOSAL: {
            emoji: '📋',
            title: 'Vous avez reçu un devis !',
            subtitle: `${freelanceName} vous a envoyé une proposition`,
            color: '#8b5cf6'
        },
        ACCEPTED: {
            emoji: '✅',
            title: 'Votre demande a été acceptée !',
            subtitle: `${freelanceName} souhaite travailler avec vous`,
            color: '#22c55e'
        },
        REJECTED: {
            emoji: '❌',
            title: 'Demande déclinée',
            subtitle: `${freelanceName} n'est pas disponible pour cette mission`,
            color: '#ef4444'
        }
    }

    const config = statusConfig[status]
    const deadlineText = proposedDeadline 
        ? new Date(proposedDeadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        : null

    try {
        const { data: result, error } = await resend.emails.send({
            from: `${APP_NAME} <${FROM_EMAIL}>`,
            to: clientEmail,
            subject: `${config.emoji} ${config.title} - ${projectTitle}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="background: ${config.color}; border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">
                ${config.emoji} ${config.title}
            </h1>
            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                ${config.subtitle}
            </p>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Bonjour <strong>${clientName}</strong>,
            </p>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Concernant votre projet "<strong>${projectTitle}</strong>" :
            </p>
            
            ${status === 'PROPOSAL' && (proposedPrice || freelanceMessage) ? `
            <!-- Proposal Details -->
            <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #7c3aed; font-size: 16px; font-weight: 600;">
                    💰 Proposition tarifaire
                </h3>
                ${proposedPrice ? `
                <p style="margin: 0 0 12px 0; color: #0f172a; font-size: 28px; font-weight: 700;">
                    ${proposedPrice}€
                </p>
                ` : ''}
                ${deadlineText ? `
                <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px;">
                    📅 Livraison estimée : <strong>${deadlineText}</strong>
                </p>
                ` : ''}
                ${freelanceMessage ? `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e9d5ff;">
                    <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6; font-style: italic;">
                        "${freelanceMessage}"
                    </p>
                </div>
                ` : ''}
            </div>
            ` : ''}
            
            ${status === 'REJECTED' && freelanceMessage ? `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
                    Message du freelance : <em>"${freelanceMessage}"</em>
                </p>
            </div>
            ` : ''}
            
            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 24px;">
                <a href="${APP_URL}/business/${businessId}" 
                   style="display: inline-block; background: #0f172a; color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px;">
                    Voir le profil de ${freelanceName}
                </a>
            </div>
            
            ${status === 'PROPOSAL' ? `
            <p style="color: #94a3b8; font-size: 13px; text-align: center; margin: 0;">
                Vous pouvez contacter directement le freelance pour discuter des détails.
            </p>
            ` : ''}
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 24px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Cet email a été envoyé par ${APP_NAME}.
            </p>
        </div>
    </div>
</body>
</html>
            `
        })

        if (error) {
            console.error('Resend Error:', error)
            return { success: false, error }
        }

        return { success: true, data: result }
    } catch (error) {
        console.error('Email Error:', error)
        return { success: false, error }
    }
}
