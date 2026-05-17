import { Heart, MapPin, Sparkles, Users, Camera, Landmark, Trees, Waves } from 'lucide-react'
import { PageTransition } from '@/components/animation/PageTransition'
import { StaggerContainer } from '@/components/animation/StaggerContainer'
import { MotionWrapper } from '@/components/animation/MotionWrapper'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/constants/site'

const stats = [
  { value: '15+', label: 'Curated Places' },
  { value: '700+', label: 'Years of History' },
  { value: '9', label: 'Historic Bridges' },
  { value: '45m', label: 'Meppeler Toren Height' },
]

const team = [
  { name: 'Lotte de Vries', role: 'Founder & Curator', initials: 'LV' },
  { name: 'Bram Jansen', role: 'Community Manager', initials: 'BJ' },
  { name: 'Sophie Bakker', role: 'Content Creator', initials: 'SB' },
]

const missions = [
  {
    icon: MapPin,
    title: 'Discover Local Gems',
    description: 'From the historic Drukkerijmuseum to the canalside terraces of De Wheem — we uncover the spots that make Meppel truly special.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Every recommendation comes from real locals who know and love Meppel. Whether it is the best apple pie or a hidden gallery, our community shares what matters.',
  },
  {
    icon: Sparkles,
    title: 'Beautifully Curated',
    description: 'We believe discovery should be as beautiful as the places themselves. Meppel deserves a platform that matches its charm.',
  },
]

const highlights = [
  {
    icon: Landmark,
    title: 'Klein Mokum',
    description: 'Meppel earned the nickname "Little Jerusalem" due to its rich Jewish heritage and history. The city has been a welcoming place for centuries.',
  },
  {
    icon: Waves,
    title: 'Canals & Bridges',
    description: 'Nine historic drawbridges span the canals, including the iconic Tipbrug and Prinsenbrug. The "IAMEPPEL" letters on the water have become a beloved photo spot.',
  },
  {
    icon: Trees,
    title: 'Gateway to Drenthe',
    description: 'Nestled in southwest Drenthe, Meppel is the perfect base for exploring Giethoorn, the Weerribben-Wieden National Park, and the ancient forests of Drenthe.',
  },
]

export default function AboutPage() {
  return (
    <PageTransition>
      <StaggerContainer>
        <div className="pt-24 md:pt-28 pb-24">
          <section className="px-6 md:px-8 max-w-4xl mx-auto text-center mb-24">
            <MotionWrapper>
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-8">
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-semibold text-text-primary mb-6">
                Built with love for{' '}
                <span className="text-gradient">Meppel</span>
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                {SITE_CONFIG.name} is a passion project dedicated to showcasing the very best
                of Meppel, Drenthe. From the 45-metre Meppeler Toren to the weekly Thursday market
                on the Marktplein, this charming city with its canals, drawbridges, and centuries
                of printing heritage deserves a platform as beautiful as itself.
              </p>
            </MotionWrapper>
          </section>

          <section className="px-6 md:px-8 max-w-5xl mx-auto mb-24">
            <div className="grid md:grid-cols-3 gap-8">
              {missions.map((item) => {
                const Icon = item.icon
                return (
                  <MotionWrapper key={item.title}>
                    <div className="text-center p-8 rounded-2xl glass border border-border">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-3">{item.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </MotionWrapper>
                )
              })}
            </div>
          </section>

          <section className="px-6 md:px-8 mb-24">
            <div className="max-w-5xl mx-auto rounded-3xl border border-border bg-gradient-to-br from-accent/5 via-bg-primary to-accent/5 p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat) => (
                  <MotionWrapper key={stat.label}>
                    <div className="text-center">
                      <p className="text-3xl md:text-4xl font-display font-semibold text-gradient">
                        {stat.value}
                      </p>
                      <p className="text-sm text-text-secondary mt-2">{stat.label}</p>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 md:px-8 max-w-5xl mx-auto mb-24">
            <MotionWrapper>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-primary mb-4">
                  Why Meppel?
                </h2>
                <p className="text-text-secondary max-w-md mx-auto">
                  A city with character, history, and a warmth you can only experience in Drenthe.
                </p>
              </div>
            </MotionWrapper>
            <div className="grid md:grid-cols-3 gap-8">
              {highlights.map((item) => {
                const Icon = item.icon
                return (
                  <MotionWrapper key={item.title}>
                    <div className="p-8 rounded-2xl glass border border-border">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-3">{item.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </MotionWrapper>
                )
              })}
            </div>
          </section>

          <section className="px-6 md:px-8 max-w-4xl mx-auto mb-24">
            <MotionWrapper>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-primary mb-4">
                  Meet the team
                </h2>
                <p className="text-text-secondary max-w-md mx-auto">
                  A small team of Meppel enthusiasts dedicated to sharing the beauty of our city.
                </p>
              </div>
            </MotionWrapper>
            <div className="grid md:grid-cols-3 gap-6">
              {team.map((member) => (
                <MotionWrapper key={member.name}>
                  <div className="text-center p-8 rounded-2xl glass border border-border">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-lg font-semibold text-accent">{member.initials}</span>
                    </div>
                    <h3 className="font-semibold text-text-primary">{member.name}</h3>
                    <p className="text-sm text-text-tertiary mt-1">{member.role}</p>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          </section>

          <section className="px-6 md:px-8 max-w-3xl mx-auto text-center">
            <MotionWrapper>
              <div className="rounded-3xl border border-border bg-gradient-to-br from-accent/5 to-transparent p-12">
                <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-primary mb-4">
                  Know a hidden gem?
                </h2>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  Help us grow the collection. Submit a place you love in Meppel.
                </p>
                <a href="/submit">
                  <Button variant="primary" size="lg">
                    <Camera className="w-4 h-4" />
                    Suggest a Place
                  </Button>
                </a>
              </div>
            </MotionWrapper>
          </section>
        </div>
      </StaggerContainer>
    </PageTransition>
  )
}
