import { motion } from 'framer-motion';
import { CheckCircle2, Landmark, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroSection } from '@/components/marketing/HeroSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORIES, DEMO_INVITE_CODE } from '@/lib/constants';

const features = [
  {
    icon: Landmark,
    title: 'INR-first reporting',
    description: 'Built-in Indian number formatting, rupee defaults, and shared monthly summaries for households.',
  },
  {
    icon: Shield,
    title: 'Private family zones',
    description: 'Separate personal finance, household budgets, and invite-only family workspaces powered by Supabase auth.',
  },
  {
    icon: Sparkles,
    title: 'Motion-rich experience',
    description: 'Responsive dashboards with tasteful Framer Motion micro-interactions and shadcn-styled UI.',
  },
];

export default function Landing() {
  return (
    <div className="pb-16">
      <div className="section-shell py-6">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-full border border-border bg-card/80 px-5 py-3 backdrop-blur">
          <Link className="font-heading text-lg font-semibold" to="/">
            Kutumb Cashflow
          </Link>
          <div className="flex gap-2">
            <Button asChild variant="ghost">
              <Link to={`/join/${DEMO_INVITE_CODE}`}>Try demo invite</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Open app</Link>
            </Button>
          </div>
        </div>
        <HeroSection />
      </div>

      <section className="section-shell mt-16 grid gap-6 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="section-shell mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <Badge className="w-fit" variant="success">
              Finance workflow
            </Badge>
            <CardTitle className="text-3xl">Designed for modern family money rituals</CardTitle>
            <CardDescription>
              Manage groceries, school fees, SIP targets, insurance renewals, and emergency funds from a single dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {CATEGORIES.slice(0, 8).map((category) => (
              <div key={category} className="flex items-center gap-3 rounded-2xl border border-border/70 p-4 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {category}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>What ships in this starter</CardTitle>
            <CardDescription>Everything wired to scale from landing page to private dashboards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>• Public marketing, auth, invite flow, dashboard, finance, and settings routes.</p>
            <p>• Typed Supabase hooks for transactions, budgets, goals, and user preferences.</p>
            <p>• shadcn-inspired UI primitives with Tailwind v3 and dark mode support.</p>
            <p>• Shared context for auth, family membership, theme, and currency.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
