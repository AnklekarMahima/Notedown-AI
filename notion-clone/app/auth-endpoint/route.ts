import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await auth.protect();

  const { sessionClaims } = await auth();
  const { room } = await request.json();

  // Check if required session values exist
  const email = sessionClaims?.email;
  const fullName = sessionClaims?.fullName;
  const avatar = sessionClaims?.image;

  if (!email || !fullName || !avatar) {
    return NextResponse.json(
      { message: "Unauthorized: Missing user session information." },
      { status: 401 }
    );
  }

  const session = liveblocks.prepareSession(email, {
    userInfo: {
      name: fullName,
      email,
      avatar,
    },
  });

  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", email)
    .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();
    console.log("You are authorised!");
    return new Response(body, { status });
  } else {
    return NextResponse.json(
      { message: "You are not in this Room" },
      { status: 403 }
    );
  }
}