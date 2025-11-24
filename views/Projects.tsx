import React from 'react';
import { Clock, MoreHorizontal } from 'lucide-react';

const projects = [
  { id: 1, title: 'Futuristic City Demo', date: '2 hours ago', duration: '0:05', status: 'Completed', thumbnail: 'https://picsum.photos/300/169?random=1' },
  { id: 2, title: 'Product Showcase', date: '1 day ago', duration: '0:05', status: 'Completed', thumbnail: 'https://picsum.photos/300/169?random=2' },
  { id: 3, title: 'Birthday Greeting', date: '3 days ago', duration: '0:05', status: 'Draft', thumbnail: 'https://picsum.photos/300/169?random=3' },
];

const ProjectsView: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
        <div className="flex space-x-2">
            <select className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 text-slate-600">
                <option>All Projects</option>
                <option>Completed</option>
                <option>Drafts</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative aspect-video bg-slate-100">
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover"/>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
                    {project.duration}
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 truncate pr-2">{project.title}</h3>
                    <button className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                <div className="flex items-center text-xs text-slate-500 mb-3">
                    <Clock size={12} className="mr-1" /> {project.date}
                </div>
                <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                        {project.status}
                    </span>
                    <button className="text-indigo-600 text-sm font-medium hover:underline">
                        Edit
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsView;