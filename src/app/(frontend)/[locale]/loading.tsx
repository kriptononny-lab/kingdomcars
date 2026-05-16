import { Container } from '@/components/layout/Container';

/**
 * App-router loading boundary. Renders during navigation transitions and
 * initial RSC streaming. Kept minimal — visual stand-in only.
 */
export default function Loading() {
  return (
    <Container
      as="section"
      className="flex min-h-[60vh] items-center justify-center"
      aria-busy="true"
      aria-live="polite"
    >
      <div aria-hidden="true" className="bg-surface-card h-1 w-48 overflow-hidden rounded-full">
        <div className="bg-gold h-full w-1/3 motion-safe:animate-[loadingBar_1.2s_ease-in-out_infinite]" />
      </div>
      <span className="sr-only">Loading...</span>
    </Container>
  );
}
