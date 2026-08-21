const filteredLogs = ['Running in dev mode', 'lit-html is in dev mode'];

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'dist/test/**/*.test.js',

  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto',

  /** Amount of browsers to run concurrently */
  // concurrentBrowsers: 2,

  /**
   * One test file at a time. The component settles through `requestAnimationFrame`
   * (MutationObserver and ResizeObserver deliveries), and the tests wait the same
   * way. Chrome throttles animation frames in backgrounded pages, so as soon as two
   * test files share a browser instance the pages that are not in front stall and
   * every `nextFrame()` wait times out. Serialising keeps the running page in front;
   * the whole suite takes about two seconds.
   */
  concurrency: 1,

});
