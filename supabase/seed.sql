-- Experiences
insert into experiences (title, company, location, period, accent, bullets, sort_order) values
(
  'Frontend Engineer',
  'Wings Group Indonesia (FMCG enterprise, ~20,000 employees)',
  'Jakarta, Indonesia',
  'Jun 2023 - Present',
  'periwinkle',
  '[
    "Built the Sales Order system in Next.js (Docker) with a multi-condition promotional pricing engine covering 10+ promo types, the primary order entry point for Wings'' national distribution network.",
    "Reduced campaign activation time by 95% by engineering the STAR promo module with a batch-upload pipeline processing 16,000 records per cycle.",
    "Co-built an enterprise design system (React, Material-UI, Storybook) adopted across 10+ internal apps, cutting per-feature UI development time by approximately 40%.",
    "Architected Master Generator v2, a schema-driven code-gen tool that auto-generates Joomla MVC CRUD modules from live database schemas, accelerating new-module delivery by 50%."
  ]',
  0
),
(
  'Software Engineer',
  'Wings Group Indonesia',
  'Jakarta, Indonesia',
  'Oct 2021 - Jun 2023',
  'mint',
  '[
    "Developed and maintained 7 HR modules (payroll, e-recruitment, termination, job-batch processing, online forms) using Java and Joomla, supporting 20,000+ employees.",
    "Delivered a fingerprint attendance management tool to bulk-transfer and clean biometric records, eliminating manual data-entry effort for 5,000+ users."
  ]',
  1
);

-- Education (single row)
insert into education (degree, institution, year, certifications) values
(
  'B.Sc. Computer Science',
  'University of Surabaya (UBAYA), Indonesia',
  '2021',
  '[
    "Bangkit 2021 Cloud Computing Track (Google, Tokopedia, Gojek, Traveloka)",
    "Kominfo Cyber Security Graduate Academy",
    "SIAS University China Exchange",
    "Hack2Skill GenAI APAC 2026 (in progress)"
  ]'
);

-- Projects
insert into projects (slug, case_study_number, tagline, accent, tech, sort_order) values
(
  'calendar-clone',
  '01',
  'A production-grade Google Calendar rebuild - OAuth, RRULE engine, real test suite.',
  'marigold',
  '["Next.js 16", "NestJS 11", "PostgreSQL", "Turborepo"]',
  0
),
(
  'giftclaw',
  '02',
  'AI-powered gift finder wrapped in a retro arcade claw machine game.',
  'mint',
  '["Next.js 16", "Tailwind CSS v4", "PostgreSQL", "Prisma 7", "Gemini 2.5 Flash", "Supabase", "Vitest", "Playwright"]',
  1
);

-- Community
insert into community (name, description, href, accent, sort_order) values
(
  'Women Talk Series',
  'A YouTube talk series I founded to amplify women in tech - engineers, designers, and founders sharing their journeys.',
  'https://www.youtube.com/watch?v=AxnzU07nlVk&list=PL-1PWH5uyT-eJSJf1oQTbnlbvUDS-I4HK',
  'mint',
  0
),
(
  'Rewriting the Code',
  'Global community supporting women in tech through scholarships, mentorship, and job placement.',
  'https://rewritingthecode.org/',
  'periwinkle',
  1
);
