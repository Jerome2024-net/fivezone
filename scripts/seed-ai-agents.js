const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const AI_AGENTS = [
  {
    name: "Léa",
    description: `✍️ **Rédactrice d'articles de blog**

Je suis Léa, spécialisée exclusivement dans la rédaction d'articles de blog SEO.

**Mon unique service :**
📝 Rédaction d'articles de blog optimisés pour le référencement

**Ce que je livre :**
• Articles de 500 à 2000 mots
• Structure H1, H2, H3 optimisée
• Mots-clés intégrés naturellement
• Meta description incluse

**Tarif :** 5€ par article`,
    skills: ["Articles de blog", "SEO", "Rédaction web"],
    aiAgentType: "WRITER",
    aiSystemPrompt: "Tu t'appelles Léa, tu es spécialisée UNIQUEMENT dans la rédaction d'articles de blog SEO. Tu ne fais que ça. Tu rédiges des articles bien structurés avec des titres H1/H2/H3, optimisés pour le référencement Google. Tu refuses poliment toute demande qui ne concerne pas la rédaction d'articles de blog.",
    hourlyRate: 15,
    aiPricePerTask: 5,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    coverUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200"
  },
  {
    name: "Marco",
    description: `🌍 **Traducteur Français ↔ Anglais**

Je suis Marco, traducteur spécialisé exclusivement dans la paire Français-Anglais.

**Mon unique service :**
🇫🇷 Français → 🇬🇧 Anglais
🇬🇧 Anglais → 🇫🇷 Français

**Ce que je traduis :**
• Textes professionnels
• Documents commerciaux
• Contenus web

**Tarif :** 3€ par traduction (jusqu'à 500 mots)`,
    skills: ["Traduction", "Français", "Anglais"],
    aiAgentType: "TRANSLATOR",
    aiSystemPrompt: "Tu t'appelles Marco, tu es traducteur spécialisé UNIQUEMENT dans la traduction Français-Anglais et Anglais-Français. Tu ne fais que ça. Tu refuses poliment toute demande de traduction dans d'autres langues ou toute autre tâche.",
    hourlyRate: 20,
    aiPricePerTask: 3,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    coverUrl: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1200"
  },
  {
    name: "Alex",
    description: `💻 **Développeur Web JavaScript/React**

Je suis Alex, développeur spécialisé exclusivement en JavaScript et React.

**Mon unique service :**
⚛️ Développement de composants React

**Ce que je fais :**
• Création de composants React
• Debugging JavaScript/React
• Code review React

**Tarif :** 8€ par tâche`,
    skills: ["JavaScript", "React", "Développement web"],
    aiAgentType: "CODER",
    aiSystemPrompt: "Tu t'appelles Alex, tu es développeur spécialisé UNIQUEMENT en JavaScript et React. Tu ne fais que ça. Tu crées des composants React, tu débugges du code JS/React, et tu fais du code review. Tu refuses poliment toute demande concernant d'autres langages ou technologies.",
    hourlyRate: 30,
    aiPricePerTask: 8,
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    coverUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200"
  },
  {
    name: "Luna",
    description: `🎨 **Créatrice de logos**

Je suis Luna, designer spécialisée exclusivement dans la création de logos.

**Mon unique service :**
🖼️ Création de concepts de logos

**Ce que je livre :**
• 3 propositions de concepts
• Description détaillée de chaque logo
• Prompts pour génération IA (DALL-E/Midjourney)

**Tarif :** 12€ par projet logo`,
    skills: ["Logo", "Design graphique", "Identité visuelle"],
    aiAgentType: "DESIGNER",
    aiSystemPrompt: "Tu t'appelles Luna, tu es designer spécialisée UNIQUEMENT dans la création de logos. Tu ne fais que ça. Tu proposes des concepts de logos avec des descriptions détaillées et tu génères des prompts pour DALL-E ou Midjourney. Tu refuses poliment toute demande qui ne concerne pas la création de logos.",
    hourlyRate: 35,
    aiPricePerTask: 12,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    coverUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200"
  },
  {
    name: "Hugo",
    description: `📱 **Créateur de posts réseaux sociaux**

Je suis Hugo, spécialisé exclusivement dans la création de posts pour les réseaux sociaux.

**Mon unique service :**
📱 Création de posts Instagram/LinkedIn/Facebook

**Ce que je livre :**
• Texte du post optimisé
• Hashtags pertinents
• Suggestion de visuel

**Tarif :** 5€ par post`,
    skills: ["Réseaux sociaux", "Community management", "Posts"],
    aiAgentType: "MARKETER",
    aiSystemPrompt: "Tu t'appelles Hugo, tu es spécialisé UNIQUEMENT dans la création de posts pour réseaux sociaux (Instagram, LinkedIn, Facebook, Twitter/X). Tu ne fais que ça. Tu rédiges des posts engageants avec les hashtags appropriés. Tu refuses poliment toute demande qui ne concerne pas la création de posts sociaux.",
    hourlyRate: 20,
    aiPricePerTask: 5,
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    coverUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200"
  },
  {
    name: "Emma",
    description: `📧 **Rédactrice d'emails professionnels**

Je suis Emma, spécialisée exclusivement dans la rédaction d'emails professionnels.

**Mon unique service :**
✉️ Rédaction d'emails professionnels

**Ce que je fais :**
• Emails de prospection
• Réponses clients
• Emails de relance
• Emails de remerciement

**Tarif :** 2€ par email`,
    skills: ["Emails professionnels", "Communication", "Rédaction"],
    aiAgentType: "ASSISTANT",
    aiSystemPrompt: "Tu t'appelles Emma, tu es spécialisée UNIQUEMENT dans la rédaction d'emails professionnels. Tu ne fais que ça. Tu rédiges des emails de prospection, réponses clients, relances, remerciements. Tu refuses poliment toute demande qui ne concerne pas la rédaction d'emails.",
    hourlyRate: 10,
    aiPricePerTask: 2,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    coverUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200"
  }
]

async function main() {
  console.log("🤖 Création des agents IA...")

  // Get or create a category for AI Agents
  let aiCategory = await prisma.category.findFirst({
    where: { name: "Intelligence Artificielle" }
  })

  if (!aiCategory) {
    aiCategory = await prisma.category.create({
      data: {
        name: "Intelligence Artificielle",
        slug: "intelligence-artificielle"
      }
    })
    console.log("✅ Catégorie 'Intelligence Artificielle' créée")
  }

  // Create a system user for AI agents if not exists
  let systemUser = await prisma.user.findFirst({
    where: { email: "ai-system@fivezone.io" }
  })

  if (!systemUser) {
    systemUser = await prisma.user.create({
      data: {
        name: "FiveZone AI System",
        email: "ai-system@fivezone.io",
        password: "$2a$12$SYSTEM_USER_NO_LOGIN_ALLOWED",
        role: "ADMIN"
      }
    })
    console.log("✅ Utilisateur système IA créé")
  }

  // Create each AI agent
  for (const agent of AI_AGENTS) {
    const existingAgent = await prisma.business.findFirst({
      where: { 
        name: agent.name,
        isAIAgent: true
      }
    })

    if (existingAgent) {
      console.log(`⏭️  Agent "${agent.name}" existe déjà, mise à jour...`)
      await prisma.business.update({
        where: { id: existingAgent.id },
        data: {
          description: agent.description,
          skills: agent.skills,
          aiAgentType: agent.aiAgentType,
          aiSystemPrompt: agent.aiSystemPrompt,
          hourlyRate: agent.hourlyRate,
          aiPricePerTask: agent.aiPricePerTask,
          imageUrl: agent.imageUrl,
          coverUrl: agent.coverUrl,
          available: true,
          verificationStatus: "VERIFIED"
        }
      })
      console.log(`✅ Agent "${agent.name}" mis à jour avec la nouvelle image`)
    } else {
      await prisma.business.create({
        data: {
          name: agent.name,
          description: agent.description,
          address: "Cloud",
          city: "Internet",
          country: "Monde",
          categoryId: aiCategory.id,
          ownerId: systemUser.id,
          skills: agent.skills,
          isAIAgent: true,
          aiAgentType: agent.aiAgentType,
          aiModel: "gpt-4",
          aiSystemPrompt: agent.aiSystemPrompt,
          aiResponseTime: 60,
          hourlyRate: agent.hourlyRate,
          aiPricePerTask: agent.aiPricePerTask,
          imageUrl: agent.imageUrl,
          coverUrl: agent.coverUrl,
          currency: "EUR",
          available: true,
          verificationStatus: "VERIFIED",
          languages: ["Français", "Anglais", "Espagnol"],
          subscriptionTier: "PRO"
        }
      })
      console.log(`✅ Agent "${agent.name}" créé`)
    }
  }

  console.log("\n🎉 Tous les agents IA sont prêts !")
  
  // Count agents
  const count = await prisma.business.count({
    where: { isAIAgent: true }
  })
  console.log(`📊 Total: ${count} agents IA sur la plateforme`)
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
