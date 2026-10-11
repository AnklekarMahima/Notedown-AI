import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

export default async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params:  Promise<{ id: string }>;
}) {
  await auth.protect();
  const { id } =await params;
  return <RoomProvider roomID={id}>{children}</RoomProvider>;
}
