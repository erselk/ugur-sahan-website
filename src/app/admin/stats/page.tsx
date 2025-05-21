// 'use client';
// 
// import { useEffect, useState } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import { motion } from 'framer-motion';
// import { Loader2, Users, MessageSquare, FileText, Briefcase, TrendingUp, Calendar } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar
// } from 'recharts';
// 
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );
// 
// interface Stats {
//   totalViews: number;
//   totalMessages: number;
//   totalWritings: number;
//   totalProjects: number;
//   monthlyViews: { date: string; views: number }[];
//   monthlyMessages: { date: string; count: number }[];
//   topWritings: { title: string; views: number }[];
//   topProjects: { title: string; views: number }[];
// }
// 
// export default function StatsPage() {
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
// 
//   useEffect(() => {
//     fetchStats();
//   }, [timeRange]);
// 
//   const fetchStats = async () => {
//     try {
//       // Toplam istatistikler
//       const [
//         { count: totalViews },
//         { count: totalMessages },
//         { count: totalWritings },
//         { count: totalProjects }
//       ] = await Promise.all([
//         supabase.from('page_views').select('*', { count: 'exact', head: true }),
//         supabase.from('messages').select('*', { count: 'exact', head: true }),
//         supabase.from('writings').select('*', { count: 'exact', head: true }),
//         supabase.from('projects').select('*', { count: 'exact', head: true })
//       ]);
// 
//       // Aylık görüntülenme istatistikleri
//       const startDate = new Date();
//       switch (timeRange) {
//         case 'week':
//           startDate.setDate(startDate.getDate() - 7);
//           break;
//         case 'month':
//           startDate.setMonth(startDate.getMonth() - 1);
//           break;
//         case 'year':
//           startDate.setFullYear(startDate.getFullYear() - 1);
//           break;
//       }
// 
//       const { data: monthlyViews } = await supabase
//         .from('page_views')
//         .select('created_at')
//         .gte('created_at', startDate.toISOString())
//         .order('created_at');
// 
//       // Aylık mesaj istatistikleri
//       const { data: monthlyMessages } = await supabase
//         .from('messages')
//         .select('created_at')
//         .gte('created_at', startDate.toISOString())
//         .order('created_at');
// 
//       // En çok görüntülenen yazılar
//       const { data: topWritings } = await supabase
//         .from('writings')
//         .select('title, views')
//         .order('views', { ascending: false })
//         .limit(5);
// 
//       // En çok görüntülenen projeler
//       const { data: topProjects } = await supabase
//         .from('projects')
//         .select('title, views')
//         .order('views', { ascending: false })
//         .limit(5);
// 
//       // Verileri işle
//       const processMonthlyData = (data: { created_at: string }[]) => {
//         const grouped = data.reduce((acc: { [key: string]: number }, item) => {
//           const date = new Date(item.created_at).toISOString().split('T')[0];
//           acc[date] = (acc[date] || 0) + 1;
//           return acc;
//         }, {});
// 
//         return Object.entries(grouped).map(([date, count]) => ({
//           date,
//           count
//         }));
//       };
// 
//       setStats({
//         totalViews: totalViews || 0,
//         totalMessages: totalMessages || 0,
//         totalWritings: totalWritings || 0,
//         totalProjects: totalProjects || 0,
//         monthlyViews: processMonthlyData(monthlyViews || []).map(item => ({
//           date: item.date,
//           views: item.count
//         })),
//         monthlyMessages: processMonthlyData(monthlyMessages || []),
//         topWritings: topWritings || [],
//         topProjects: topProjects || []
//       });
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
// 
//   if (isLoading || !stats) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
//         <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
//       </div>
//     );
//   }
// 
//   const statCards = [
//     {
//       title: 'Toplam Görüntülenme',
//       value: stats.totalViews,
//       icon: Users,
//       bgColor: 'bg-blue-500'
//     },
//     {
//       title: 'Toplam Mesaj',
//       value: stats.totalMessages,
//       icon: MessageSquare,
//       bgColor: 'bg-green-500'
//     },
//     {
//       title: 'Toplam Yazı',
//       value: stats.totalWritings,
//       icon: FileText,
//       bgColor: 'bg-purple-500'
//     },
//     {
//       title: 'Toplam Proje',
//       value: stats.totalProjects,
//       icon: Briefcase,
//       bgColor: 'bg-orange-500'
//     }
//   ];
// 
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-[var(--color-primary)]">
//           İstatistikler
//         </h1>
//         <div className="flex items-center gap-4">
//           <select
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
//             className="px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
//           >
//             <option value="week">Son 7 Gün</option>
//             <option value="month">Son 30 Gün</option>
//             <option value="year">Son 365 Gün</option>
//           </select>
//         </div>
//       </div>
// 
//       {/* İstatistik Kartları */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statCards.map((stat, index) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             className="bg-[var(--color-bg-secondary)] rounded-lg p-6"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[var(--color-fg-muted)] mb-1">{stat.title}</p>
//                 <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
//               </div>
//               <div className={`p-3 rounded-lg ${stat.bgColor}`}>
//                 <stat.icon className="w-6 h-6 text-white" />
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
// 
//       {/* Grafikler */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Görüntülenme Grafiği */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="bg-[var(--color-bg-secondary)] rounded-lg p-6"
//         >
//           <h2 className="text-lg font-semibold mb-4">Görüntülenme İstatistikleri</h2>
//           <div className="h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={stats.monthlyViews}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
//                 <XAxis
//                   dataKey="date"
//                   stroke="var(--color-fg-muted)"
//                   tick={{ fill: 'var(--color-fg-muted)' }}
//                 />
//                 <YAxis
//                   stroke="var(--color-fg-muted)"
//                   tick={{ fill: 'var(--color-fg-muted)' }}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: 'var(--color-bg)',
//                     border: '1px solid var(--color-border)',
//                     borderRadius: '0.5rem'
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="views"
//                   stroke="var(--color-primary)"
//                   strokeWidth={2}
//                   dot={{ fill: 'var(--color-primary)' }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </motion.div>
// 
//         {/* Mesaj Grafiği */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="bg-[var(--color-bg-secondary)] rounded-lg p-6"
//         >
//           <h2 className="text-lg font-semibold mb-4">Mesaj İstatistikleri</h2>
//           <div className="h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={stats.monthlyMessages}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
//                 <XAxis
//                   dataKey="date"
//                   stroke="var(--color-fg-muted)"
//                   tick={{ fill: 'var(--color-fg-muted)' }}
//                 />
//                 <YAxis
//                   stroke="var(--color-fg-muted)"
//                   tick={{ fill: 'var(--color-fg-muted)' }}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: 'var(--color-bg)',
//                     border: '1px solid var(--color-border)',
//                     borderRadius: '0.5rem'
//                   }}
//                 />
//                 <Bar
//                   dataKey="count"
//                   fill="var(--color-primary)"
//                   radius={[4, 4, 0, 0]}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </motion.div>
//       </div>
// 
//       {/* En Çok Görüntülenenler */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* En Çok Görüntülenen Yazılar */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-[var(--color-bg-secondary)] rounded-lg p-6"
//         >
//           <h2 className="text-lg font-semibold mb-4">En Çok Görüntülenen Yazılar</h2>
//           <div className="space-y-4">
//             {stats.topWritings.map((writing, index) => (
//               <div
//                 key={writing.title}
//                 className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-bg)]"
//               >
//                 <div className="flex items-center gap-4">
//                   <span className="text-2xl font-bold text-[var(--color-fg-muted)]">
//                     #{index + 1}
//                   </span>
//                   <span className="font-medium">{writing.title}</span>
//                 </div>
//                 <span className="text-[var(--color-fg-muted)]">
//                   {writing.views} görüntülenme
//                 </span>
//               </div>
//             ))}
//           </div>
//         </motion.div>
// 
//         {/* En Çok Görüntülenen Projeler */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-[var(--color-bg-secondary)] rounded-lg p-6"
//         >
//           <h2 className="text-lg font-semibold mb-4">En Çok Görüntülenen Projeler</h2>
//           <div className="space-y-4">
//             {stats.topProjects.map((project, index) => (
//               <div
//                 key={project.title}
//                 className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-bg)]"
//               >
//                 <div className="flex items-center gap-4">
//                   <span className="text-2xl font-bold text-[var(--color-fg-muted)]">
//                     #{index + 1}
//                   </span>
//                   <span className="font-medium">{project.title}</span>
//                 </div>
//                 <span className="text-[var(--color-fg-muted)]">
//                   {project.views} görüntülenme
//                 </span>
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

export default function StatsPage() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <p className="text-[var(--color-fg-muted)] text-lg">
        Henüz nasıl bir istatistik sistemi yapacağıma karar vermedim.
      </p>
    </div>
  );
}