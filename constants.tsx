
import { Article } from './types';

export const ARTICLE_CATEGORIES = ['Tout', 'Communication', 'Vie Quotidienne', 'Finances', 'Planning', 'Intimité'];

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    category: 'Communication',
    title: "L'art de l'écoute active",
    lead: "L'écoute active n'est pas simplement le fait de se taire. C'est un engagement total envers la compréhension du message de votre partenaire.",
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop',
    content: `Le premier obstacle à une bonne communication est la distraction. Posez votre téléphone, éteignez la télévision et tournez votre corps vers votre partenaire. 
              Souvent, nous préparons notre défense ou notre argument pendant que l'autre parle encore. Essayez de suspendre votre jugement. 
              Une technique puissante consiste à dire : "Si je comprends bien, ce que tu ressens c'est...".`
  },
  {
    id: 'art-2',
    category: 'Vie Quotidienne',
    title: "Le Pouvoir des Petites Attentions",
    lead: "On pense souvent qu'il faut un grand voyage pour raviver la flamme. La science dit le contraire.",
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop',
    content: `Un SMS gentil à midi, un post-it sur le miroir, ou simplement préparer le thé de l'autre sans qu'il le demande. Ces dépôts sur le compte bancaire émotionnel sont la clé.`
  },
  {
    id: 'art-3',
    category: 'Finances',
    title: "Parler d'argent sans se fâcher",
    lead: "L'argent est l'une des principales sources de tension dans un couple. Voici comment en faire un projet commun.",
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000&auto=format&fit=crop',
    content: `L'argent ne représente pas seulement des chiffres, il représente la sécurité, la liberté ou le statut. Pour éviter les conflits, planifiez un "rendez-vous financier" mensuel.
              Utilisez ce moment non pas pour vous critiquer mutuellement sur les dépenses passées, mais pour rêver aux projets futurs. Définissez des objectifs d'épargne clairs pour vos vacances, votre logement ou votre retraite.`
  },
  {
    id: 'art-4',
    category: 'Planning',
    title: "Organiser l'imprévu",
    lead: "L'agenda partagé n'est pas qu'un outil logistique, c'est une déclaration d'intention : je fais de la place pour toi.",
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop',
    content: `Le manque de temps est le plus grand ennemi du couple moderne. En notant vos sorties, vos dîners ou même vos moments de calme dans Smart Planning, vous sacralisez ces instants.
              Conseil d'expert : bloquez au moins une soirée par semaine pour vous deux uniquement, sans écrans et sans parler des obligations du foyer.`
  },
  {
    id: 'art-5',
    category: 'Intimité',
    title: "Cultiver la carte du monde de l'autre",
    lead: "Connaissez-vous vraiment les espoirs et les peurs actuels de votre partenaire ?",
    image: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=1000&auto=format&fit=crop',
    content: `Le concept de "Carte du Tendre" ou "Love Maps" de John Gottman consiste à connaître intimement le monde intérieur de son partenaire. 
              Les gens changent. Ce qui passionnait votre conjoint il y a deux ans n'est peut-être plus d'actualité. Posez des questions ouvertes chaque jour pour mettre à jour votre carte de l'autre.`
  }
];

export const CONNECTION_QUESTIONS = [
  "Quelle est la petite chose que j'ai faite cette semaine qui t'a fait te sentir aimé(e) ?",
  "Si nous pouvions partir en voyage demain, sans limite de budget, où irions-nous ?",
  "Quelle est la qualité que tu admires le plus chez moi aujourd'hui ?",
  "Qu'est-ce qui te stresse le plus en ce moment et comment puis-je t'aider ?",
  "Quel est ton meilleur souvenir de nous deux cette année ?",
  "Quelle nouvelle activité aimerais-tu que l'on teste ensemble ?",
  "Comment te sens-tu par rapport à notre équilibre vie pro / vie perso ?"
];

export const THEME_COLORS = {
  classic: { primary: '#1f4e79', secondary: '#D4AF37' },
  pink: { primary: '#db2777', secondary: '#f472b6' },
  dark: { primary: '#1a1c23', secondary: '#D4AF37' }
};

export const DEFAULT_EVENT_CATEGORIES = ["Moments Ensemble", "Important", "Famille"];

export const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  "Moments Ensemble": "#D4AF37",
  "Important": "#EF4444",
  "Famille": "#10B981"
};

export const PRESET_COLORS = [
  "#D4AF37", // Gold
  "#EF4444", // Red
  "#10B981", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F59E0B", // Orange
  "#06B6D4", // Teal
  "#000000", // Black
];
