'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import { User, Mail, Bookmark, Heart, List, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PlaceCard } from '@/components/places/PlaceCard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageTransition } from '@/components/animation/PageTransition'
import { StaggerContainer } from '@/components/animation/StaggerContainer'
import { MotionWrapper } from '@/components/animation/MotionWrapper'
import { DialogRoot, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { Place, List as UserList } from '@/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface ProfileData {
  user: SupabaseUser | null
  savedPlaces: Place[]
  userLists: UserList[]
}

async function fetchProfileData(): Promise<ProfileData> {
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    return { user: null, savedPlaces: [], userLists: [] }
  }

  const { getUserSaves, getUserLists } = await import('@/lib/supabase/queries')
  const [saves, lists] = await Promise.all([
    getUserSaves(authUser.id),
    getUserLists(authUser.id),
  ])

  return {
    user: authUser,
    savedPlaces: saves?.map((s: { place?: Place }) => s.place).filter((p): p is Place => Boolean(p)) ?? [],
    userLists: lists ?? [],
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('saved')
  const [createListOpen, setCreateListOpen] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')

  const profilePromise = fetchProfileData()
  const { user, savedPlaces, userLists } = use(profilePromise)

  async function handleCreateList() {
    if (!newListName.trim()) return
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data } = await supabase
        .from('lists')
        .insert({ name: newListName.trim(), description: newListDescription.trim() || null })
        .select()
        .single()
      if (data) {
        window.location.reload()
      }
      setNewListName('')
      setNewListDescription('')
      setCreateListOpen(false)
    } catch {}
  }

  if (!user) {
    return (
      <PageTransition>
        <div className="pt-24 md:pt-28 pb-24 px-6 md:px-8 max-w-4xl mx-auto">
          <EmptyState
            icon="bookmark"
            title="Sign in to view your profile"
            description="Save your favorite places, create lists, and leave reviews."
            action={{
              label: 'Sign In',
              onClick: () => router.push('/auth/login'),
            }}
          />
        </div>
      </PageTransition>
    )
  }

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <PageTransition>
      <StaggerContainer>
        <div className="pt-24 md:pt-28 pb-24 px-6 md:px-8 max-w-5xl mx-auto">
          <MotionWrapper>
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-card border border-border flex items-center justify-center shrink-0">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={userName} width={80} height={80} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-text-tertiary" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-text-primary">{userName}</h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </MotionWrapper>

          <TabsRoot value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="saved">
                <Heart className="w-4 h-4" />
                Saved Places
              </TabsTrigger>
              <TabsTrigger value="lists">
                <List className="w-4 h-4" />
                Lists
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Bookmark className="w-4 h-4" />
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="saved">
              {savedPlaces.length === 0 ? (
                <EmptyState
                  icon="bookmark"
                  title="No saved places yet"
                  description="Start exploring and save places you love."
                  action={{ label: 'Explore', onClick: () => router.push('/explore') }}
                />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPlaces.map((place) => (
                    <PlaceCard key={place.id} place={place} variant="standard" />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="lists">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-text-secondary">
                  {userLists.length} list{userLists.length !== 1 ? 's' : ''}
                </p>
                <DialogRoot open={createListOpen} onOpenChange={setCreateListOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <Plus className="w-4 h-4" />
                      Create List
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a new list</DialogTitle>
                      <DialogDescription>
                        Organize your favorite places into custom lists.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="List name"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                      />
                      <Input
                        placeholder="Description (optional)"
                        value={newListDescription}
                        onChange={(e) => setNewListDescription(e.target.value)}
                      />
                      <Button
                        onClick={handleCreateList}
                        disabled={!newListName.trim()}
                        className="w-full"
                      >
                        Create List
                      </Button>
                    </div>
                  </DialogContent>
                </DialogRoot>
              </div>

              {userLists.length === 0 ? (
                <EmptyState
                  icon="inbox"
                  title="No lists yet"
                  description="Create your first list to organize saved places."
                />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {userLists.map((list) => (
                    <Card key={list.id} variant="glass" className="p-5">
                      <h3 className="font-semibold text-text-primary">{list.name}</h3>
                      {list.description && (
                        <p className="text-sm text-text-secondary mt-1">{list.description}</p>
                      )}
                      <p className="text-xs text-text-tertiary mt-3">
                        {list._count?.places ?? 0} places
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              <EmptyState
                icon="inbox"
                title="No reviews yet"
                description="Share your experiences by leaving reviews."
                action={{ label: 'Explore places', onClick: () => router.push('/explore') }}
              />
            </TabsContent>
          </TabsRoot>
        </div>
      </StaggerContainer>
    </PageTransition>
  )
}
