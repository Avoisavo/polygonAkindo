import { Home, Compass, BookOpen, Clock, Search, Command } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  const navigationItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: Compass, label: 'Explore', active: false },
    { icon: BookOpen, label: 'Library', active: false },
    { icon: Clock, label: 'History', active: false },
  ];

  const conversationSections = [
    {
      title: 'Tomorrow',
      items: [
        "What's something you've learne...",
        "If you could teleport anywhere...",
        "What's one goal you want to a...",
      ],
    },
    {
      title: '7 Days Ago',
      items: [
        'Ask me anything weird or rand...',
        'How are you feeling today, reall...',
        "What's one habit you wish you...",
      ],
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img src="/landing/polygatelogo.png" alt="PolyGate" className="w-8 h-8 object-contain" />
          <span className="text-lg font-semibold text-gray-900">PolyGate</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 font-mono">
            <Command className="w-3 h-3 inline" />K
          </kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2 space-y-1">
        {navigationItems.map((item) => {
          const content = (
            <>
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </>
          );

          if (item.label === 'Home') {
            return (
              <Link
                key={item.label}
                href="/register"
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {content}
            </button>
          );
        })}
      </nav>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto px-2 mt-6">
        {conversationSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors truncate"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

    
    </div>
  );
};

export default Sidebar;
