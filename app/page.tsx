import {
  BookOpen,
  ChevronDown,
  FileText,
  Lightbulb,
  Menu,
  MessageSquareText,
  PenLine,
  Rocket,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import AuthPromptForm from "../components/AuthPromptForm";
import BrandLogo from "../components/BrandLogo";
import {
  createClient,
  isServerSupabaseConfigured,
} from "../lib/supabase/server";

const navLinks = [
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Tarifs", href: "/pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Ressources", href: "#ressources" },
];

const heroAvatarIndexes = [0, 1, 2, 3, 4];
const socialProofAvatarIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const cardBadges = [
  {
    label: "Avec ChatGPT",
    className: "border-red-100 bg-red-500 text-white shadow-red-200/70",
  },
  {
    label: "Avec LinkPost",
    className: "border-green-100 bg-emerald-500 text-white shadow-emerald-200/70",
  },
  {
    label: "👥 +8 000 utilisateurs",
    className: "border-blue-100 bg-white text-slate-700 shadow-blue-100",
  },
  {
    label: "✓ Gratuit pour commencer",
    className: "border-emerald-100 bg-white text-slate-700 shadow-emerald-100",
  },
];

const testimonials = [
  {
    name: "Thomas D.",
    role: "Consultant Marketing",
    avatarIndex: 0,
    quote:
      "Grâce à LinkPost je publie beaucoup plus régulièrement. J'ai obtenu plusieurs rendez-vous qualifiés en quelques semaines.",
  },
  {
    name: "Camille R.",
    role: "Coach Business",
    avatarIndex: 1,
    quote:
      "Je passais des heures à écrire mes posts. Maintenant j'ai une première version en quelques secondes.",
  },
  {
    name: "Julien M.",
    role: "Fondateur d'agence",
    avatarIndex: 2,
    quote:
      "Les hooks générés sont excellents. Les publications attirent beaucoup plus d'engagement.",
  },
  {
    name: "Sophie L.",
    role: "Freelance Copywriter",
    avatarIndex: 3,
    quote:
      "Simple, rapide et efficace. Je gagne un temps énorme chaque semaine.",
  },
  {
    name: "Nadia B.",
    role: "Consultante RH",
    avatarIndex: 5,
    quote:
      "LinkPost m'aide à transformer mes idées en contenus clairs, utiles et orientés acquisition.",
  },
  {
    name: "Marc T.",
    role: "CEO SaaS B2B",
    avatarIndex: 6,
    quote:
      "Nous avons trouvé un rythme de publication régulier sans mobiliser toute l'équipe marketing.",
  },
  {
    name: "Léa P.",
    role: "Formatrice LinkedIn",
    avatarIndex: 7,
    quote:
      "L'outil propose des angles très pertinents. Mes clients comprennent enfin quoi publier.",
  },
  {
    name: "Antoine V.",
    role: "Growth Marketer",
    avatarIndex: 8,
    quote:
      "Je pars d'une idée brute et j'obtiens une base exploitable presque instantanément.",
  },
  {
    name: "Manon C.",
    role: "Fondatrice e-commerce",
    avatarIndex: 9,
    quote:
      "La structure des posts est beaucoup plus convaincante. Je reçois plus de messages entrants.",
  },
  {
    name: "Hugo F.",
    role: "Agence Social Media",
    avatarIndex: 10,
    quote:
      "C'est devenu notre point de départ pour créer des posts LinkedIn cohérents et rapides.",
  },
];

const howItWorksSteps = [
  {
    icon: PenLine,
    title: "Décris ton activité",
    text: "Explique simplement ce que tu fais ou ce que tu proposes.",
  },
  {
    icon: Sparkles,
    title: "LinkPost génère ton contenu",
    text: "Notre IA crée un post LinkedIn optimisé pour attirer des prospects.",
  },
  {
    icon: Rocket,
    title: "Publie et génère des leads",
    text: "Copie ton post, publie-le et commence à attirer des prospects qualifiés.",
  },
];

const featureCards = [
  {
    icon: Lightbulb,
    title: "Idées de posts instantanées",
    text: "Transforme une activité, une offre ou une idée brute en angles de posts LinkedIn prêts à travailler.",
  },
  {
    icon: MessageSquareText,
    title: "Hooks pensés pour convertir",
    text: "Démarre tes publications avec des accroches conçues pour retenir l'attention de prospects qualifiés.",
  },
  {
    icon: Target,
    title: "Ton adapté à ton marché",
    text: "LinkPost ajuste le style selon ton activité, ton audience et ton niveau d'expertise.",
  },
];

const resourceCards = [
  {
    icon: BookOpen,
    title: "Guides LinkedIn",
    text: "Des repères simples pour publier plus souvent sans repartir d'une page blanche.",
  },
  {
    icon: FileText,
    title: "Templates de posts",
    text: "Des structures réutilisables pour présenter une offre, raconter un cas client ou lancer une discussion.",
  },
  {
    icon: Zap,
    title: "Bonnes pratiques",
    text: "Des conseils courts pour améliorer la clarté, le rythme et la conversion de tes publications.",
  },
];

const faqs = [
  {
    question: "LinkPost est-il gratuit ?",
    answer: "Oui, vous pouvez commencer gratuitement.",
  },
  {
    question: "Combien de temps faut-il pour générer un post ?",
    answer: "Généralement moins de 30 secondes.",
  },
  {
    question: "Puis-je modifier le contenu généré ?",
    answer: "Oui, vous pouvez modifier le texte avant publication.",
  },
  {
    question: "LinkPost fonctionne-t-il pour tous les secteurs ?",
    answer:
      "Oui, freelances, agences, consultants, coachs, SaaS, e-commerce et bien d'autres.",
  },
  {
    question: "Dois-je avoir de l'expérience sur LinkedIn ?",
    answer:
      "Non. LinkPost est conçu aussi bien pour les débutants que pour les utilisateurs avancés.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Oui. Toutes les données sont traitées de manière sécurisée.",
  },
];

type ClassNameProps = {
  className?: string;
};

function AvatarPhoto({
  index,
  className = "h-9 w-9",
}: {
  index: number;
  className?: string;
}) {
  const column = index % 4;
  const row = Math.floor(index / 4);

  return (
    <span
      className={`block shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-[0_10px_24px_rgba(15,23,42,0.14)] ${className}`}
      aria-hidden="true"
    >
      <span
        className="block h-full w-full bg-[url('/testimonial-portraits.png')] bg-[length:400%_300%]"
        style={{
          backgroundPosition: `${column * 33.333333}% ${row * 50}%`,
        }}
      />
    </span>
  );
}

function Header({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <header className="sticky top-3 z-50 mx-auto flex w-full max-w-[430px] items-center justify-between rounded-full border border-white/70 bg-white/[0.82] px-5 py-3.5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] ring-1 ring-white/70 backdrop-blur-xl sm:top-6 sm:max-w-[500px] sm:px-6 lg:max-w-[1280px] lg:px-5 lg:py-3">
      <a
        href="/"
        className="shrink-0 lg:px-3"
        aria-label="Linkaro accueil"
      >
        <BrandLogo imageClassName="h-8 w-auto sm:h-9" />
      </a>

      <nav className="hidden items-center gap-1 rounded-full bg-slate-50/70 p-1 text-sm font-bold text-slate-600 ring-1 ring-slate-200/60 lg:flex">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-full px-4 py-2.5 transition hover:bg-white hover:text-linkpost-blue hover:shadow-[0_8px_22px_rgba(15,23,42,0.08)]"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="hidden shrink-0 items-center gap-3 lg:flex">
        <a
          href={isAuthenticated ? "/dashboard" : "/auth"}
          className="rounded-full px-4 py-2.5 text-sm font-extrabold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
        >
          {isAuthenticated ? "Dashboard" : "Se connecter"}
        </a>
        <a
          href={isAuthenticated ? "/dashboard" : "/auth"}
          className="rounded-full bg-linkpost-blue px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(59,130,246,0.28)] transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 active:translate-y-px"
        >
          {isAuthenticated ? "Dashboard" : "Commencer gratuitement"}
        </a>
      </div>

      <button
        type="button"
        className="grid h-9 w-9 place-items-center rounded-full text-slate-950 transition hover:bg-slate-100 lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu size={24} strokeWidth={2.4} />
      </button>
    </header>
  );
}

function SocialProofBadge({ className = "" }: ClassNameProps) {
  return (
    <div
      className={`mx-auto inline-flex max-w-full items-center gap-3 rounded-full bg-white px-4 py-3 shadow-soft ring-1 ring-slate-100 ${className}`}
    >
      <div className="flex -space-x-2.5">
        {heroAvatarIndexes.map((avatarIndex) => (
          <AvatarPhoto
            key={avatarIndex}
            index={avatarIndex}
            className="h-8 w-8"
          />
        ))}
      </div>
      <p className="min-w-0 text-left text-[13px] leading-tight text-slate-500">
        <span className="block font-extrabold text-slate-950">
          +8 000 professionnels
        </span>
        <span>utilisent LinkPost chaque jour</span>
      </p>
    </div>
  );
}

function HeroAvatarProof({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "mt-6" : "mt-7"}>
      <p
        className={`font-extrabold text-slate-500 ${
          compact ? "text-[12px]" : "text-sm"
        }`}
      >
        Déjà adopté par des milliers de professionnels
      </p>
      <div className="mt-3 flex justify-center -space-x-2.5">
        {socialProofAvatarIndexes.map((avatarIndex) => (
          <AvatarPhoto
            key={avatarIndex}
            index={avatarIndex}
            className={compact ? "h-8 w-8" : "h-10 w-10"}
          />
        ))}
      </div>
    </div>
  );
}

function CardForm({ inputId }: { inputId: string }) {
  return (
    <AuthPromptForm
      inputId={inputId}
      rows={2}
      formClassName="mt-5 space-y-4"
      textareaClassName="min-h-[112px] w-full resize-none rounded-[1.35rem] border border-slate-100 bg-white px-5 py-5 text-[17px] font-medium leading-7 text-slate-900 shadow-[0_8px_28px_rgba(15,23,42,0.08)] outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-100 sm:min-h-[124px]"
      buttonClassName="h-16 w-full rounded-[1.1rem] bg-linkpost-blue px-6 text-[18px] font-extrabold text-white shadow-button transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 active:translate-y-px"
    />
  );
}

function BottomBadges() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 px-1">
      {cardBadges.map((badge) => (
        <span
          key={badge.label}
          className={`flex min-h-11 items-center justify-center rounded-full border px-4 text-[13px] font-extrabold shadow-lg ${badge.className}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

function MobileHeroCard() {
  return (
    <main className="mx-auto w-full max-w-[430px] rounded-[2.25rem] bg-white/[0.96] px-2 pb-8 pt-8 text-center shadow-glow ring-1 ring-white/90 backdrop-blur sm:max-w-[500px] sm:px-4 sm:pb-10 sm:pt-10">
      <SocialProofBadge />

      <h1 className="mt-8 text-[26px] font-extrabold leading-[1.18] tracking-normal text-slate-950 min-[420px]:text-[29px] sm:text-[34px]">
        <span className="block whitespace-nowrap">
          Crée des posts LinkedIn qui
        </span>
        <span className="block">attirent</span>
        <span className="block text-linkpost-blue">des prospects</span>
      </h1>

      <p className="mt-7 text-[18px] font-medium leading-7 text-slate-600 sm:text-[19px]">
        Pas juste de la visibilité, de l’acquisition.
      </p>

      <CardForm inputId="mobile-activity" />

      <p className="mt-4 text-[13px] font-bold text-slate-400 sm:text-sm">
        Gratuit. Sans carte. Résultat en 30 secondes.
      </p>

      <BottomBadges />

      <HeroAvatarProof compact />
    </main>
  );
}

function DesktopPromptForm() {
  return (
    <div className="mx-auto mt-8 flex w-full max-w-[900px] flex-col items-center 2xl:mt-10">
      <AuthPromptForm
        inputId="desktop-activity"
        rows={4}
        formClassName="flex w-full flex-col items-center"
        textareaClassName="min-h-[176px] w-full resize-none rounded-[2rem] border border-white/80 bg-white/[0.96] px-8 py-7 text-[21px] font-medium leading-8 text-slate-900 shadow-[0_28px_90px_rgba(37,99,235,0.18),0_12px_36px_rgba(15,23,42,0.08)] outline-none ring-1 ring-slate-100/80 transition placeholder:text-slate-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-100 xl:min-h-[188px] xl:px-9 xl:py-8 2xl:min-h-[210px]"
        buttonClassName="mt-5 h-[64px] w-full max-w-[540px] rounded-[1.25rem] bg-linkpost-blue px-8 text-[19px] font-extrabold text-white shadow-button transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 active:translate-y-px 2xl:mt-6 2xl:h-[66px]"
      />
      <p className="mt-5 text-[15px] font-bold text-slate-500">
        Gratuit. Sans carte. Résultat en 30 secondes.
      </p>

      <HeroAvatarProof />
    </div>
  );
}

function DesktopHero() {
  return (
    <main className="hidden w-full flex-1 items-center justify-center py-10 text-center lg:flex 2xl:py-20">
      <section className="relative mx-auto w-full max-w-[1080px]">
        <div className="pointer-events-none absolute left-1/2 top-[44%] h-[520px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.20),rgba(191,219,254,0.14)_42%,rgba(255,255,255,0)_70%)] blur-2xl" />

        <div className="relative">
          <SocialProofBadge className="shadow-[0_20px_60px_rgba(15,23,42,0.10)]" />

          <h1 className="mx-auto mt-8 max-w-[980px] text-[58px] font-extrabold leading-[1.02] tracking-normal text-slate-950 xl:text-[66px] 2xl:text-[76px]">
            Crée des posts LinkedIn qui génèrent{" "}
            <span className="text-linkpost-blue">des prospects</span>
          </h1>

          <p className="mx-auto mt-6 max-w-[720px] text-[22px] font-medium leading-9 text-slate-600 2xl:mt-7 2xl:text-[23px]">
            Pas juste de la visibilité, de l’acquisition.
          </p>

          <DesktopPromptForm />
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-[34px] font-extrabold leading-tight text-slate-950 sm:text-[44px] lg:text-[52px]">
        {title}
      </h2>
      <p className="mt-4 text-[17px] font-medium leading-8 text-slate-600 sm:text-[19px]">
        {subtitle}
      </p>
    </div>
  );
}

function Portrait({ index }: { index: number }) {
  return (
    <AvatarPhoto
      index={index}
      className="h-14 w-14 border-[3px]"
    />
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) {
  return (
    <article className="w-[320px] shrink-0 rounded-[1.75rem] bg-white/95 p-6 text-left shadow-[0_18px_55px_rgba(15,23,42,0.09)] ring-1 ring-slate-100 backdrop-blur sm:w-[360px]">
      <div className="flex items-center gap-4">
        <Portrait index={testimonial.avatarIndex} />
        <div className="min-w-0">
          <h3 className="text-[17px] font-extrabold text-slate-950">
            {testimonial.name}
          </h3>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">
            {testimonial.role}
          </p>
        </div>
      </div>
      <div
        className="mt-5 flex gap-1 text-[18px] text-amber-400"
        aria-label="Note 5 étoiles"
      >
        {"★★★★★"}
      </div>
      <p className="mt-4 text-[15px] font-medium leading-7 text-slate-600">
        “{testimonial.quote}”
      </p>
    </article>
  );
}

function TestimonialsSection() {
  const repeatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="avis" className="scroll-mt-32 py-20 sm:py-24 lg:py-28">
      <SectionHeading
        title="Avis de nos utilisateurs"
        subtitle="DÃ©couvrez comment entrepreneurs, freelances et agences utilisent LinkPost pour gÃ©nÃ©rer davantage de prospects sur LinkedIn."
      />

      <div className="testimonial-carousel relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-blue-50/80 via-blue-50/35 to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-blue-50/80 via-blue-50/35 to-transparent sm:w-20" />

        <div className="testimonial-track flex w-max gap-5 py-4 will-change-transform">
          {repeatedTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.name}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="scroll-mt-32 py-20 sm:py-24 lg:py-28">
      <SectionHeading
        title="Fonctionnalités"
        subtitle="Tout ce qu'il faut pour transformer une idée simple en post LinkedIn orienté prospects."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {featureCards.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="rounded-[2rem] bg-white/92 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(37,99,235,0.14)]"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-linkpost-blue shadow-[inset_0_0_0_1px_rgba(59,130,246,0.12)]">
                <Icon size={26} strokeWidth={2.4} />
              </div>
              <h3 className="mt-8 text-2xl font-extrabold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-4 text-[16px] font-medium leading-8 text-slate-600">
                {feature.text}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="comment-ca-marche" className="scroll-mt-32 py-20 sm:py-24 lg:py-28">
      <SectionHeading
        title="Comment ça marche"
        subtitle="Obtenez un post LinkedIn optimisé en moins de 30 secondes."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {howItWorksSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article
              key={step.title}
              className="group rounded-[2rem] bg-white/92 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(37,99,235,0.14)]"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-linkpost-blue shadow-[inset_0_0_0_1px_rgba(59,130,246,0.12)] transition group-hover:bg-linkpost-blue group-hover:text-white">
                  <Icon size={26} strokeWidth={2.4} />
                </div>
                <span className="text-sm font-extrabold text-blue-200">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-extrabold text-slate-950">
                {step.title}
              </h3>
              <p className="mt-4 text-[16px] font-medium leading-8 text-slate-600">
                {step.text}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="scroll-mt-32 py-20 sm:py-24 lg:py-28">
      <SectionHeading
        title="ChatGPT vs Linkaro"
        subtitle="Pourquoi Linkaro est plus adapté à la création de posts LinkedIn qui génèrent des prospects."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <article className="rounded-[2rem] border-2 border-red-200 bg-white/92 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
          <h3 className="text-2xl font-extrabold text-slate-950">
            ChatGPT
          </h3>
          <ul className="mt-6 space-y-4 text-[16px] font-medium leading-8 text-slate-600">
            <li>Réponses généralistes qui demandent souvent plusieurs prompts.</li>
            <li>Structure LinkedIn à retravailler pour capter l'attention.</li>
            <li>Message moins orienté prospects, problème client et CTA.</li>
          </ul>
        </article>

        <article className="rounded-[2rem] border-2 border-emerald-200 bg-white/92 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
          <h3 className="text-2xl font-extrabold text-slate-950">
            Linkaro
          </h3>
          <ul className="mt-6 space-y-4 text-[16px] font-medium leading-8 text-slate-600">
            <li>Posts pensés dès le départ pour LinkedIn et l'acquisition.</li>
            <li>Accroche, problème client, valeur et CTA structurés ensemble.</li>
            <li>Contenu plus clair pour attirer des prospects qualifiés.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-32 py-20 sm:py-24 lg:py-28">
      <SectionHeading
        title="FAQ"
        subtitle="Les réponses aux questions les plus fréquentes."
      />

      <div className="mx-auto mt-12 max-w-3xl space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-[1.5rem] bg-white/94 px-6 py-5 shadow-[0_14px_45px_rgba(15,23,42,0.07)] ring-1 ring-slate-100 open:shadow-[0_22px_60px_rgba(59,130,246,0.12)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-[17px] font-extrabold text-slate-950 [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown
                className="shrink-0 text-slate-400 transition group-open:rotate-180 group-open:text-linkpost-blue"
                size={22}
                strokeWidth={2.4}
              />
            </summary>
            <p className="mt-4 text-[15px] font-medium leading-7 text-slate-600">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function ResourcesSection() {
  return (
    <section id="ressources" className="scroll-mt-32 py-20 sm:py-24 lg:py-28">
      <SectionHeading
        title="Ressources"
        subtitle="Des repères courts pour publier plus vite, plus clairement et avec plus d'impact."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {resourceCards.map((resource) => {
          const Icon = resource.icon;

          return (
            <article
              key={resource.title}
              className="rounded-[2rem] bg-white/92 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.08)] ring-1 ring-slate-100"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-linkpost-blue">
                <Icon size={26} strokeWidth={2.4} />
              </div>
              <h3 className="mt-8 text-2xl font-extrabold text-slate-950">
                {resource.title}
              </h3>
              <p className="mt-4 text-[16px] font-medium leading-8 text-slate-600">
                {resource.text}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200/70 py-10">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <a
            href="#"
            className="inline-flex"
            aria-label="Linkaro accueil"
          >
            <BrandLogo imageClassName="h-10 w-auto" />
          </a>
          <p className="mt-3 max-w-md text-sm font-medium leading-6 text-slate-500">
            Crée des posts LinkedIn qui génèrent des prospects.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-slate-500">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="transition hover:text-linkpost-blue"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <a className="transition hover:text-linkpost-blue" href="mailto:contact@linkpost.tech">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default async function Home() {
  let isAuthenticated = false;

  if (isServerSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    isAuthenticated = Boolean(user);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 pt-3 sm:px-6 sm:pt-8 lg:px-8">
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(219,234,254,0.74)_0%,rgba(239,246,255,0.92)_35%,rgba(255,255,255,0.96)_100%)] lg:block" />
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-[520px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.34),rgba(191,219,254,0.20)_48%,rgba(255,255,255,0)_72%)] blur-3xl lg:block" />
      <div className="pointer-events-none absolute bottom-[-26rem] left-1/2 hidden h-[700px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.13),rgba(255,255,255,0)_68%)] blur-2xl lg:block" />

      <Header isAuthenticated={isAuthenticated} />

      <div className="relative mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-[1280px] flex-col items-center gap-12 pt-12 sm:min-h-[calc(100vh-7rem)] sm:gap-20 sm:pt-16 lg:gap-0 lg:pt-0">
        <div className="lg:hidden">
          <MobileHeroCard />
        </div>
        <DesktopHero />
      </div>

      <div className="relative mx-auto w-full max-w-[1280px]">
        <FeaturesSection />
        <TestimonialsSection />
        <HowItWorksSection />
        <ComparisonSection />
        <FaqSection />
        <ResourcesSection />
      </div>
      <Footer />
    </div>
  );
}
