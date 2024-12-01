import { cookies } from "next/headers";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { Chat } from "@/components/custom/chat";
import { redirect } from "next/navigation";
import DashboardLayout from "@/shared/Layouts/DashboardLayout";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayout>
      <Chat
        initialMessages={[]}
        selectedModelName={process.env.MODEL_NAME || "gpt-4o-mini"}
        isNewChat={true}
      />
    </DashboardLayout>
  );
}

// import { useAppDispatch, useAppSelector } from "@/hooks";
// import ButtonV2 from "@/shared/components/buttonV2";
// import {
//   openModal,
//   SelectOpenState,
//   setChatStarted,
//   setSearcModal,
//   startChat,
// } from "@/states/slices/globalReducer";
// import {
//   ADD_ICON,
//   AI_PHOTO,
//   CASE,
//   CLOCK,
//   DOC_ICON,
//   DOTS,
//   DRAFT,
//   LARGE_SEARCH,
//   LEGAL,
//   MAP_CONNECTION,
//   SENDER,
//   SHARE_ICON,
//   SMALL_SEARCH,
//   STAR_ICON,
//   WAVE,
// } from "@/utils-func/image_exports";
// import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";
// import { Bounce, Fade } from "react-awesome-reveal";
// import { motion } from "framer-motion";

// import { v4 as uuidv4 } from "uuid";
// import { useRouter } from "next/navigation";
// import DashboardLayout from "@/shared/Layouts/DashboardLayout";
// import { useSession } from "next-auth/react";

// function WelcomePage() {
//   // const [chatStarted, setChatStarted] = useState(true);
//   const { data: session } = useSession();
//   const [messages, setMessages] = useState<any>([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const chatStarted = useAppSelector(startChat);
//   const open = useAppSelector(SelectOpenState);
//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const modalIsOpen = useAppSelector(openModal);
//   const text = "Can I help you with anything?";

//   const letters = text.split("");

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.05,
//       },
//     },
//   };

//   const letterVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   };

//   const handleControlKeyDown = (event: KeyboardEvent) => {
//     if (event.ctrlKey && event.key === "f") {
//       event.preventDefault();
//       dispatch(setSearcModal(true));
//     }
//   };

//   const handleSend = () => {
//     setMessages([...messages, inputMessage]);
//     setInputMessage("");
//   };

//   const handleStartChat = () => {
//     dispatch(setChatStarted(true));

//     handleSend();
//   };

//   const handleEnterMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       // Prevents a new line in the textarea
//       const chatId = uuidv4();
//       router.replace(`/chat/${chatId}`);
//       handleSend();
//     }
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);
//   useEffect(() => {
//     window.addEventListener("keydown", handleControlKeyDown);

//     return () => window.removeEventListener("keydown", handleControlKeyDown);
//   }, []);
//   return (
//     <>
//       <div className="overflow-y-auto w-full pt-8 px-16 pb-[150px]">
//         <Bounce>
//           <div className="flex items-center justify-center flex-col gap-y-2">
//             <Image src={WAVE} className="w-[53px] h-[53px] " alt="Wave Icon" />
//             <span className="text-[#767676] font-semibold text-[36px] ">
//               Hi {session?.user?.name?.split(" ")[0]}
//             </span>
//             <span className="text-[13px] font-medium text-[#3F454D] text-center">
//               Ready to assist you with anything you need, from answering
//               questions <br />
//               to providing recommendations. Let’s get started!
//             </span>
//           </div>
//         </Bounce>
//         <Bounce duration={1000}>
//           <div className="w-full bg-[#E4F4FF] rounded-xl h-[199px] mt-10 p-10 flex flex-col items-start gap-y-7">
//             <motion.div
//               className="overflow-hidden inline-block text-[36px] font-bold text-gray-900"
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//             >
//               {letters.map((letter, index) => (
//                 <motion.span
//                   key={index}
//                   variants={letterVariants}
//                   className="inline-block"
//                 >
//                   {letter === " " ? "\u00A0" : letter}
//                 </motion.span>
//               ))}
//             </motion.div>

//             <ButtonV2
//               title={"Take a tour"}
//               btnStyle={
//                 "bg-[#007AFF] rounded-3xl w-[180px] h-[51px] flex items-center justify-center gap-x-3 flex-row-reverse"
//               }
//               textStyle={"text-[#FEFEFE]"}
//               image={MAP_CONNECTION}
//               imageSize="w-[24px] h-[24px]"
//               handleClick={function (
//                 event: React.MouseEvent<HTMLButtonElement, MouseEvent>
//               ): void {
//                 throw new Error("Function not implemented.");
//               }}
//             />
//           </div>
//         </Bounce>
//         <Fade direction="down" duration={1000}>
//           <div
//             className={`w-full flex items-center ${
//               open && "grid grid-cols-3 gap-y-2"
//             }   gap-x-2 mt-8 `}
//           >
//             <div className="border-[#E8ECEF] px-4 pt-8 border gap-y-3 flex flex-col rounded-xl h-[195px] w-full">
//               <Image src={CASE} className="w-[53px] h-[53px]" alt="" />
//               <div className="flex flex-col">
//                 <span className="text-[18px] font-semibold text-black">
//                   Case Law Analysis
//                 </span>
//                 <span className="text-[#6E6E6E] leading-tight font-normal text-[15px]">
//                   Analyze precedents and case outcomes
//                 </span>
//               </div>
//             </div>
//             <div className="border-[#E8ECEF] px-4 pt-8 border gap-y-3 flex flex-col rounded-xl h-[195px] w-full">
//               <Image src={DOC_ICON} className="w-[53px] h-[53px]" alt="" />
//               <div className="flex flex-col">
//                 <span className="text-[18px] font-semibold text-black">
//                   Document Review
//                 </span>
//                 <span className="text-[#6E6E6E] leading-tight font-normal text-[15px]">
//                   Review and summarize legal documents
//                 </span>
//               </div>
//             </div>
//             <div className="border-[#E8ECEF] px-4 pt-8 border flex flex-col gap-y-3 rounded-xl h-[195px] w-full">
//               <Image src={LEGAL} className="w-[53px] h-[53px]" alt="" />
//               <div className="flex flex-col">
//                 <span className="text-[18px] font-semibold text-black">
//                   Legal research
//                 </span>
//                 <span className="text-[#6E6E6E] font-normal text-[15px] leading-tight">
//                   Research specific legal topics
//                 </span>
//               </div>
//             </div>
//             <div className="border-[#E8ECEF] px-4 pt-8 border flex flex-col gap-y-3 rounded-xl h-[195px] w-full">
//               <Image src={DRAFT} className="w-[53px] h-[53px]" alt="" />
//               <div className="flex flex-col">
//                 <span className="text-[18px] font-semibold text-black">
//                   Draft Summary
//                 </span>
//                 <span className="text-[#6E6E6E] font-normal text-[15px]">
//                   Create legal document summaries
//                 </span>
//               </div>
//             </div>
//           </div>
//         </Fade>
//       </div>

//       <Fade
//         direction="up"
//         duration={2000}
//         className="fixed bottom-0 w-[970px] px-10 bg-white pb-8"
//       >
//         <div className="w-full border-2 py-2  overflow-hidden bg-[#fbfcfe] border-[#E8ECEF] rounded-2xl flex flex-col items-center h-auto mt-16 px-3">
//           <textarea
//             name=""
//             placeholder="Type a message..."
//             rows={1}
//             onKeyDown={handleEnterMessage}
//             value={inputMessage}
//             onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
//               setInputMessage(e.target.value)
//             }
//             onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
//               e.target.style.height = "auto";
//               e.target.style.height = `${e.target.scrollHeight}px`;
//             }}
//             className="w-full resize-none outline-none bg-transparent px-3 py-1"
//           />

//           <div className="w-full flex items-center justify-between">
//             <button>
//               <Image
//                 src={ADD_ICON}
//                 className="w-[28px] h-[28px] "
//                 alt="Add Icon"
//               />
//             </button>

//             <button type="button" onClick={handleStartChat}>
//               <Image
//                 src={SENDER}
//                 className={`w-[35px] h-[35px] ${
//                   !inputMessage.trim() && "opacity-50"
//                 }`}
//                 alt="Sender Icon"
//               />
//             </button>
//           </div>
//         </div>
//       </Fade>
//     </>
//   );
// }

// export default WelcomePage;

{
  /* <DashboardLayout>
<div className="w-full pt-8 px-16">
  <Bounce>
    <div className="flex items-center justify-center flex-col gap-y-2">
      <Image src={WAVE} className="w-[53px] h-[53px] " alt="" />
      <span className="text-[#767676] font-semibold text-[36px] ">
        Hi Joseph
      </span>
      <span className="text-[13px] font-medium text-[#3F454D] text-center">
        Ready to assist you with anything you need, from answering
        questions <br />
        to providing recommendations. Let’s get started!
      </span>
    </div>
  </Bounce>
  <Bounce duration={1000}>
    <div className="w-full bg-[#E4F4FF] rounded-xl h-[199px] mt-10 p-10 flex flex-col items-start gap-y-7">
      <motion.div
        className="overflow-hidden inline-block text-[36px] font-bold text-gray-900"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>

      <ButtonV2
        title={"Take a tour"}
        btnStyle={
          "bg-[#007AFF] rounded-3xl w-[180px] h-[51px] flex items-center justify-center gap-x-3 flex-row-reverse"
        }
        textStyle={"text-[#FEFEFE]"}
        image={MAP_CONNECTION}
        imageSize="w-[24px] h-[24px]"
        handleClick={function (
          event: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  </Bounce>
  <Fade direction="up" duration={1000}>
    <div
      className={`w-full flex items-center ${
        open && "grid grid-cols-3 gap-y-2"
      }   gap-x-2 mt-8 `}
    >
      <div className="border-[#E8ECEF] px-4 pt-8 border gap-y-3 flex flex-col rounded-xl h-[195px] w-full">
        <Image src={CASE} className="w-[53px] h-[53px]" alt="" />
        <div className="flex flex-col">
          <span className="text-[18px] font-semibold text-black">
            Case Law Analysis
          </span>
          <span className="text-[#6E6E6E] leading-tight font-normal text-[15px]">
            Analyze precedents and case outcomes
          </span>
        </div>
      </div>
      <div className="border-[#E8ECEF] px-4 pt-8 border gap-y-3 flex flex-col rounded-xl h-[195px] w-full">
        <Image src={DOC_ICON} className="w-[53px] h-[53px]" alt="" />
        <div className="flex flex-col">
          <span className="text-[18px] font-semibold text-black">
            Document Review
          </span>
          <span className="text-[#6E6E6E] leading-tight font-normal text-[15px]">
            Review and summarize legal documents
          </span>
        </div>
      </div>
      <div className="border-[#E8ECEF] px-4 pt-8 border flex flex-col gap-y-3 rounded-xl h-[195px] w-full">
        <Image src={LEGAL} className="w-[53px] h-[53px]" alt="" />
        <div className="flex flex-col">
          <span className="text-[18px] font-semibold text-black">
            Legal research
          </span>
          <span className="text-[#6E6E6E] font-normal text-[15px] leading-tight">
            Research specific legal topics
          </span>
        </div>
      </div>
      <div className="border-[#E8ECEF] px-4 pt-8 border flex flex-col gap-y-3 rounded-xl h-[195px] w-full">
        <Image src={DRAFT} className="w-[53px] h-[53px]" alt="" />
        <div className="flex flex-col">
          <span className="text-[18px] font-semibold text-black">
            Draft Summary
          </span>
          <span className="text-[#6E6E6E] font-normal text-[15px]">
            Create legal document summaries
          </span>
        </div>
      </div>
    </div>
  </Fade>

  <Bounce>
    <div className="w-full border-2 py-2  overflow-hidden border-[#E8ECEF] rounded-2xl flex flex-col items-center h-auto mt-16 px-3">
      <textarea
        name=""
        placeholder="Type a message..."
        rows={1}
        onKeyDown={handleEnterMessage}
        value={inputMessage}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setInputMessage(e.target.value)
        }
        onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        className="w-full resize-none outline-none bg-transparent px-3 py-1"
      />

      <div className="w-full flex items-center justify-between">
        <button>
          <Image
            src={ADD_ICON}
            className="w-[28px] h-[28px] "
            alt="Add Icon"
          />
        </button>

        <button type="button" onClick={handleStartChat}>
          <Image
            src={SENDER}
            className={`w-[35px] h-[35px] ${
              !inputMessage.trim() && "opacity-50"
            }`}
            alt="Sender Icon"
          />
        </button>
      </div>
    </div>
  </Bounce>
</div>
</DashboardLayout> */
}
