// 'use client';
// 
// import { useEffect, useState } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import { motion } from 'framer-motion';
// import { Loader2, Briefcase, Plus, Edit2, Trash2, Search, Eye, EyeOff, ExternalLink } from 'lucide-react';
// import { format } from 'date-fns';
// import { tr } from 'date-fns/locale';
// import Link from 'next/link';
// import Image from 'next/image';
// 
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );
// 
// interface Project {
//   id: number;
//   title: string;
//   slug: string;
//   description: string;
//   content: string;
//   image_url: string;
//   project_url: string;
//   github_url: string;
//   technologies: string[];
//   created_at: string;
//   updated_at: string;
//   is_published: boolean;
//   views: number;
// }
// 
// export default function ProjectsPage() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
// 
//   useEffect(() => {
//     fetchProjects();
//   }, []);
// 
//   const fetchProjects = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('projects')
//         .select('*')
//         .order('created_at', { ascending: false });
// 
//       if (error) throw error;
//       setProjects(data || []);
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
// 
//   const handleTogglePublish = async (projectId: number, currentStatus: boolean) => {
//     try {
//       const { error } = await supabase
//         .from('projects')
//         .update({ is_published: !currentStatus })
//         .eq('id', projectId);
// 
//       if (error) throw error;
// 
//       setProjects(projects.map(project =>
//         project.id === projectId ? { ...project, is_published: !currentStatus } : project
//       ));
//     } catch (error) {
//       console.error('Error toggling publish status:', error);
//     }
//   };
// 
//   const handleDeleteProject = async (projectId: number) => {
//     if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return;
// 
//     try {
//       const { error } = await supabase
//         .from('projects')
//         .delete()
//         .eq('id', projectId);
// 
//       if (error) throw error;
// 
//       setProjects(projects.filter(project => project.id !== projectId));
//     } catch (error) {
//       console.error('Error deleting project:', error);
//     }
//   };
// 
//   const filteredProjects = projects.filter(project =>
//     project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
//   );
// 
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
//         <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
//       </div>
//     );
//   }
// 
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-[var(--color-primary)]">
//           Projeler
//         </h1>
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-fg-muted)]" />
//             <input
//               type="text"
//               placeholder="Projelerde ara..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent w-64"
//             />
//           </div>
//           <Link
//             href="/admin/projects/new"
//             className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors"
//           >
//             <Plus className="w-5 h-5" />
//             <span>Yeni Proje</span>
//           </Link>
//         </div>
//       </div>
// 
//       <div className="grid gap-6">
//         {filteredProjects.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center py-12 bg-[var(--color-bg-secondary)] rounded-lg"
//           >
//             <Briefcase className="w-12 h-12 mx-auto mb-4 text-[var(--color-fg-muted)] opacity-50" />
//             <p className="text-[var(--color-fg-muted)]">Henüz proje bulunmuyor.</p>
//           </motion.div>
//         ) : (
//           filteredProjects.map((project) => (
//             <motion.div
//               key={project.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden"
//             >
//               <div className="grid md:grid-cols-[300px,1fr] gap-6">
//                 {/* Proje Görseli */}
//                 <div className="relative h-[200px] md:h-full">
//                   <Image
//                     src={project.image_url}
//                     alt={project.title}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
// 
//                 {/* Proje Detayları */}
//                 <div className="p-6">
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h2 className="text-xl font-semibold truncate">{project.title}</h2>
//                         {project.is_published ? (
//                           <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500">
//                             Yayında
//                           </span>
//                         ) : (
//                           <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500">
//                             Taslak
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-[var(--color-fg-muted)] mb-4 line-clamp-2">
//                         {project.description}
//                       </p>
//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {project.technologies.map((tech) => (
//                           <span
//                             key={tech}
//                             className="px-2 py-1 text-xs rounded-full bg-[var(--color-bg-hover)] text-[var(--color-fg-muted)]"
//                           >
//                             {tech}
//                           </span>
//                         ))}
//                       </div>
//                       <div className="flex items-center gap-4 text-sm text-[var(--color-fg-muted)]">
//                         <span>
//                           {format(new Date(project.created_at), 'd MMMM yyyy', { locale: tr })}
//                         </span>
//                         <span>•</span>
//                         <span>{project.views} görüntülenme</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Link
//                         href={`/admin/projects/edit/${project.id}`}
//                         className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
//                         title="Düzenle"
//                       >
//                         <Edit2 className="w-5 h-5" />
//                       </Link>
//                       <button
//                         onClick={() => handleTogglePublish(project.id, project.is_published)}
//                         className={`p-2 rounded-lg transition-colors ${
//                           project.is_published
//                             ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
//                             : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
//                         }`}
//                         title={project.is_published ? 'Yayından kaldır' : 'Yayınla'}
//                       >
//                         {project.is_published ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                       <button
//                         onClick={() => handleDeleteProject(project.id)}
//                         className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
//                         title="Sil"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
// 
//                   {/* Proje Linkleri */}
//                   <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[var(--color-border)]">
//                     {project.project_url && (
//                       <a
//                         href={project.project_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-2 text-[var(--color-primary)] hover:opacity-80 transition-opacity"
//                       >
//                         <ExternalLink className="w-4 h-4" />
//                         <span>Projeyi Görüntüle</span>
//                       </a>
//                     )}
//                     {project.github_url && (
//                       <a
//                         href={project.github_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
//                       >
//                         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
//                           <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
//                         </svg>
//                         <span>GitHub</span>
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

export default function ProjectsPage() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <p className="text-[var(--color-fg-muted)] text-lg">
        Henüz nasıl bir proje sistemi yapacağıma karar vermedim.
      </p>
    </div>
  );
}