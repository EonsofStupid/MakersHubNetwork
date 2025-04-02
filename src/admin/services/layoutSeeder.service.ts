
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Layout } from '@/admin/types/layout.types';
import { layoutSkeletonService } from './layoutSkeleton.service';

class LayoutSeederService {
  /**
   * Check if core layouts exist and create them if they don't
   */
  async ensureCoreLayoutsExist(): Promise<void> {
    console.log('Checking for core layouts...');
    
    // Check and create main topnav layout
    await this.ensureLayoutExists('topnav', 'main', this.createMainTopNavLayout());
    
    // Check and create footer layout
    await this.ensureLayoutExists('footer', 'main', this.createMainFooterLayout());
    
    // Check and create usermenu layout
    await this.ensureLayoutExists('usermenu', 'main', this.createUserMenuLayout());
    
    console.log('Core layouts check completed');
  }
  
  /**
   * Check if a specific layout exists and create it if not
   */
  private async ensureLayoutExists(
    type: string, 
    scope: string, 
    defaultLayout: Layout
  ): Promise<void> {
    try {
      // Check if layout exists
      const existingLayout = await layoutSkeletonService.getByTypeAndScope(type, scope);
      
      if (!existingLayout?.data) {
        console.log(`Creating default ${type} layout for ${scope} scope...`);
        
        // Convert layout to layout skeleton format
        const result = await layoutSkeletonService.create({
          name: defaultLayout.name,
          type: defaultLayout.type,
          scope: defaultLayout.scope,
          layout_json: {
            components: defaultLayout.components,
            version: 1
          },
          is_active: true,
          version: 1,
          description: `Default ${type} layout for ${scope}`
        });
        
        if (result.success) {
          console.log(`Created default ${type} layout successfully`);
        } else {
          console.error(`Failed to create default ${type} layout:`, result.error);
        }
      } else {
        console.log(`${type} layout for ${scope} scope already exists`);
      }
    } catch (error) {
      console.error(`Error ensuring ${type} layout exists:`, error);
    }
  }
  
  /**
   * Create the default main topnav layout
   */
  private createMainTopNavLayout(): Layout {
    return {
      id: uuidv4(),
      name: 'Main TopNav',
      type: 'topnav',
      scope: 'main',
      components: [
        {
          id: 'main-topnav-root',
          type: 'nav',
          props: {
            className: 'mainnav-container mainnav-header mainnav-gradient mainnav-morph'
          },
          children: [
            {
              id: 'main-topnav-effects',
              type: 'div',
              props: {
                className: 'mainnav-effects-wrapper absolute inset-0 w-full h-full overflow-hidden'
              },
              children: [
                {
                  id: 'main-topnav-effects-inner',
                  type: 'div',
                  props: {
                    className: 'w-full h-full pointer-events-none'
                  }
                }
              ]
            },
            {
              id: 'main-topnav-content',
              type: 'div',
              props: {
                className: 'container mx-auto px-4'
              },
              children: [
                {
                  id: 'main-topnav-row',
                  type: 'div',
                  props: {
                    className: 'flex items-center justify-between py-4'
                  },
                  children: [
                    {
                      id: 'main-topnav-logo',
                      type: 'Logo'
                    },
                    {
                      id: 'main-topnav-navigation',
                      type: 'NavigationItems'
                    },
                    {
                      id: 'main-topnav-actions',
                      type: 'div',
                      props: {
                        className: 'flex items-center gap-4'
                      },
                      children: [
                        {
                          id: 'main-topnav-search',
                          type: 'SearchButton'
                        },
                        {
                          id: 'main-topnav-auth',
                          type: 'AuthSection'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      version: 1
    };
  }
  
  /**
   * Create the default main footer layout
   */
  private createMainFooterLayout(): Layout {
    return {
      id: uuidv4(),
      name: 'Main Footer',
      type: 'footer',
      scope: 'main',
      components: [
        {
          id: 'main-footer-root',
          type: 'footer',
          props: {
            className: 'bg-background/80 border-t border-border py-8 mt-auto'
          },
          children: [
            {
              id: 'main-footer-container',
              type: 'div',
              props: {
                className: 'container mx-auto px-4'
              },
              children: [
                {
                  id: 'main-footer-content',
                  type: 'div',
                  props: {
                    className: 'grid grid-cols-1 md:grid-cols-3 gap-8'
                  },
                  children: [
                    {
                      id: 'main-footer-branding',
                      type: 'div',
                      children: [
                        {
                          id: 'main-footer-logo',
                          type: 'Logo',
                          props: {
                            size: 'sm'
                          }
                        },
                        {
                          id: 'main-footer-tagline',
                          type: 'p',
                          props: {
                            className: 'mt-2 text-sm text-muted-foreground',
                            children: 'A hub for passionate makers building and customizing 3D printers.'
                          }
                        }
                      ]
                    },
                    {
                      id: 'main-footer-links',
                      type: 'div',
                      props: {
                        className: 'space-y-4'
                      },
                      children: [
                        {
                          id: 'main-footer-links-title',
                          type: 'h3',
                          props: {
                            className: 'text-sm font-medium',
                            children: 'Quick Links'
                          }
                        },
                        {
                          id: 'main-footer-links-list',
                          type: 'ul',
                          props: {
                            className: 'space-y-2 text-sm'
                          },
                          children: [
                            {
                              id: 'main-footer-link-1',
                              type: 'li',
                              children: [
                                {
                                  id: 'main-footer-link-1-a',
                                  type: 'a',
                                  props: {
                                    href: '/builds',
                                    className: 'text-muted-foreground hover:text-foreground transition-colors',
                                    children: 'Browse Builds'
                                  }
                                }
                              ]
                            },
                            {
                              id: 'main-footer-link-2',
                              type: 'li',
                              children: [
                                {
                                  id: 'main-footer-link-2-a',
                                  type: 'a',
                                  props: {
                                    href: '/parts',
                                    className: 'text-muted-foreground hover:text-foreground transition-colors',
                                    children: 'Parts Library'
                                  }
                                }
                              ]
                            },
                            {
                              id: 'main-footer-link-3',
                              type: 'li',
                              children: [
                                {
                                  id: 'main-footer-link-3-a',
                                  type: 'a',
                                  props: {
                                    href: '/community',
                                    className: 'text-muted-foreground hover:text-foreground transition-colors',
                                    children: 'Community'
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: 'main-footer-social',
                      type: 'div',
                      props: {
                        className: 'space-y-4'
                      },
                      children: [
                        {
                          id: 'main-footer-social-title',
                          type: 'h3',
                          props: {
                            className: 'text-sm font-medium',
                            children: 'Connect With Us'
                          }
                        },
                        {
                          id: 'main-footer-social-links',
                          type: 'div',
                          props: {
                            className: 'flex space-x-4'
                          },
                          children: [
                            {
                              id: 'main-footer-social-1',
                              type: 'a',
                              props: {
                                href: '#',
                                className: 'text-muted-foreground hover:text-foreground',
                                'aria-label': 'Twitter'
                              },
                              children: [
                                {
                                  id: 'main-footer-social-1-icon',
                                  type: 'TwitterIcon',
                                  props: {
                                    className: 'h-5 w-5'
                                  }
                                }
                              ]
                            },
                            {
                              id: 'main-footer-social-2',
                              type: 'a',
                              props: {
                                href: '#',
                                className: 'text-muted-foreground hover:text-foreground',
                                'aria-label': 'GitHub'
                              },
                              children: [
                                {
                                  id: 'main-footer-social-2-icon',
                                  type: 'GithubIcon',
                                  props: {
                                    className: 'h-5 w-5'
                                  }
                                }
                              ]
                            },
                            {
                              id: 'main-footer-social-3',
                              type: 'a',
                              props: {
                                href: '#',
                                className: 'text-muted-foreground hover:text-foreground',
                                'aria-label': 'Discord'
                              },
                              children: [
                                {
                                  id: 'main-footer-social-3-icon',
                                  type: 'DiscordIcon',
                                  props: {
                                    className: 'h-5 w-5'
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'main-footer-copyright',
                  type: 'div',
                  props: {
                    className: 'mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground'
                  },
                  children: [
                    {
                      id: 'main-footer-copyright-text',
                      type: 'p',
                      props: {
                        children: `© ${new Date().getFullYear()} MakersImpulse. All rights reserved.`
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      version: 1
    };
  }
  
  /**
   * Create the default user menu layout
   */
  private createUserMenuLayout(): Layout {
    return {
      id: uuidv4(),
      name: 'User Menu',
      type: 'usermenu',
      scope: 'main',
      components: [
        {
          id: 'usermenu-root',
          type: 'div',
          props: {
            className: 'flex items-center gap-4'
          },
          children: [
            {
              id: 'usermenu-component',
              type: 'UserMenu'
            }
          ]
        }
      ],
      version: 1
    };
  }
}

export const layoutSeederService = new LayoutSeederService();
