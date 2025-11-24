import React, { useState, useEffect } from 'react';
import { Home, PlusSquare, LayoutTemplate, User, Wallet, Lock } from 'lucide-react';
import { AppTab } from './types';
import { Button } from './components/Button';

// Views
import HomeView from './views/Home';
import CreateVideoView from './views/CreateVideo';
import ProjectsView from './views/Projects';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.Home);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [checkingKey, setCheckingKey] = useState<boolean>(true);

  // Check API Key on mount
  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    setCheckingKey(true);
    try {
      if (window.aistudio) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        // Fallback for dev env without aistudio wrapper
        setHasApiKey(true);
      }
    } catch (e) {
      console.error("Error checking API key", e);
    } finally {
      setCheckingKey(false);
    }
  };

  const handleConnect = async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        await checkKey();
      }
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  // Render content based on tab
  const renderContent = () => {
    if (checkingKey) {
        return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    }

    if (!hasApiKey) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                    <Lock size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Required</h1>
                <p className="text-slate-600 mb-8 max-w-md">
                    To generate stunning videos with Veo, you need to connect your Google AI Studio account with a valid billing project.
                </p>
                <Button onClick={handleConnect} rightIcon={<Wallet size={16}/>}>
                    Connect API Key
                </Button>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="mt-4 text-sm text-slate-500 hover:text-indigo-600 underline">
                    Learn about billing
                </a>
            </div>
        );
    }

    switch (currentTab) {
      case AppTab.Home:
        return <HomeView onNavigate={setCurrentTab} />;
      case AppTab.Create:
        return <CreateVideoView onNavigate={setCurrentTab} />;
      case AppTab.Projects:
        return <ProjectsView />;
      case AppTab.Templates:
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
                <LayoutTemplate size={48} className="mb-4 opacity-50"/>
                <p>Templates coming soon!</p>
            </div>
        );
      default:
        return <HomeView onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 md:pl-20">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">V</div>
            <span className="font-bold text-slate-900">VideoGen</span>
        </div>
        {!hasApiKey && !checkingKey && (
             <Button variant="ghost" size="sm" onClick={handleConnect} className="text-xs">Connect Key</Button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto min-h-screen relative">
        {renderContent()}
      </main>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 bg-white border-r border-slate-200 flex-col items-center py-6 z-30">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-8 shadow-indigo-200 shadow-lg">V</div>
        
        <div className="flex flex-col space-y-4 w-full px-2">
          <NavIcon 
            icon={<Home size={24} />} 
            label="Home" 
            active={currentTab === AppTab.Home} 
            onClick={() => setCurrentTab(AppTab.Home)} 
          />
          <NavIcon 
            icon={<PlusSquare size={24} />} 
            label="Create" 
            active={currentTab === AppTab.Create} 
            onClick={() => setCurrentTab(AppTab.Create)} 
          />
          <NavIcon 
            icon={<LayoutTemplate size={24} />} 
            label="Templates" 
            active={currentTab === AppTab.Templates} 
            onClick={() => setCurrentTab(AppTab.Templates)} 
          />
          <NavIcon 
            icon={<User size={24} />} 
            label="Projects" 
            active={currentTab === AppTab.Projects} 
            onClick={() => setCurrentTab(AppTab.Projects)} 
          />
        </div>

        <div className="mt-auto mb-4">
             {/* Profile or settings could go here */}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-30 pb-safe">
        <NavIconMobile icon={<Home size={24} />} label="Home" active={currentTab === AppTab.Home} onClick={() => setCurrentTab(AppTab.Home)} />
        <NavIconMobile icon={<PlusSquare size={24} />} label="Create" active={currentTab === AppTab.Create} onClick={() => setCurrentTab(AppTab.Create)} />
        <NavIconMobile icon={<LayoutTemplate size={24} />} label="Templates" active={currentTab === AppTab.Templates} onClick={() => setCurrentTab(AppTab.Templates)} />
        <NavIconMobile icon={<User size={24} />} label="Projects" active={currentTab === AppTab.Projects} onClick={() => setCurrentTab(AppTab.Projects)} />
      </nav>
    </div>
  );
};

const NavIcon: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all w-full
      ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-50'}
    `}
    title={label}
  >
    {icon}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

const NavIconMobile: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-1 transition-colors
      ${active ? 'text-indigo-600' : 'text-slate-400'}
    `}
  >
    {icon}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

export default App;