
import React, { useState } from 'react';
import { UserSettings, Article } from '../types';
import { ARTICLES, CONNECTION_QUESTIONS, ARTICLE_CATEGORIES } from '../constants';
import { Sparkles, BookOpen, RefreshCw, X, Send, Filter, ChevronLeft } from 'lucide-react';
import { getRelationshipAdvice } from '../geminiService';

interface UnionViewProps {
  settings: UserSettings;
}

const UnionView: React.FC<UnionViewProps> = ({ settings }) => {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [dailyQuestion, setDailyQuestion] = useState(CONNECTION_QUESTIONS[0]);
  const [coachMode, setCoachMode] = useState(false);
  const [chatTopic, setChatTopic] = useState('');
  const [coachResponse, setCoachResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const shuffleQuestion = () => {
    const others = CONNECTION_QUESTIONS.filter(q => q !== dailyQuestion);
    setDailyQuestion(others[Math.floor(Math.random() * others.length)]);
  };

  const askCoach = async () => {
    if (!chatTopic) return;
    setLoading(true);
    setCoachResponse(null);
    try {
      const advice = await getRelationshipAdvice(chatTopic);
      setCoachResponse(advice);
    } catch (err) {
      setCoachResponse("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = activeCategory === 'Tout' 
    ? ARTICLES 
    : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right duration-500 pb-20">
      <header className="text-center pt-2">
        <h1 className="text-3xl font-serif text-[var(--primary-color)]">Smart Union</h1>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Intelligence Émotionnelle</p>
      </header>

      <section className="bg-white p-7 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="bg-[var(--secondary-color)]/10 text-[var(--primary-color)] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            Inspiration Quotidienne
          </div>
          <p className="text-2xl font-serif text-slate-800 leading-snug min-h-[100px] flex items-center px-4">
            "{dailyQuestion}"
          </p>
          <button 
            onClick={shuffleQuestion}
            className="mt-8 flex items-center gap-2 text-gray-300 active:text-[var(--primary-color)] transition-colors active:rotate-180 duration-500"
          >
            <RefreshCw size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Nouvelle Question</span>
          </button>
        </div>
      </section>

      {/* AI Coach Card */}
      <section 
        onClick={() => setCoachMode(true)}
        className="bg-slate-900 p-7 rounded-[3rem] text-white shadow-xl active:scale-95 transition-transform cursor-pointer relative overflow-hidden"
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Sparkles size={24} className="text-[var(--secondary-color)]" />
          </div>
          <div>
            <h3 className="font-serif text-xl">Coach Smart AI</h3>
            <p className="text-white/70 text-xs">Parlez de votre couple.</p>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </section>

      {/* Articles Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gray-400" />
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Articles & Conseils</h2>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {ARTICLE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-[9px] font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredArticles.map(article => (
            <div 
              key={article.id} 
              onClick={() => setActiveArticle(article)}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col active:scale-98 transition-transform"
            >
              <div 
                className="h-40 bg-cover bg-center" 
                style={{ backgroundImage: `url(${article.image})` }}
              ></div>
              <div className="p-6">
                <span className="text-[9px] font-bold text-[var(--secondary-color)] uppercase tracking-widest mb-2 block">{article.category}</span>
                <h3 className="text-xl font-serif text-[var(--primary-color)] mb-2">{article.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{article.lead}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Article Modal - Updated to stay BELOW header */}
      {activeArticle && (
        <div className="fixed inset-0 z-[1500] bg-white overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-500 pt-16">
          <button 
            onClick={() => setActiveArticle(null)}
            className="fixed top-20 left-6 p-3 bg-white/90 backdrop-blur-md rounded-full z-[1600] shadow-xl border border-gray-100 text-slate-800"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="h-64 w-full">
            <img src={activeArticle.image} className="w-full h-full object-cover" alt={activeArticle.title} />
          </div>
          <div className="p-8 space-y-6 max-w-lg mx-auto pb-32">
            <div>
              <span className="text-[10px] font-bold text-[var(--secondary-color)] uppercase tracking-[0.2em] mb-2 block">{activeArticle.category}</span>
              <h2 className="text-3xl font-serif text-[var(--primary-color)] leading-tight">{activeArticle.title}</h2>
            </div>
            <p className="text-lg font-serif italic text-slate-500 border-l-4 border-[var(--secondary-color)] pl-6">
              {activeArticle.lead}
            </p>
            <div className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap font-light">
              {activeArticle.content}
            </div>
          </div>
        </div>
      )}

      {/* AI Coach Modal - Updated to stay BELOW header */}
      {coachMode && (
        <div className="fixed inset-0 z-[1500] bg-white flex flex-col pt-16 animate-in slide-in-from-bottom duration-500">
           <header className="p-6 flex justify-between items-center border-b border-gray-50">
              <h2 className="text-xl font-serif text-[var(--primary-color)]">Assistant Smart AI</h2>
              <button onClick={() => setCoachMode(false)} className="p-2 bg-gray-50 rounded-full text-gray-400">
                <X size={20} />
              </button>
           </header>

           <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
              <div className="bg-gray-50 p-6 rounded-[2rem] text-sm text-slate-700">
                "Bonjour ! En quoi puis-je vous aider aujourd'hui ? Je peux vous conseiller sur la communication, le partage des tâches ou vos projets."
              </div>

              {coachResponse && (
                <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-[var(--secondary-color)]/20 animate-in fade-in">
                  <span className="text-[9px] font-bold text-gray-300 uppercase block mb-3">Réponse du Coach</span>
                  <p className="text-base font-serif text-slate-800 italic">{coachResponse}</p>
                </div>
              )}

              {loading && (
                <div className="flex justify-center py-10 animate-pulse">
                   <div className="w-2 h-2 bg-slate-300 rounded-full mx-1"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full mx-1"></div>
                   <div className="w-2 h-2 bg-slate-300 rounded-full mx-1"></div>
                </div>
              )}
           </div>

           <div className="p-6 border-t border-gray-100 flex gap-3 pb-10 bg-white">
              <input 
                className="flex-1 bg-gray-50 rounded-2xl px-5 py-4 outline-none border border-transparent focus:border-[var(--primary-color)]/20 shadow-inner text-sm"
                placeholder="Votre question..."
                value={chatTopic}
                onChange={(e) => setChatTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askCoach()}
              />
              <button 
                onClick={askCoach}
                disabled={loading}
                className="bg-slate-900 text-[var(--secondary-color)] p-4 rounded-2xl shadow-xl active:scale-90 transition-transform disabled:opacity-50"
              >
                <Send size={20} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default UnionView;
