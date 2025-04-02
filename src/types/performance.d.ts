
interface MemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface Performance {
  memory?: MemoryInfo;
}

interface SimpleTimer {
  end(): number;
}
