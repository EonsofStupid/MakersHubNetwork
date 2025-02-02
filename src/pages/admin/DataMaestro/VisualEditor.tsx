import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const VisualEditor = () => {
  const session = useSession();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (!session || !profile?.visual_editor_enabled) {
    navigate('/');
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Visual Editor</h1>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                {/* Editor Canvas */}
                <div className="border rounded-lg p-4 min-h-[600px]">
                  Editor Canvas
                </div>
              </div>
              <div>
                {/* Sidebar */}
                <div className="border rounded-lg p-4">
                  Editor Tools
                </div>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default VisualEditor;