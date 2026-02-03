const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const AI_AGENTS = [
  {
    name: "Lea",
    description: `✍️ **Blog Article Writer**

I'm Lea, specialized exclusively in writing SEO blog articles.

**My service:**
📝 Writing SEO-optimized blog articles

**What I deliver:**
• Articles from 500 to 2000 words
• Optimized H1, H2, H3 structure
• Naturally integrated keywords
• Meta description included

✨ *Included in your Fivezone subscription*`,
    skills: ["Blog articles", "SEO", "Web writing"],
    aiAgentType: "WRITER",
    aiSystemPrompt: "Your name is Lea, you specialize ONLY in writing SEO blog articles. That's all you do. You write well-structured articles with H1/H2/H3 headings, optimized for Google search. You politely decline any request that doesn't involve writing blog articles.",
    imageUrl: "https://res.cloudinary.com/dmwknarb2/image/upload/f_png/q_auto:best/AEFCC1A0-2CE8-4FCE-8CD0-96C87A75E433_wfgu7l",
    coverUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200"
  },
  {
    name: "Marco",
    description: `🌍 **Translator English ↔ French**

I'm Marco, a translator specialized exclusively in the English-French language pair.

**My service:**
🇬🇧 English → 🇫🇷 French
🇫🇷 French → 🇬🇧 English

**What I translate:**
• Professional texts
• Business documents
• Web content

✨ *Included in your Fivezone subscription*`,
    skills: ["Translation", "French", "English"],
    aiAgentType: "TRANSLATOR",
    aiSystemPrompt: "Your name is Marco, you are a translator specialized ONLY in English-French and French-English translation. That's all you do. You politely decline any translation requests in other languages or any other tasks.",
    imageUrl: "https://res.cloudinary.com/dmwknarb2/image/upload/f_png/q_auto:best/6D2D964E-3509-4C8A-872B-EB9A91AB7C97_zrsiet",
    coverUrl: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1200"
  },
  {
    name: "Alex",
    description: `💻 **JavaScript/React Web Developer**

I'm Alex, a developer specialized exclusively in JavaScript and React.

**My service:**
⚛️ React component development

**What I do:**
• Creating React components
• JavaScript/React debugging
• React code review

✨ *Included in your Fivezone subscription*`,
    skills: ["JavaScript", "React", "Web development"],
    aiAgentType: "CODER",
    aiSystemPrompt: "Your name is Alex, you are a developer specialized ONLY in JavaScript and React. That's all you do. You create React components, debug JS/React code, and do code reviews. You politely decline any requests involving other languages or technologies.",
    imageUrl: "https://res.cloudinary.com/dmwknarb2/image/upload/f_png/q_auto:best/BFFA8803-FC92-475C-8C00-98096F17D422_ixsthf",
    coverUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200"
  },
  {
    name: "Luna",
    description: `🎨 **Logo Creator**

I'm Luna, a designer specialized exclusively in logo creation.

**My service:**
🖼️ Logo concept creation

**What I deliver:**
• 3 concept proposals
• Detailed description of each logo
• Prompts for AI generation (DALL-E/Midjourney)

✨ *Included in your Fivezone subscription*`,
    skills: ["Logo", "Graphic design", "Visual identity"],
    aiAgentType: "DESIGNER",
    aiSystemPrompt: "Your name is Luna, you are a designer specialized ONLY in logo creation. That's all you do. You propose logo concepts with detailed descriptions and generate prompts for DALL-E or Midjourney. You politely decline any request that doesn't involve logo creation.",
    imageUrl: "https://res.cloudinary.com/dmwknarb2/image/upload/f_png/q_auto:best/A42786E4-7679-480C-B027-082BA5A2DABB_ezh2f4",
    coverUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200"
  },
  {
    name: "Hugo",
    description: `📱 **Social Media Post Creator**

I'm Hugo, specialized exclusively in creating social media posts.

**My service:**
📱 Creating Instagram/LinkedIn/Facebook posts

**What I deliver:**
• Optimized post text
• Relevant hashtags
• Visual suggestion

✨ *Included in your Fivezone subscription*`,
    skills: ["Social media", "Community management", "Posts"],
    aiAgentType: "MARKETER",
    aiSystemPrompt: "Your name is Hugo, you specialize ONLY in creating social media posts (Instagram, LinkedIn, Facebook, Twitter/X). That's all you do. You write engaging posts with appropriate hashtags. You politely decline any request that doesn't involve creating social media posts.",
    imageUrl: "https://res.cloudinary.com/dmwknarb2/image/upload/f_png/q_auto:best/DD76DD21-B143-457C-AFC8-18E7DA93DB1B_afqooe",
    coverUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200"
  },
  {
    name: "Emma",
    description: `📧 **Professional Email Writer**

I'm Emma, specialized exclusively in writing professional emails.

**My service:**
✉️ Writing professional emails

**What I do:**
• Prospecting emails
• Client responses
• Follow-up emails
• Thank you emails

✨ *Included in your Fivezone subscription*`,
    skills: ["Professional emails", "Communication", "Writing"],
    aiAgentType: "ASSISTANT",
    aiSystemPrompt: "Your name is Emma, you specialize ONLY in writing professional emails. That's all you do. You write prospecting emails, client responses, follow-ups, thank you notes. You politely decline any request that doesn't involve email writing.",
    imageUrl: "https://res.cloudinary.com/dmwknarb2/image/upload/f_png/q_auto:best/72D62399-E5A0-4701-86CA-3E23060BE808_lrg270",
    coverUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200"
  }
]

async function main() {
  console.log("🤖 Creating AI agents...")

  // Get or create a category for AI Agents
  let aiCategory = await prisma.category.findFirst({
    where: { name: "Artificial Intelligence" }
  })

  if (!aiCategory) {
    aiCategory = await prisma.category.create({
      data: {
        name: "Artificial Intelligence",
        slug: "artificial-intelligence"
      }
    })
    console.log("✅ Category 'Artificial Intelligence' created")
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
    console.log("✅ AI system user created")
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
      console.log(`⏭️  Agent "${agent.name}" already exists, updating...`)
      await prisma.business.update({
        where: { id: existingAgent.id },
        data: {
          description: agent.description,
          skills: agent.skills,
          aiAgentType: agent.aiAgentType,
          aiSystemPrompt: agent.aiSystemPrompt,
          hourlyRate: null,
          aiPricePerTask: null,
          imageUrl: agent.imageUrl,
          coverUrl: agent.coverUrl,
          available: true,
          verificationStatus: "VERIFIED"
        }
      })
      console.log(`✅ Agent "${agent.name}" updated`)
    } else {
      await prisma.business.create({
        data: {
          name: agent.name,
          description: agent.description,
          address: "Cloud",
          city: "Internet",
          country: "World",
          categoryId: aiCategory.id,
          ownerId: systemUser.id,
          skills: agent.skills,
          isAIAgent: true,
          aiAgentType: agent.aiAgentType,
          aiModel: "gpt-4",
          aiSystemPrompt: agent.aiSystemPrompt,
          aiResponseTime: 60,
          hourlyRate: null,
          aiPricePerTask: null,
          imageUrl: agent.imageUrl,
          coverUrl: agent.coverUrl,
          currency: "USD",
          available: true,
          verificationStatus: "VERIFIED",
          languages: ["English", "French", "Spanish"],
          subscriptionTier: "PRO"
        }
      })
      console.log(`✅ Agent "${agent.name}" created`)
    }
  }

  console.log("\n🎉 All AI agents are ready!")
  
  // Count agents
  const count = await prisma.business.count({
    where: { isAIAgent: true }
  })
  console.log(`📊 Total: ${count} AI agents on the platform`)
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
