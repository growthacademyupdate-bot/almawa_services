import { ServiceForm } from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold font-display text-foreground">
          Add New Service
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new service offering to display on the public website.
        </p>
      </div>

      <ServiceForm />
    </div>
  );
}
