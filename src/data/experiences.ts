// AUTO-GENERATED — edit content/experiences/*.md and run npm run sync
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  logo: string;
  image: string;
  stats: { label: string; value: string }[];
  skills: string[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
    avatar?: string;
  };
}

export const experiences: ExperienceItem[] = [
  {
    "id": "ab-inbev",
    "role": "Senior Product Manager",
    "company": "AB InBev",
    "period": "May 2024 – Present",
    "location": "Bengaluru",
    "image": "/images/experiences/insights-copilot.png",
    "logo": "/images/logos/ab-inbev.svg",
    "stats": [
      {
        "label": "MAU Growth",
        "value": "20x"
      },
      {
        "label": "Savings",
        "value": "$1M+"
      },
      {
        "label": "Accuracy",
        "value": "91%"
      }
    ],
    "skills": [
      "GenAI",
      "Product Strategy",
      "Agentic Workflows",
      "RLHF"
    ],
    "testimonial": {
      "text": "Sourav transformed how we access data. His vision for the Copilot has been a game-changer for our daily decision making.",
      "author": "Jane Doe",
      "role": "Global Director of Analytics"
    },
    "description": "Leading Generative AI initiatives for the world's largest brewer. Spearheaded the enterprise Data Insights Copilot from 0-to-1, scaling to 500+ MAU across global business units in under a year."
  },
  {
    "id": "bain",
    "role": "Summer Associate",
    "company": "Bain & Company",
    "period": "Apr 2023 – Jun 2023",
    "location": "Mumbai",
    "logo": "/images/logos/bain_mono.svg",
    "image": "/images/experiences/bain.png",
    "stats": [
      {
        "label": "Market Impact",
        "value": "$10B+"
      },
      {
        "label": "Forecast Accuracy",
        "value": "+10%"
      }
    ],
    "skills": [
      "Strategy",
      "Financial Modeling",
      "Market Analysis"
    ],
    "description": "Strategized Life Insurance business models and developed an integrated IT resource forecasting MVP for a Tier-1 client. Published a 5-year POV estimating the $10B+ Indian insurance market."
  },
  {
    "id": "vedanta-pm",
    "role": "Product Manager",
    "company": "Vedanta Resources",
    "period": "Oct 2020 – May 2022",
    "location": "Mumbai",
    "image": "/images/experiences/insights-copilot.png",
    "logo": "/images/logos/vedanta_mono.svg",
    "stats": [
      {
        "label": "Transaction Vol",
        "value": "$5B+"
      },
      {
        "label": "Sales Online",
        "value": "30%"
      },
      {
        "label": "NPS",
        "value": "60+"
      }
    ],
    "skills": [
      "B2B E-commerce",
      "Platform Growth",
      "Digital Transformation"
    ],
    "testimonial": {
      "text": "The platform Sourav launched completely modernized our sales process. A truly user-centric product leader.",
      "author": "John Smith",
      "role": "Head of Sales"
    },
    "description": "Launched a B2B e-commerce platform selling 5+ commodities, moving 30% of sales online within a year and handling $5B+ in annual transactions."
  },
  {
    "id": "vedanta-ai",
    "role": "Smart Manufacturing & AI Lead",
    "company": "Vedanta Resources",
    "period": "Jul 2018 – Sep 2020",
    "location": "New Delhi",
    "logo": "/images/logos/vedanta_mono.svg",
    "image": "/images/experiences/vedanta-ai.png",
    "stats": [
      {
        "label": "Profit Accrual",
        "value": "$250M+"
      },
      {
        "label": "AI Projects",
        "value": "25+"
      }
    ],
    "skills": [
      "Industry 4.0",
      "Machine Learning",
      "Data Science"
    ],
    "description": "Established the AI Centre of Excellence and steered the Industry 4.0 roadmap across 10+ business units, certifying 100+ functional leaders as data scientists."
  }
];
