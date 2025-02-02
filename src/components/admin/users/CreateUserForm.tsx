import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { RoleSelector } from './RoleSelector';
import { UserRole } from '@/components/auth/types';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  role: z.enum(['subscriber', 'maker', 'admin', 'super_admin'] as const),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

export const CreateUserForm = () => {
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'subscriber',
    },
  });

  const onSubmit = async (data: CreateUserForm) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            role: data.role,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast.success('User created successfully');
      form.reset();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800/50 border border-white/10 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Create New User</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email"
                    className="bg-gray-700/50 border-white/10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="password"
                    className="bg-gray-700/50 border-white/10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    className="bg-gray-700/50 border-white/10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <RoleSelector
                    currentRole={field.value}
                    onRoleChange={(role: UserRole) => field.onChange(role)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-[#ff0abe]/20 hover:bg-[#ff0abe]/30 text-white"
          >
            Create User
          </Button>
        </form>
      </Form>
    </div>
  );
};