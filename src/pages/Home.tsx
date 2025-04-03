
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  A Hub for 3D Printing <span className="text-primary">Makers</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Join our vibrant community of passionate makers who are building, customizing, and sharing their 3D printer builds.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/explore">
                  <Button size="lg" className="bg-primary text-primary-foreground">Explore Projects</Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" variant="outline">Join Community</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-muted shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-70"></div>
                <div className="flex h-full items-center justify-center p-4">
                  <div className="rounded-lg bg-background/80 p-6 backdrop-blur-sm">
                    <h3 className="mb-2 text-lg font-medium">Latest Community Builds</h3>
                    <p className="text-sm text-muted-foreground">Check out the amazing creations from our community</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="aspect-square rounded-md bg-primary/10"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Categories</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover a vast collection of 3D printer parts and modifications in our curated categories
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            {['Hotends', 'Extruders', 'Frames'].map((category, i) => (
              <div key={i} className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg border bg-card shadow-sm">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-primary"></div>
                </div>
                <h3 className="text-xl font-bold">{category}</h3>
                <p className="text-sm text-muted-foreground text-center">Explore our collection of high-quality {category.toLowerCase()}</p>
                <Button variant="ghost">View {category}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Join MakersImpulse?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We're more than just a 3D printing community - we're a hub for innovation, collaboration, and shared knowledge.
                </p>
              </div>
              <ul className="grid gap-2">
                {[
                  'Connect with like-minded 3D printing enthusiasts',
                  'Share your printer builds and modifications',
                  'Get help and advice from experienced makers',
                  'Discover new parts and printing techniques'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/community">
                  <Button size="lg">Join Our Community</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-muted shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-70"></div>
                <div className="flex h-full items-center justify-center p-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold">1,000+</div>
                    <div className="mt-2 text-xl">Active Community Members</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
