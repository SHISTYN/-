import React from 'react';

interface Props {
    theme: 'dark' | 'light';
}

const AppBackground: React.FC<Props> = ({ theme }) => {
    return (
        <>
            <div className={`fixed inset-0 z-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-[#050505]">
                    <div className="absolute top-[-40%] left-[-20%] w-[80vw] h-[80vw] bg-indigo-900/10 rounded-full blur-[150px] animate-aurora mix-blend-screen"></div>
                    <div className="absolute bottom-[-40%] right-[-20%] w-[80vw] h-[80vw] bg-purple-900/10 rounded-full blur-[150px] animate-aurora mix-blend-screen" style={{ animationDelay: '-10s' }}></div>
                    <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-amber-900/5 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen"></div>
                </div>
            </div>
            
            <div className={`fixed inset-0 z-0 bg-slate-50 transition-opacity duration-1000 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50"></div>
            </div>
        </>
    );
};

export default AppBackground;