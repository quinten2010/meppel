'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, Mail, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showToast } from '@/components/ui/toast'
import { PageTransition } from '@/components/animation/PageTransition'
import { SITE_CONFIG } from '@/lib/constants/site'

function isAuthError(err: unknown): err is { message: string } {
  return typeof err === 'object' && err !== null && 'message' in err
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
        if (error) throw error
        showToast({
          type: 'success',
          title: 'Check your email',
          description: 'We sent you a confirmation link.',
        })
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            showToast({
              type: 'warning',
              title: 'Email not confirmed',
              description: 'Please check your inbox for the confirmation link.',
            })
            return
          }
          throw error
        }
        router.push('/profile')
        router.refresh()
      }
    } catch (err: unknown) {
      showToast({
        type: 'error',
        title: 'Authentication failed',
        description: isAuthError(err) ? err.message : 'Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      showToast({
        type: 'error',
        title: 'Google sign-in failed',
        description: isAuthError(err) ? err.message : 'Please try again.',
      })
      setIsGoogleLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl glass-strong border border-border p-8 md:p-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="text-3xl font-bold tracking-tight text-gradient">
                {SITE_CONFIG.name}
              </Link>
              <p className="text-sm text-text-tertiary mt-2">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </p>
            </div>

            {/* Google Sign In */}
            <Button
              variant="secondary"
              size="lg"
              className="w-full mb-4"
              onClick={handleGoogleSignIn}
              isLoading={isGoogleLoading}
            >
              <Globe className="w-4 h-4" />
              Continue with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-bg-elevated px-3 text-text-tertiary">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                <Mail className="w-4 h-4" />
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            {/* Toggle Sign Up / Sign In */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-text-tertiary hover:text-accent transition-colors"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
