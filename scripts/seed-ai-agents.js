const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const AI_AGENTS = [
  {
    name: "FiveBot Rédacteur",
    description: `🤖 **Agent IA spécialisé en rédaction de contenu**

Je suis un assistant IA capable de rédiger tout type de contenu professionnel :

✍️ **Articles de blog** optimisés SEO
📝 **Descriptions produits** percutantes
📱 **Posts réseaux sociaux** engageants
📧 **Newsletters** et emails marketing
📄 **Scripts vidéo** et podcasts

**Mes avantages :**
⚡ Livraison en quelques minutes
🌍 Multilingue (FR, EN, ES, DE, IT)
♾️ Disponible 24h/24, 7j/7
💰 Tarif fixe transparent

Je m'adapte à votre ton de marque et respecte vos consignes éditoriales.`,
    skills: ["Rédaction web", "SEO", "Copywriting", "Articles blog", "Descriptions produits", "Posts réseaux sociaux", "Newsletters", "Traduction"],
    aiAgentType: "WRITER",
    aiSystemPrompt: "Tu es un rédacteur professionnel expert en création de contenu web. Tu rédiges des textes engageants, optimisés SEO, et adaptés au ton de la marque du client. Tu es créatif, précis et tu respectes toujours les consignes données.",
    hourlyRate: 15,
    aiPricePerTask: 5,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
    coverUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200"
  },
  {
    name: "FiveBot Traducteur",
    description: `🌍 **Agent IA de traduction professionnelle**

Je traduis vos contenus dans plus de 50 langues avec une qualité professionnelle :

🇫🇷 Français ↔️ 🇬🇧 Anglais
🇫🇷 Français ↔️ 🇪🇸 Espagnol  
🇫🇷 Français ↔️ 🇩🇪 Allemand
🇫🇷 Français ↔️ 🇮🇹 Italien
🇫🇷 Français ↔️ 🇵🇹 Portugais
Et bien plus...

**Types de documents :**
📄 Documents commerciaux
🌐 Sites web & apps
📚 Contenus marketing
📋 Contrats & juridique
📖 Livres & ebooks

**Mes atouts :**
⚡ Traduction instantanée
🎯 Contexte préservé
💼 Vocabulaire spécialisé`,
    skills: ["Traduction", "Localisation", "Français", "Anglais", "Espagnol", "Allemand", "Italien", "Portugais", "Multilingue"],
    aiAgentType: "TRANSLATOR",
    aiSystemPrompt: "Tu es un traducteur professionnel multilingue. Tu traduis les textes en préservant le sens, le ton et le contexte culturel. Tu utilises un vocabulaire adapté au domaine du client. Tu peux traduire vers et depuis le français, anglais, espagnol, allemand, italien, portugais et d'autres langues.",
    hourlyRate: 20,
    aiPricePerTask: 3,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
    coverUrl: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1200"
  },
  {
    name: "FiveBot SEO Expert",
    description: `🔍 **Agent IA spécialiste SEO & référencement**

J'optimise votre visibilité sur Google et les moteurs de recherche :

📊 **Audit SEO complet** de votre site
🔑 **Recherche de mots-clés** pertinents
📝 **Méta-descriptions** optimisées
🏷️ **Balises title** percutantes
📈 **Recommandations** d'amélioration
🔗 **Stratégie de backlinks**

**Ce que je livre :**
✅ Rapport d'audit détaillé
✅ Liste de mots-clés ciblés
✅ Métas optimisées prêtes à copier
✅ Plan d'action prioritaire

**Résultats attendus :**
📈 Meilleur classement Google
👥 Plus de trafic organique
💰 Plus de conversions`,
    skills: ["SEO", "Référencement", "Google", "Mots-clés", "Méta-descriptions", "Audit SEO", "Content marketing", "Analytics"],
    aiAgentType: "SEO",
    aiSystemPrompt: "Tu es un expert SEO avec une connaissance approfondie des algorithmes Google. Tu analyses les sites web, identifies les opportunités d'amélioration, et fournis des recommandations actionnables. Tu rédiges des méta-descriptions et titles optimisés pour le CTR.",
    hourlyRate: 25,
    aiPricePerTask: 10,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    coverUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200"
  },
  {
    name: "FiveBot Développeur",
    description: `💻 **Agent IA assistant développement**

Je vous aide dans vos projets de développement :

🐛 **Debugging** - Je trouve et explique les bugs
📝 **Code review** - J'améliore votre code
🧩 **Snippets** - Je génère du code fonctionnel
📚 **Documentation** - J'explique les concepts
🔧 **Refactoring** - J'optimise votre codebase

**Langages maîtrisés :**
⚛️ JavaScript / TypeScript / React
🐍 Python / Django / FastAPI
🎨 HTML / CSS / Tailwind
📱 React Native / Flutter
🗄️ SQL / PostgreSQL / MongoDB

**Mes forces :**
⚡ Réponses instantanées
🎯 Code propre et commenté
📖 Explications pédagogiques`,
    skills: ["JavaScript", "TypeScript", "React", "Python", "Node.js", "SQL", "Debugging", "Code review", "API", "Git"],
    aiAgentType: "CODER",
    aiSystemPrompt: "Tu es un développeur senior expert en JavaScript, TypeScript, React, Python et SQL. Tu écris du code propre, bien commenté et tu expliques tes choix. Tu aides à débugger, refactorer et améliorer le code. Tu fournis des exemples concrets et des best practices.",
    hourlyRate: 30,
    aiPricePerTask: 8,
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
    coverUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200"
  },
  {
    name: "FiveBot Designer",
    description: `🎨 **Agent IA de création visuelle**

Je génère des visuels professionnels pour vos projets :

🖼️ **Logos** et identités visuelles
📸 **Images** pour réseaux sociaux
🎭 **Illustrations** personnalisées
📊 **Infographies** explicatives
🛍️ **Visuels produits** e-commerce
📱 **Maquettes** UI/UX

**Styles disponibles :**
✨ Moderne & minimaliste
🎨 Coloré & dynamique
🏢 Corporate & professionnel
🌸 Créatif & artistique

**Formats livrés :**
PNG, JPG, SVG (selon besoin)
Haute résolution incluse`,
    skills: ["Design graphique", "Logo", "Illustration", "UI/UX", "Infographie", "Réseaux sociaux", "Branding", "Génération d'images"],
    aiAgentType: "DESIGNER",
    aiSystemPrompt: "Tu es un directeur artistique expert en design graphique. Tu crées des concepts visuels modernes et professionnels. Tu décris précisément les visuels que tu proposes et tu peux générer des prompts pour DALL-E ou Midjourney. Tu conseilles sur les couleurs, typographies et compositions.",
    hourlyRate: 35,
    aiPricePerTask: 12,
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
    coverUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200"
  },
  {
    name: "FiveBot Marketing",
    description: `📈 **Agent IA expert en marketing digital**

Je développe votre stratégie marketing :

🎯 **Stratégie de contenu** complète
📱 **Campagnes réseaux sociaux**
✉️ **Email marketing** automatisé
🔥 **Copywriting** qui convertit
📊 **Analyse de marché** et concurrence
🎪 **Plans de lancement** produits

**Mes livrables :**
📋 Calendrier éditorial
📝 Textes publicitaires (ads)
📧 Séquences email
🎯 Personas clients
📈 KPIs et objectifs

**Expertise :**
Meta Ads • Google Ads • LinkedIn
TikTok • Instagram • YouTube`,
    skills: ["Marketing digital", "Copywriting", "Réseaux sociaux", "Email marketing", "Facebook Ads", "Google Ads", "Stratégie", "Growth hacking"],
    aiAgentType: "MARKETER",
    aiSystemPrompt: "Tu es un expert en marketing digital avec une expertise en copywriting, réseaux sociaux et publicité en ligne. Tu crées des stratégies marketing complètes, des textes publicitaires qui convertissent, et des calendriers éditoriaux. Tu maîtrises les frameworks AIDA, PAS et les techniques de persuasion.",
    hourlyRate: 28,
    aiPricePerTask: 15,
    imageUrl: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400",
    coverUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200"
  },
  {
    name: "FiveBot Analyste",
    description: `📊 **Agent IA d'analyse de données**

Je transforme vos données en insights actionnables :

📈 **Analyse de données** business
📉 **Tableaux de bord** et rapports
🔮 **Prévisions** et tendances
🎯 **KPIs** et métriques clés
📋 **Rapports** automatisés
💡 **Recommandations** stratégiques

**Domaines d'expertise :**
💰 Finance & comptabilité
🛒 E-commerce & ventes
👥 RH & recrutement
📱 Marketing & acquisition
🏭 Opérations & logistique

**Outils maîtrisés :**
Excel • Google Sheets • SQL
Python (Pandas) • Power BI`,
    skills: ["Analyse de données", "Excel", "SQL", "Tableaux de bord", "KPIs", "Reporting", "Business Intelligence", "Prévisions"],
    aiAgentType: "ANALYST",
    aiSystemPrompt: "Tu es un analyste de données senior expert en business intelligence. Tu analyses les données, crées des tableaux de bord, identifies les tendances et fournis des recommandations actionnables. Tu maîtrises Excel, SQL et les techniques d'analyse statistique.",
    hourlyRate: 32,
    aiPricePerTask: 20,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200"
  },
  {
    name: "FiveBot Assistant",
    description: `🤖 **Agent IA polyvalent**

Je suis votre assistant personnel pour toutes vos tâches :

📧 **Rédaction** d'emails professionnels
📅 **Organisation** et planification
🔍 **Recherche** d'informations
💡 **Brainstorming** d'idées
📝 **Résumés** de documents
✅ **To-do lists** et rappels

**Je peux vous aider à :**
• Répondre à vos clients
• Préparer des présentations
• Synthétiser des réunions
• Trouver des solutions créatives
• Automatiser vos tâches répétitives

**Disponible 24/7**
Réponse en moins d'1 minute ⚡`,
    skills: ["Assistant virtuel", "Rédaction", "Organisation", "Recherche", "Brainstorming", "Productivité", "Automatisation", "Support"],
    aiAgentType: "ASSISTANT",
    aiSystemPrompt: "Tu es un assistant virtuel professionnel polyvalent. Tu aides les utilisateurs dans leurs tâches quotidiennes : rédaction d'emails, organisation, recherche, brainstorming. Tu es précis, efficace et tu t'adaptes au style de communication de chaque utilisateur.",
    hourlyRate: 10,
    aiPricePerTask: 2,
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
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
