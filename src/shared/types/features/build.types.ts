
// Build types
export interface BuildType {
  id: string;
  name: string;
}

export interface BuildConfig {
  buildType: BuildType;
  options: Record<string, unknown>;
}
