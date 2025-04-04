import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/auth/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/constants/logLevel';

export default function LinkAccount() {
  const { linkExternalAccount, isLoading, error, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider');
  const { toast } = useToast();
  const logger = useLogger('LinkAccount', { category: LogCategory.AUTH });

  useEffect(() => {
    if (!provider) {
      logger.warn('Provider missing from query parameters');
      toast({
        title: 'Provider Missing',
        description: 'No provider was specified in the URL.',
        variant: 'destructive',
      });
      router.push('/settings/profile');
      return;
    }

    const linkAccount = async () => {
      logger.info(`Attempting to link account with provider: ${provider}`);
      const success = await linkExternalAccount(provider);

      if (success) {
        logger.success(`Successfully linked account with provider: ${provider}`);
        toast({
          title: 'Account Linked',
          description: `Successfully linked your account with ${provider}.`,
        });
      } else if (error) {
        logger.error(`Failed to link account with provider: ${provider}`, { details: error });
        toast({
          title: 'Link Failed',
          description: `Failed to link account with ${provider}: ${error}`,
          variant: 'destructive',
        });
      } else {
        logger.warn(`Link account attempt with provider ${provider} did not return success or error.`);
      }
      router.push('/settings/profile');
    };

    if (user) {
      linkAccount();
    } else {
      logger.warn('User not authenticated, redirecting to home page.');
      router.push('/');
    }
  }, [provider, linkExternalAccount, router, toast, user, error, logger]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Linking Account...</CardTitle>
          <CardDescription>Please wait while we link your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {isLoading ? (
            <span className="loading loading-dots loading-lg"></span>
          ) : (
            <Button variant="outline" disabled>
              Redirecting...
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
