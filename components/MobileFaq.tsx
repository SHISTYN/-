import React from 'react';

const MobileFaq: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-fade-in">
             <div className="bg-white dark:bg-[#121212] p-8 rounded-3xl max-w-md border border-gray-100 dark:border-white/5 shadow-2xl relative z-50">
                <h3 className="text-2xl font-display font-bold mb-4 text-gray-900 dark:text-white">Приложение или Сайт?</h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400 font-light leading-relaxed">Это PWA. Добавь на экран "Домой" и пользуйся как нативным приложением.</p>
                <button onClick={onClose} className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:scale-[1.02] transition-transform active:scale-95">Понятно</button>
             </div>
        </div>
    );
};

export default MobileFaq;