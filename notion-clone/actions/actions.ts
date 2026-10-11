"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
    await auth.protect(); //throws to login screen if not logged in

    const {sessionClaims} = await auth();

    const docCollectionRef = adminDb.collection("documents"); //refer to the documents collection in firestore
    //newdoc={title: "New Doc"}
    const docRef = await docCollectionRef.add({
        title: "New Doc"
    });

    await adminDb.collection("users").doc(sessionClaims?.email!).collection('rooms').doc(docRef.id).set({
        userId: sessionClaims?.email,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id,
    });

    return {docId: docRef.id};
}

export async function deleteDocument(roomId: string){
    auth.protect();
    console.log("deleteDocument", roomId);
    try{
        //delete doc reference itself
        await adminDb.collection("documents").doc(roomId).delete();
        const query = await adminDb
          .collectionGroup("rooms")
          .where("roomId", "==", roomId)
          .get();

        //delete room ref in user's collection, for every user in the room
        const batch = adminDb.batch();
        query.docs.forEach((doc)=>{
            batch.delete(doc.ref);
        })

        await batch.commit();

        //delete room in liveblocks
        await liveblocks.deleteRoom(roomId);
        return {success: true};

    }catch(error){
        console.log(error);
        return {success: false};
    }
}

export async function inviteUserToDocument(roomId: string, email : string){
    auth.protect();
    console.log("inviteUserToDocument", roomId, email);
    try {
        await adminDb
        .collection("users")
        .doc(email)
        .collection("rooms")
        .doc(roomId)
        .set({
            userId: email,
            role: "editor",
            createdAt : new Date(),
            roomId,
        })
        return {success: true};

    } catch (error) {
        console.log(error);
        return {success: false};
    }
}

export async function removeUserFromDocument(roomId: string, email : string){
    auth.protect();
    console.log("inviteUserToDocument", roomId, email);
    try {
        await adminDb
        .collection("users")
        .doc(email)
        .collection("rooms")
        .doc(roomId)
        .delete();
        
        return {success: true};

    } catch (error) {
        console.log(error);
        return {success: false};
    }
}