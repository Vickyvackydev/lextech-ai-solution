///home/josephhenry/Downloads/project/legal assitant/src/components/custom/chat.tsx:

"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  ChangeEvent,
} from "react";
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
import { useAppDispatch, useAppSelector, useMediaQuery } from "@/hooks";
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
import {
  formatChatTime,
  formatResponseToParagraphs,
} from "@/utils-func/functions";
import { StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import { FaFilePdf } from "react-icons/fa";

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
  const isMobile = useMediaQuery("(max-width: 640px)");
  const open = useAppSelector(SelectOpenState);
  const selectedText = useAppSelector(selectInput);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [inputMessage, setInputMessage] = useState("");
  const pathname = usePathname();
  const chat_id = pathname.split("/").pop();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);
  // const chatStarted = useAppSelector(startChat);
  // const open = useAppSelector(SelectOpenState);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const modalIsOpen = useAppSelector(openModal);
  const text = "Can I help you with anything?";
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    // @ts-ignore
    formData.append("chatId", currentChatId);

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
        toast.error(error.error || "Upload failed");
        throw new Error(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Network error or upload failed");
      throw error;
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setUploadQueue(files.map((file) => file.name));

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
        console.error("Comprehensive upload error:", error);
        toast.error("Failed to upload files");
      } finally {
        setUploadQueue([]);
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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

  console.log(uploadQueue);

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

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);
    setInput("");
  }, [attachments, handleSubmit, setAttachments, setInput]);
  const handleEnterMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents a new line in the textarea
      submitForm();
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

  const semanticColors = {
    title: "text-blue-700 dark:text-blue-400 font-semibold text-xl",
    subtitle: "text-purple-700 dark:text-purple-400 font-medium text-lg",
    caseTitle: "text-blue-700 dark:text-blue-400 font-semibold",
    legalPrinciple: "text-emerald-700 dark:text-emerald-400",
    citation: "text-purple-700 dark:text-purple-400 italic",
    conclusion: "text-rose-700 dark:text-rose-400 font-medium",
    warning: "text-amber-700 dark:text-amber-400",
    emphasis: "text-indigo-700 dark:text-indigo-400",
    procedural: "text-cyan-700 dark:text-cyan-400",
    evidence: "text-teal-700 dark:text-teal-400",
    statute: "text-violet-700 dark:text-violet-400",
    default: "text-gray-900 dark:text-gray-100",
  };

  const legalPatterns = [
    {
      regex: /^#\s+(.+?)$/gm,
      className: semanticColors.title,
      removeMarker: true,
    },
    {
      regex: /^#{2,}\s+(.+?)$/gm,
      className: semanticColors.subtitle,
      removeMarker: true,
    },
    {
      regex:
        /(?:^|\n)(?:CASE:|IN THE MATTER OF:|SUIT NO:|APPEAL NO:)(.+?)(?:\n|$)/gi,
      className: semanticColors.caseTitle,
    },
    {
      regex:
        /(?:^|\n)(?:PRINCIPLE:|LEGAL PRINCIPLE:|RATIO:|RATIO DECIDENDI:)(.+?)(?:\n|$)/gi,
      className: semanticColors.legalPrinciple,
    },
    {
      regex: /\[([^\]]+)\]|\(([^\)]+)\)/g, // Citations in square brackets or parentheses
      className: semanticColors.citation,
    },
    {
      regex:
        /(?:^|\n)(?:CONCLUSION:|JUDGMENT:|HOLDING:|ORDER:|DECISION:)(.+?)(?:\n|$)/gi,
      className: semanticColors.conclusion,
    },
    {
      regex:
        /(?:^|\n)(?:WARNING:|IMPORTANT:|NOTE:|CAVEAT:|DISCLAIMER:)(.+?)(?:\n|$)/gi,
      className: semanticColors.warning,
    },
    {
      regex: /(?:^|\n)(?:PROCEDURE:|PROCEEDINGS:|TIMELINE:)(.+?)(?:\n|$)/gi,
      className: semanticColors.procedural,
    },
    {
      regex: /(?:^|\n)(?:EVIDENCE:|EXHIBITS:|PROOF:)(.+?)(?:\n|$)/gi,
      className: semanticColors.evidence,
    },
    {
      regex: /(?:^|\n)(?:STATUTE:|SECTION:|LAW:|ACT:)(.+?)(?:\n|$)/gi,
      className: semanticColors.statute,
    },
    {
      regex: /\*\*(.+?)\*\*/g, // Text between double asterisks
      className: semanticColors.emphasis,
    },
  ];

  const colorizeText = (text: string) => {
    if (!text) return null;

    // Split text into lines while preserving empty lines
    const lines = text.split(/\n/);
    const processedLines = lines.map((line, index) => {
      if (!line.trim()) {
        return <div key={index} className="h-4" />; // Empty line spacing
      }

      let processedLine = line;
      let hasMatch = false;
      let className = semanticColors.default;

      // Apply patterns in order of specificity
      for (const {
        regex,
        className: patternClass,
        removeMarker,
      } of legalPatterns) {
        const matches = Array.from(line.matchAll(new RegExp(regex)));
        if (matches.length > 0) {
          hasMatch = true;
          matches.forEach((match) => {
            const content = match[1] || match[0];
            // Remove the markdown markers if removeMarker is true
            processedLine = removeMarker
              ? content
              : processedLine.replace(
                  match[0],
                  `<span class="${patternClass}">${content}</span>`
                );
          });
          className = patternClass;
        }
      }

      // Handle markdown-style formatting within colored text
      processedLine = processedLine
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/~~(.*?)~~/g, "<del>$1</del>");

      return (
        <div
          key={index}
          className={`${hasMatch ? "" : className} leading-relaxed py-1`}
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    });

    return <div className="space-y-1">{processedLines}</div>;
  };

  const removeAttachment = (attachmentToRemove: Attachment) => {
    setAttachments((currentAttachments) =>
      currentAttachments.filter(
        (attachment) => attachment.url !== attachmentToRemove.url
      )
    );
  };
  // const colorizedContent = useMemo(() => {
  //   if (typeof content === 'string' && role === 'assistant') {
  //     return colorizeText(content);
  //   }
  //   return content;
  // }, [content, role]);

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

    <div className="w-full pt-8 lg:px-16 px-7">
      {isFirstNewChat ? (
        <Onboarding username={session?.user?.name} append={append} />
      ) : (
        <div
          ref={chatContainerRef}
          className="border-t lg:pt-7 pt-16 lg:h-[500px] lg:max-h-[500px] h-[600px] max-h-[600px] pb-16 overflow-y-auto"
        >
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-semibold text-black">
              {"LexTech AI.0"}
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
                <Fade
                  direction="up"
                  duration={500}
                  className="w-full flex flex-col items-end justify-end gap-y-2"
                >
                  <div className="flex items-center gap-x-1">
                    {mess.experimental_attachments !== undefined &&
                      mess.experimental_attachments.length > 0 &&
                      mess.experimental_attachments.map((file: any) => {
                        return (
                          <>
                            {file.contentType.startsWith("image") ? (
                              <Image
                                src={file.url}
                                width={100}
                                height={100}
                                className=" object-contain rounded-lg"
                                alt=""
                              />
                            ) : (
                              <div className="">
                                <FaFilePdf size={100} color="red" />
                              </div>
                            )}
                          </>
                        );
                      })}
                  </div>

                  <div className="px-4 lg:py-5 py-3 border border-[#E8ECEF] rounded-xl h-full w-fit text-wrap">
                    <span className="lg:text-[18px] text-sm font-semibold text-[#6E6E6E] leading-relaxed">
                      {/* Write Detailed case for a simple welcome criminal suit and
                 form with 3 input fields and a dropdown with 2 buttons, cancel
                 and send, then run test with multiple parties. */}
                      {mess.content}
                    </span>
                  </div>
                  <span className="lg:text-sm text-xs font-medium text-[#C9C9C9]">
                    {
                      // @ts-ignore
                      formatChatTime(mess?.createdAt)
                    }
                  </span>
                </Fade>
              ) : (
                <div className="w-full relative gap-y-2 flex items-start gap-x-2">
                  <Image
                    src={AI_PHOTO}
                    className="lg:w-[30px] lg:h-[30px] w-[25px] h-[25px] "
                    alt=""
                  />
                  <div className="px-4 rounded-xl h-full">
                    <span className="lg:text-[18px] text-sm font-semibold text-[#6E6E6E]">
                      {colorizeText(mess.content)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="w-full flex items-start gap-x-3 relative gap-y-2 mt-5">
              <Image src={AI_PHOTO} className="w-[30px] h-[30px] " alt="" />
              <div className="px-4  rounded-xl h-full">
                <span className="text-[18px] font-semibold text-[#6E6E6E]">
                  <PulseLoader size={isMobile ? 8 : 11} color="#5E5E5E" />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {isMobile ? (
        <div className="fixed bottom-0 px-6 pb-10 bg-white w-full h-[150px] left-0">
          {/* <div className="flex items-center gap-x-2">
            {uploadQueue.length > 0 &&
              attachments?.map((file: any, index: number) => (
                <Image
                  key={index}
                  src={file?.url}
                  width={100}
                  height={100}
                  className="w-[50px] h-[50px] object-contain rounded-lg"
                  alt={file?.name}
                />
              ))}
          </div> */}

          <div className="w-full relative border-2 py-2 overflow-hidden border-[#E8ECEF] rounded-2xl flex flex-col items-center h-auto mt-9 px-3">
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
                  className="lg:w-[28px] lg:h-[28px] w-[25px] h-[25px]"
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
                    className={`lg:w-[35px] lg:h-[35px] w-[25px] h-[25px] ${
                      !input.trim() && "opacity-50"
                    }`}
                    alt="Sender Icon"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Fade
          direction="up"
          duration={2000}
          className={`fixed bottom-0 h-fit  ${
            open ? "md:w-[670px] w-[670px]" : "md:w-[850px] w-[850px]"
          }   px-10 bg-white pb-8 rounded-lg`}
        >
          {/* <div className="flex items-center gap-x-2">
            {attachments.length > 0 &&
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
          </div> */}

          <div className="w-full relative border-2 py-2 overflow-hidden border-[#E8ECEF] rounded-2xl flex flex-col items-center h-auto mt-16 px-3">
            <>
              {(attachments.length > 0 || uploadQueue.length > 0) && (
                <div className="flex flex-row gap-2">
                  {attachments.map((attachment) => (
                    <PreviewAttachment
                      key={attachment.url}
                      attachment={attachment}
                      onRemove={() => removeAttachment(attachment)}
                    />
                  ))}

                  {uploadQueue.map((filename) => (
                    <PreviewAttachment
                      key={filename}
                      attachment={{
                        url: "",
                        name: filename,
                        contentType: "",
                      }}
                      isUploading={true}
                    />
                  ))}
                </div>
              )}
            </>
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
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
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
                ref={fileInputRef}
                multiple
                onChange={handleFileChange}
                className="sr-only"
              />
              {isLoading ? (
                <div
                  onClick={() => stop()}
                  className="border cursor-pointer border-gray-300 rounded-md flex items-center justify-center"
                >
                  <StopIcon size={17} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    submitForm();
                  }}
                >
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
      )}

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
