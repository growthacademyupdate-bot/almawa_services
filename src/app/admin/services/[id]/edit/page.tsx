import { ServiceForm } from "@/components/admin/ServiceForm";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  await dbConnect();
  
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  const query = isValidObjectId ? { _id: id } : { slug: id };
  
  const service = await Service.findOne(query).lean();
  
  if (!service) {
    notFound();
  }

  // Convert MongoDB ObjectId and Date fields to strings for client components
  const initialData = {
    ...service,
    _id: service._id.toString(),
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold font-display text-foreground">
          Edit Service
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update the service information below.
        </p>
      </div>

      <ServiceForm initialData={initialData as any} isEdit={true} />
    </div>
  );
}
