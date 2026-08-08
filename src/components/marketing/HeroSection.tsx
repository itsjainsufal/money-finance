import { motion } from 'framer-motion';
import { ArrowRight, IndianRupee, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DEMO_INVITE_CODE, formatCurrency } from '@/lib/constants';

const heroCards = [
  { label: 'Monthly household runway', value: formatCurrency(185000), icon: IndianRupee },
  { label: 'Protected budget controls', value: 'Bank-grade auth', icon: ShieldCheck },
  { label: 'Family members aligned', value: '4 seats included', icon: Users },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-hero-grid px-6 py-16 text-white shadow-glow sm:px-10 lg:px-14">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <Badge className="mb-5 w-fit bg-white/10 text-white" variant="outline">
            Built for Indian households
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Track shared family money with calm, transparent, INR-first dashboards.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-200 sm:text-lg">
            Bring budgets, goals, bills, and daily expenses into one secure workspace designed for Indian number formatting and multi-member families.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/auth">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={`/join/${DEMO_INVITE_CODE}`}>Try demo invite</Link>
            </Button>
          </div>
        </div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="grid gap-4"
        >
          {heroCards.map(({ icon: Icon, label, value }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-white/10 bg-white/10 text-white shadow-none backdrop-blur-xl">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-slate-300">{label}</p>
                    <p className="mt-1 text-2xl font-semibold">{value}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
