
import React, { useState } from 'react';
import { BookOpen, GraduationCap, FileText, Download, Loader2, Lock, ChevronRight } from 'lucide-react';
import { CURRICULUM_STANDARDS, EDUCATION_LEVELS, EDUCATION_TOPICS } from '../constants';
import { generateStudyGuideFromApi } from '../services/geminiService';
import { getApiErrorState } from '../services/apiErrorHandler';
import { EducationContent, ErrorState } from '../types';
import { jsPDF } from 'jspdf';

interface StudyGuideGeneratorProps {
  isPro: boolean;
  onAttemptAccess: () => void;
}

const StudyGuideGenerator: React.FC<StudyGuideGeneratorProps> = ({ isPro, onAttemptAccess }) => {
  const [topic, setTopic] = useState(EDUCATION_TOPICS[0]);
  const [curriculum, setCurriculum] = useState(CURRICULUM_STANDARDS[0].id);
  const [level, setLevel] = useState(EDUCATION_LEVELS[1]);
  const [type, setType] = useState<'guide' | 'curriculum'>('guide');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EducationContent | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);

  const handleGenerate = async () => {
    if (!isPro) {
      onAttemptAccess();
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const curriculumLabel = CURRICULUM_STANDARDS.find(c => c.id === curriculum)?.label || curriculum;
      const content = await generateStudyGuideFromApi(topic, curriculumLabel, level, type);
      setResult(content);
    } catch (e) {
      setError(getApiErrorState(e));
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const margin = 15;
    let y = 20;

    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    doc.text(result.title, margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`${result.curriculum} | ${result.level}`, margin, y);
    y += 15;

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Overview", margin, y);
    y += 8;
    doc.setFontSize(10);
    const overviewLines = doc.splitTextToSize(result.overview, 180);
    doc.text(overviewLines, margin, y);
    y += (overviewLines.length * 5) + 10;

    result.modules.forEach(mod => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(12);
        doc.setTextColor(0, 51, 102);
        doc.text(mod.title, margin, y);
        y += 7;
        
        doc.setFontSize(10);
        doc.setTextColor(0);
        mod.content.forEach(point => {
            const lines = doc.splitTextToSize(`• ${point}`, 175);
            if (y + (lines.length * 5) > 280) { doc.addPage(); y = 20; }
            doc.text(lines, margin + 5, y);
            y += (lines.length * 5) + 2;
        });
        y += 5;
    });

    doc.save(`${result.title.replace(/\s+/g, '_')}_Guide.pdf`);
  };

  return (
    <section aria-labelledby="education-title" className="mt-16 animate-slide-in" style={{ animationDelay: '0.6s' }}>
      <div className="text-center mb-8">
        <h2 id="education-title" className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center">
          <GraduationCap className="w-8 h-8 mr-3 text-primary-500" />
          Education & Training Hub
        </h2>
        <p className="mt-2 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
          Generate professional study guides and curriculum syllabi for students and staff.
          Specialized support for <strong>City & Guilds (South Africa)</strong> and international standards.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/80 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Topic</label>
              <div className="relative">
                <select 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors dark:text-white"
                >
                  {EDUCATION_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Curriculum Standard</label>
              <select 
                value={curriculum} 
                onChange={(e) => setCurriculum(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors dark:text-white"
              >
                {CURRICULUM_STANDARDS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Education Level</label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors dark:text-white"
              >
                {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Document Type</label>
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setType('guide')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${type === 'guide' ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                >
                  Study Guide
                </button>
                <button
                  onClick={() => setType('curriculum')}
                  className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${type === 'curriculum' ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                >
                  Curriculum
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-primary-600 rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BookOpen className="mr-2 h-5 w-5" />}
                {isLoading ? 'Creating Guide...' : `Generate ${type === 'guide' ? 'Study Guide' : 'Curriculum'}`}
              </span>
              {!isPro && (
                 <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-20 backdrop-blur-[1px]">
                     <Lock className="w-5 h-5 text-white mr-2" />
                     <span className="text-sm font-medium">Business Plan</span>
                 </div>
              )}
            </button>
          </div>
          
           {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-center">
               <p className="text-red-800 dark:text-red-200 font-semibold">{error.title}</p>
               <p className="text-red-600 dark:text-red-300 text-sm">{error.message}</p>
            </div>
          )}
        </div>

        {result && (
          <div className="bg-slate-50 dark:bg-slate-900/30 p-6 sm:p-8 animate-fade-in">
            <div className="flex justify-between items-start mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{result.title}</h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mt-1">{result.curriculum} • {result.level}</p>
              </div>
              <button onClick={downloadPDF} className="p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors" title="Download PDF">
                <Download size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <section>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center"><FileText size={18} className="mr-2" /> Overview</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{result.overview}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">Core Modules</h4>
                    <div className="space-y-4">
                        {result.modules.map((mod, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h5 className="font-bold text-primary-700 dark:text-primary-400 mb-2 text-sm uppercase tracking-wide">{mod.title}</h5>
                                <ul className="list-none space-y-1.5">
                                    {mod.content.map((c, i) => (
                                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start">
                                            <ChevronRight size={14} className="mt-1 mr-1.5 flex-shrink-0 text-slate-400" />
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                  </section>

                  <div className="space-y-8">
                       <section className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-lg border border-amber-100 dark:border-amber-800/50">
                        <h4 className="text-lg font-bold text-amber-900 dark:text-amber-400 mb-3">Key Vocabulary</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.keyVocabulary.map((word, i) => (
                                <span key={i} className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
                                    {word}
                                </span>
                            ))}
                        </div>
                      </section>

                      <section>
                         <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">Practical Exercises</h4>
                         <ul className="space-y-2">
                             {result.practicalExercises.map((ex, i) => (
                                 <li key={i} className="flex items-start p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                     <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold mr-3">{i + 1}</span>
                                     <span className="text-sm text-slate-700 dark:text-slate-300">{ex}</span>
                                 </li>
                             ))}
                         </ul>
                      </section>
                  </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyGuideGenerator;
