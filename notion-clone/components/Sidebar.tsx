'use client';

import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./NewDocumentButton"; //check this
import {useCollection} from "react-firebase-hooks/firestore"; 
import {useUser} from "@clerk/nextjs";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { collectionGroup, query, where, DocumentData } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import SidebarOption from "./SidebarOption"; //done

interface RoomDocument extends DocumentData { //to match the structure of the document in firestore
    createdAt: string;
    role: 'owner' | 'editor';
    roomId: string;
    userId: string;
}

function Sidebar() {
    const {user} = useUser();

    const [groupedData, setGroupedData] = useState<{
        owner: RoomDocument[],
        editor: RoomDocument[]
    }>({
        owner: [],
        editor: []
    });

    const [data, loading, error] = useCollection(
        user && (
            query(
                collectionGroup(db, 'rooms'),
                where("userId", '==', user.emailAddresses[0].toString()),
            )
        )
    );

    useEffect(() => {
      if (!user) {
        setGroupedData({ owner: [], editor: [] });
        return;
      }
        if (!data) return;

        //[doc1, doc2, doc3] => {owner: [doc1], editor: [doc2, doc3]}
        const grouped = data.docs.reduce<{
            owner: RoomDocument[],
            editor: RoomDocument[]
        }>(
            (acc, curr)=>{
                const roomData = curr.data() as RoomDocument;
                if (roomData.role === 'owner') {
                    acc.owner.push({
                        id: curr.id,
                        ...roomData
                    })
                }else{
                    acc.editor.push({
                        id: curr.id,
                        ...roomData
                    })
                }
                return acc;
            },{
                owner: [],
                editor: []
            }
        )

        setGroupedData (grouped)
    },[data])
  const menuOptions = (
    <>
      <NewDocumentButton/>
    <div className="flex flex-col space-y-4 md:max-w-36">
      {/* My docs */}
      {groupedData.owner.length === 0 ? (
        <h2 className="text-gray-500 font-semibold text-sm">No documents found</h2>
      ): (
            <>
                <h2 className="text-gray-500 font-semibold text-sm text-center mt-6">
                    My Documents
                </h2>
                {groupedData.owner.map((doc) => (
                    <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`}/>
                ))}
            </>
      )}
    
      {/* list.. */}

        {/* Shared with me */}
        {groupedData.editor.length >0 && (
            <>
                <h2 className="text-gray-500 font-semibold text-sm text-center mt-6">
                    Shared with me
                </h2>
                {groupedData.editor.map((doc) => (
                    <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`}/>
                ))}
            </>
        )}
        {/* list... */}
        </div>
      
    </>
  );
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
          </SheetTrigger>
          <SheetContent side="left" className="items-center text-center">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
}
export default Sidebar;
