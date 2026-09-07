import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  component: ServicesLayout,
});

function ServicesLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // If we're at exactly /services, render the index; otherwise render child routes.
  // But since /services is the layout AND we have /services/$slug children, we
  // need a leaf index component. TanStack handles it via services.index.tsx.
  return <Outlet />;
}
