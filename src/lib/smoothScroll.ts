export async function initSmoothScroll(): Promise<() => void> {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    return () => undefined;
  }

  const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('lenis'),
  ]);

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    touchMultiplier: 2,
  });

  const onScroll = () => ScrollTrigger.update();
  lenis.on('scroll', onScroll);

  const ticker = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  return () => {
    lenis.off('scroll', onScroll);
    lenis.destroy();
    gsap.ticker.remove(ticker);
  };
}
