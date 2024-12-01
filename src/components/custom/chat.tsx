///home/josephhenry/Downloads/project/legal assitant/src/components/custom/chat.tsx:

"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
// import { useSidebar } from "@/components/ui/sidebar";
// import { useHistorySidebar } from "@/contexts/history-sidebar-context";
import { usePathname, useRouter } from "next/navigation";

import { SelectOpenState } from "@/states/slices/globalReducer";

import { ChatHeader } from "@/components/custom/chat-header";
import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import { getChatById, shareChat } from "@/lib/actions/chat";
import { useAppDispatch, useAppSelector } from "@/hooks";
import toast from "react-hot-toast";
import { selectInput, setSearcModal } from "@/states/slices/globalReducer";
import Image from "next/image";
import { SHARE_ICON } from "@/utils-func/Exports";
import {
  ADD_ICON,
  AI_PHOTO,
  DOTS,
  SENDER,
  STAR_ICON,
} from "@/utils-func/image_exports";
import { Bounce, Fade } from "react-awesome-reveal";
import Onboarding from "./onboarding";
import { useSession } from "next-auth/react";
import { PulseLoader } from "react-spinners";
import { formatChatTime } from "@/utils-func/functions";
import { StopIcon } from "./icons";

interface CustomResponse extends Response {
  headers: Headers & {
    get(name: "X-Chat-Id"): string | null;
  };
}

export function Chat({
  id,
  initialMessages,
  selectedModelName,
  currentChatId,
  isNewChat = false,
}: {
  id?: string;
  initialMessages: Array<Message>;
  selectedModelName: string;
  currentChatId?: string;
  isNewChat?: boolean;
}) {
  // const router = useRouter();
  const [chatId, setChatId] = useState<string | null>(currentChatId || null);
  const { data: session } = useSession();
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      body: {
        id: chatId,
        model: selectedModelName,
        isNewChat,
      },
      initialMessages,
      onResponse: (response: CustomResponse) => {
        const newChatId = response.headers.get("X-Chat-Id");
        if (newChatId && isNewChat) {
          setChatId(newChatId);
          window.history.replaceState({}, "", `/chat/${newChatId}`);
        }
      },
    });

  // const [messagesContainerRef, messagesEndRef] =
  //   useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  // const { open: sidebarOpen, isMobile } = useSidebar();
  // const { isHistoryOpen } = useHistorySidebar();
  const isFirstNewChat = messages.length === 0;

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "Analyzing your request...",
    "Preparing your response...",
    "Applying legal reasoning...",
    "Processing information...",
    "Formulating expert opinion...",
  ];

  const isThinking =
    (isLoading && messages.length === 0) ||
    (isLoading && messages[messages.length - 1]?.role !== "assistant");

  // useEffect(() => {
  //   const fetchChatId = async () => {
  //     const chatFromDb = await getChatById(currentChatId!);
  //     if (chatFromDb?.id === currentChatId) {
  //       window.history.replaceState({}, "", `/chat/${currentChatId}`);
  //     }
  //   };
  //   fetchChatId();
  // }, [currentChatId]);

  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [messages]);

  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        setLoadingMessageIndex(
          (prevIndex) => (prevIndex + 1) % loadingMessages.length
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isThinking]);

  // const getContainerStyles = () => {
  //   let marginLeft = "0px";
  //   let marginRight = "0px";
  //   let width = "100%";
  //   let maxWidth = "100%";

  //   if (!isMobile) {
  //     if (sidebarOpen) {
  //       marginLeft = "300px";
  //     } else {
  //       marginLeft = "64px";
  //     }

  //     if (isHistoryOpen) {
  //       marginRight = "-300px";
  //     }

  //     const totalMargins = parseInt(marginLeft) + parseInt(marginRight);
  //     width = `calc(100% - ${totalMargins}px)`;
  //   }

  //   return {
  //     marginLeft,
  //     marginRight,
  //     width,
  //     maxWidth,
  //     transition: 'all 0.3s ease-in-out'
  //   };
  // };

  // const containerStyles = getContainerStyles();

  // const [messages, setMessages] = useState([
  //   {
  //     message: "",
  //     uploaded_files: [],
  //   },
  // ]);
  const open = useAppSelector(SelectOpenState);
  const selectedText = useAppSelector(selectInput);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [inputMessage, setInputMessage] = useState("");
  const pathname = usePathname();
  const chat_id = pathname.split("/").pop();
  const router = useRouter();
  const dispatch = useAppDispatch();
  // const chatStarted = useAppSelector(startChat);
  // const open = useAppSelector(SelectOpenState);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const modalIsOpen = useAppSelector(openModal);
  const text = "Can I help you with anything?";

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", chatId!);

    try {
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: file.type,
        };
      } else {
        const { error } = await response.json();
        throw new Error(`Upload failed: ${error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  // const handleFileChange = useCallback(
  //   async (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const files = Array.from(event.target.files || []);

  //     setUploadQueue(files.map((file) => file.name));

  //     try {
  //       const uploadPromises = files.map((file) => uploadFile(file));
  //       const uploadedAttachments = await Promise.all(uploadPromises);
  //       const successfullyUploadedAttachments = uploadedAttachments.filter(
  //         (attachment) => attachment !== undefined
  //       );

  //       setAttachments((currentAttachments) => [
  //         ...currentAttachments,
  //         ...successfullyUploadedAttachments,
  //       ]);
  //     } catch (error) {
  //       console.error("Error uploading files!", error);
  //     } finally {
  //       setUploadQueue([]);
  //     }
  //   },
  //   [setAttachments]
  // );
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;

  //   if (files && files.length > 3) {
  //     toast.error("you can only upload maximum of 3 files");
  //   }
  //   if (files) {
  //     const selectedFiles = Array.from(files).slice(0, 3); // selects up to 3 images
  //     const validFiles = selectedFiles.filter((file) => file.size <= 1000000); // filter image larger than 3mb

  //     const uploadedFiles = validFiles.map((file) => ({
  //       ...file,
  //       preview: URL.createObjectURL(file),
  //     }));
  //     setSelectedFiles(uploadedFiles);
  //   }
  // };

  // const letters = text.split("");

  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.05,
  //     },
  //   },
  // };

  // const letterVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: { opacity: 1, y: 0 },
  // };

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      const fileQueue = files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));

      setUploadQueue((prevQueue: any) => [...prevQueue, ...fileQueue]);

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments]
  );

  const handleControlKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "f") {
      event.preventDefault();
      dispatch(setSearcModal(true));
    }
  };

  // const handleSend = () => {
  //   if (selectedFiles.length > 0) {
  //     setMessages([
  //       ...messages,
  //       {
  //         message: inputMessage,
  //         uploaded_files: selectedFiles,
  //       },
  //     ]);
  //   } else {
  //     setMessages([...messages, { message: inputMessage, uploaded_files: [] }]);
  //   }
  //   setInputMessage("");
  //   setSelectedFiles([]);
  // };

  // const handleStartChat = () => {
  //   const chatId = uuidv4();
  //   dispatch(setChatStarted(true));
  //   router.replace(`/lextech-ai/chat/${chatId}`);
  //   handleSend();
  // };

  const handleEnterMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents a new line in the textarea
      handleSubmit();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
    window.addEventListener("keydown", handleControlKeyDown);

    return () => window.removeEventListener("keydown", handleControlKeyDown);
  }, []);

  console.log(uploadQueue);

  const handleShareChat = async (chatId: string) => {
    const shareUrl = await shareChat(chatId, "whatsapp");
    window.open(shareUrl, "_blank");
  };

  return (
    // <div
    //   className="fixed inset-0 flex flex-col bg-background"
    //   style={containerStyles}
    // >
    //   <ChatHeader selectedModelName={selectedModelName} />
    //   <div
    //     ref={messagesContainerRef}
    //     className={cn(
    //       "flex-1 overflow-y-auto px-4",
    //       "w-full max-w-none",
    //       "transition-all duration-300"
    //     )}
    //   >
    //     <div className={cn(
    //       "mx-auto py-6 space-y-6",
    //       "w-full max-w-4xl",
    //       "transition-all duration-300"
    //     )}>
    //       {isFirstNewChat ? (
    //         <Overview />
    //       ) : (
    //         <div className="space-y-6">
    //           {messages.map((message) => (
    // <PreviewMessage
    //   key={message.id}
    //   role={message.role}
    //   content={message.content}
    //   attachments={message.experimental_attachments}
    //   toolInvocations={message.toolInvocations}
    // />
    //           ))}
    //           {isThinking && (
    //             <div className="flex items-center gap-2 text-muted-foreground">
    //               <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
    //               <p>{loadingMessages[loadingMessageIndex]}</p>
    //             </div>
    //           )}
    //         </div>
    //       )}
    //       <div
    //         ref={messagesEndRef}
    //         className="shrink-0 min-w-[24px] min-h-[24px]"
    //       />
    //     </div>
    //   </div>

    //   <div className="border-t bg-background p-4">
    //     <form
    //       className={cn(
    //         "max-w-4xl mx-auto w-full",
    //         "transition-all duration-300"
    //       )}
    //     >
    // <MultimodalInput
    //   input={input}
    //   setInput={setInput}
    //   handleSubmit={handleSubmit}
    //   isLoading={isLoading}
    //   stop={stop}
    //   attachments={attachments}
    //   setAttachments={setAttachments}
    //   messages={messages}
    //   append={append}
    //   currentChatId={chatId || ''}
    /* className={cn({
              "min-h-[200px]": !isMobile && isFirstNewChat && attachments.length === 0,
              "min-h-[100px]": isMobile || !isFirstNewChat || attachments.length > 0,
            })} */
    // />
    //     </form>
    //   </div>
    // </div>

    <div className="w-full pt-8 px-16">
      {isFirstNewChat ? (
        <Onboarding username={session?.user?.name} />
      ) : (
        <div
          ref={chatContainerRef}
          className="border-t pt-7 h-[500px] max-h-[500px] pb-16 overflow-y-auto"
        >
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-semibold text-black">
              {selectedModelName ?? "Case Law Analysis"}
            </span>
            <div className="flex items-center gap-x-4">
              <Image
                src={STAR_ICON}
                className="w-[28px] h-[28px] cursor-pointer"
                alt=""
              />
              <Image
                src={SHARE_ICON}
                className="w-[28px] h-[28px] cursor-pointer"
                onClick={() => handleShareChat(chat_id!)}
                alt=""
              />
              <Image
                src={DOTS}
                className="w-[28px] h-[28px] cursor-pointer"
                alt=""
              />
            </div>
          </div>
          {messages.map((mess) => (
            <div className="flex flex-col gap-y-10 mt-8">
              {mess.role === "user" ? (
                <div className="w-full flex flex-col items-end justify-end gap-y-2">
                  <div className="flex items-center gap-x-1">
                    {mess.experimental_attachments !== undefined &&
                      mess.experimental_attachments.length > 0 &&
                      mess.experimental_attachments.map((file: any) => (
                        <Image
                          src={file.url}
                          width={100}
                          height={100}
                          className=" object-contain rounded-lg"
                          alt=""
                        />
                      ))}
                  </div>

                  <div className="px-4 py-5 border border-[#E8ECEF] rounded-xl h-full w-fit text-wrap">
                    <span className="text-[18px] font-semibold text-[#6E6E6E] ">
                      {/* Write Detailed case for a simple welcome criminal suit and
                 form with 3 input fields and a dropdown with 2 buttons, cancel
                 and send, then run test with multiple parties. */}
                      {mess.content}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[#C9C9C9]">
                    {
                      // @ts-ignore
                      formatChatTime(mess?.createdAt)
                    }
                  </span>
                </div>
              ) : (
                <div className="w-full relative gap-y-2">
                  <div className="px-4 py-5 bg-[#F3F5F7] rounded-xl h-full">
                    <span className="text-[18px] font-semibold text-[#6E6E6E]">
                      {mess.content}
                    </span>
                  </div>
                  <Image
                    src={AI_PHOTO}
                    className="w-[30px] h-[30px] absolute right-9 -bottom-4"
                    alt=""
                  />
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="w-full relative gap-y-2 mt-5">
              <div className="px-4 py-7 bg-[#F3F5F7] rounded-xl h-full">
                <span className="text-[18px] font-semibold text-[#6E6E6E]">
                  <PulseLoader size={11} color="#5E5E5E" />
                </span>
              </div>
              <Image
                src={AI_PHOTO}
                className="w-[30px] h-[30px] absolute right-9 -bottom-4"
                alt=""
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <Fade
        direction="up"
        duration={2000}
        className={`fixed bottom-0  ${
          open ? "w-[670px]" : "w-[840px]"
        } px-10 bg-white pb-8 rounded-lg`}
      >
        <div className="flex items-center gap-x-2">
          {uploadQueue.length > 0 &&
            uploadQueue?.map((file: any, index: number) => (
              <Image
                key={index}
                src={file?.url}
                width={100}
                height={100}
                className="w-[50px] h-[50px] object-contain rounded-lg"
                alt={file?.name}
              />
            ))}
        </div>
        <div className="w-full relative border-2 py-2 overflow-hidden border-[#E8ECEF] rounded-2xl flex flex-col items-center h-auto mt-16 px-3">
          <textarea
            name=""
            placeholder="Type a message..."
            rows={1}
            onKeyDown={handleEnterMessage}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className="w-full resize-none outline-none bg-transparent px-3 py-1"
          />

          <div className="w-full flex items-center justify-between">
            <button
              // @ts-ignore
              onClick={() => document.querySelector(".file_upload")?.click()}
            >
              <Image
                src={ADD_ICON}
                className="w-[28px] h-[28px] "
                alt="Add Icon"
              />
            </button>
            <input
              type="file"
              accept=""
              multiple
              onChange={handleFileChange}
              className="file_upload sr-only"
            />
            {isLoading ? (
              <div
                onClick={() => stop()}
                className="border cursor-pointer border-gray-300 rounded-md flex items-center justify-center"
              >
                <StopIcon size={17} />
              </div>
            ) : (
              <button type="button" onClick={handleSubmit}>
                <Image
                  src={SENDER}
                  className={`w-[35px] h-[35px] ${
                    !input.trim() && "opacity-50"
                  }`}
                  alt="Sender Icon"
                />
              </button>
            )}
          </div>
        </div>
      </Fade>

      {/* <Fade
        direction="up"
        duration={2000}
        className="fixed bottom-0 w-[970px] px-10 bg-white pb-8"
      >
        <div className="w-full border-2 py-2  overflow-hidden bg-[#fbfcfe] border-[#E8ECEF] rounded-2xl flex flex-col items-center h-auto mt-16 px-3">
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

            <button type="button" onClick={}>
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
      </Fade> */}
    </div>
  );
}
