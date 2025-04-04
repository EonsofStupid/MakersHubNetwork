import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/constants/logLevel';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ResetPassword() {
  const logger = useLogger('ResetPasswordPage', { category: LogCategory.AUTH });
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  type FormSchemaType = z.infer<typeof formSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormSchemaType) => {
    setLoading(true);
    try {
      if (!token) {
        toast({
          title: "Invalid Request",
          description: "Missing reset token.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.resetPassword({
        newPassword: data.password,
        token: token,
      });

      if (error) {
        logger.error("Password reset failed", { details: error });
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        logger.info("Password reset successfully");
        toast({
          title: "Success",
          description: "Password reset successfully! Redirecting...",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      logger.error("Unexpected error during password reset", { details: error });
      toast({
        title: "Unexpected Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password?.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword?.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={loading} onClick={handleSubmit(onSubmit)}>
            {loading ? "Submitting..." : "Reset Password"}
          </Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
