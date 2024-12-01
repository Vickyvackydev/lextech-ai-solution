/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-useless-fragment */

"use client";

import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";
import { BiChevronRight, BiLogOut } from "react-icons/bi";
import { FaCheck, FaEye, FaTimes } from "react-icons/fa";
import Image from "next/image";

import { usePathname, useRouter } from "next/navigation";

import { useAppSelector, useMediaQuery } from "@/hooks";
// import {
//   AD_SECTIONS,
//   BAR,
//   CATEGORIES,
//   CHAT_ICON,
//   DASHBOARD_WHITE,
//   LOGO,
//   OPPORTUNITY,
//   SETTINGS,
//   TASK,
//   TRANSACTIONS,
//   USERS,
// } from "@/utils/Exports";
import { getBackgroundColor } from "@/utils-func/functions/userDynamicColor";
import { selectUser } from "@/states/slices/authReducer";
import Button from "../button";

import {
  MAN,
  ONLINE_STATUS,
  RING,
  STATUS,
  TRASH,
} from "@/utils-func/image_exports";
import ButtonV2 from "../buttonV2";
import { Bounce, Fade } from "react-awesome-reveal";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Skeleton } from "@mui/material";
import { signOut } from "next-auth/react";
import { formatTimeElapsed } from "@/utils-func/functions";
import { deleteChats } from "@/lib/actions/chat";
import toast from "react-hot-toast";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  setOpen: any;
}

const SidebarV2 = (props: SidebarProps) => {
  const { open, onClose, setOpen } = props;
  const [loading, setLoading] = useState(false);
  const [showLogOutBox, setShowLogOutBox] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedIds, setSelectedIds] = useState<any>([]);
  const handleChatClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/chat/${id}`);
  };
  const handleSelectId = (id: string) => {
    setSelectedIds(
      (prevId: any) =>
        prevId.includes(id)
          ? prevId.filter((_id: any) => _id !== id) // unselect ids
          : [...prevId, id] // select id
    );
  };

  const {
    data: chatHistory,
    isLoading,
    mutate,
  } = useSWR(`/api/history`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData: [],
    onSuccess: (newData) => {
      if (!newData || newData.length === 0) {
        setHasMore(false);
        setIsLoadingMore(false);
      }
      setIsLoadingMore(false);
    },
  });
  useEffect(() => {
    if (isLoadingMore) {
      mutate();
    }
  }, [isLoadingMore, mutate]);

  const handleDeleteChat = async (chatIds: string[], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await deleteChats(chatIds);
      await mutate(); // Refresh the chat list
      setLoading(false);
      router.replace("/");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("error deleting chat");
    }
  };

  const isMobileView = useMediaQuery("(max-width: 640px)");
  const isTabletView = useMediaQuery("(max-width: 840px)");
  const currentUser = useAppSelector(selectUser);
  const colors = getBackgroundColor("Abraham");
  const pathname = usePathname();
  const router = useRouter();

  console.log(chatHistory);

  return (
    <>
      {isMobileView || isTabletView ? (
        <Transition
          as="div"
          className="fixed z-30 h-full w-56 flex-none bg-brand-light lg:static"
          enter="transition-all ease-in duration-300"
          enterFrom="transform -translate-x-full"
          enterTo="transform -translate-x-0"
          leave="transition-all ease-out duration-300"
          leaveFrom="transform -translate-x-0"
          leaveTo="transform -translate-x-full"
          show={props.open}
        >
          {/* mobile screen section */}
          <div className="h-screen"></div>
        </Transition>
      ) : (
        <div
          className="flex h-screen z-20 flex-col py-7 w-[650px] bg-[#FEFEFE]"
          style={{ boxShadow: "inset 0 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="w-full h-[72px]  border-b border-[#E8ECEF] flex items-center justify-end gap-x-8 pr-6 pb-4">
            <div className="relative">
              {/* <Image src={RING} className="w-[24px] h-[24px]" alt="" /> */}
              <BiLogOut
                size={24}
                color="#6C7275"
                className="cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => setShowLogOutBox((prev) => !prev)}
              />
              {/* <Image
                src={STATUS}
                className="w-[8px] h-[8px] absolute top-0 right-0"
                alt=""
                
              /> */}
              {showLogOutBox && (
                <div
                  className="rounded-lg w-[87px] h-[40px] right-2 bg-white cursor-pointer shadow-md absolute p-2 text-center font-medium text-gray-400 hover:text-white hover:bg-green-500"
                  onClick={() => signOut()}
                >
                  Log out
                </div>
              )}
            </div>
            <div className="relative">
              <Image
                src={MAN}
                className="w-[40px] h-[40px] rounded-full"
                alt="image"
              />
              <Image
                src={ONLINE_STATUS}
                className="w-[18px] h-[18px] rounded-full absolute -right-1 top-7"
                alt="image"
              />
            </div>

            <ButtonV2
              title="Share"
              btnStyle="bg-[#007AFF] rounded-lg w-[87px] h-[40px]"
              textStyle="text-[#FEFEFE] font-semibold"
              handleClick={() => {}}
            />
          </div>
          <div className="h-full  inset-0 px-5 mt-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <span className="text-[#6C7275BF] font-semibold text-sm">
                  Chat history
                </span>
                <div className="w-[55px] h-[20px] rounded-xl bg-[#E8ECEF] flex items-center shadow-md justify-center text-xs font-medium text-[#6C7275]">
                  {chatHistory?.length}/{chatHistory?.length}
                </div>
              </div>
              {selectedIds.length > 0 && (
                <Image
                  src={TRASH}
                  className="w-[20px] h-[20px] cursor-pointer"
                  alt=""
                  onClick={(e) => handleDeleteChat(selectedIds, e)}
                />
              )}
            </div>
            <Fade direction="up" duration={1000}>
              <div className="mt-16 flex flex-col gap-y-3 h-[400px] max-h-[400px] overflow-y-scroll">
                {chatHistory.length > 0 ? (
                  chatHistory.map(
                    (item: {
                      id: string;
                      title: string;
                      summary: string;
                      createdAt: string;
                    }) => (
                      <div
                        className="flex items-start justify-start gap-x-2 cursor-pointer"
                        onClick={(e) => handleChatClick(item?.id, e)}
                      >
                        <div
                          className="max-w-[20px] max-h-[20px] p-1 rounded-md border-2 border-[#6C727580] mt-2 flex items-center justify-center cursor-pointer"
                          onClick={() => handleSelectId(item?.id)}
                        >
                          {selectedIds.includes(item?.id) && (
                            <FaCheck size={14} color="#6C727580" />
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-y-2 ">
                          <div className="flex flex-col">
                            <span className="text--[#141718] text-[16px] font-semibold">
                              {/* Brainwave AI UI Kit */}
                              {item?.title.length > 15
                                ? `${item?.title.slice(0, 15)}...`
                                : item?.title}
                            </span>
                            <span className="text-xs font-medium text-[#6C7275] ">
                              {/* Analyze precedents and case outcomes */}
                              {item?.summary.length > 45
                                ? `${item?.summary.slice(0, 45)}...`
                                : item?.summary}
                            </span>
                          </div>
                          <span className="text-[#6C7275BF] font-medium text-[11px]">
                            {formatTimeElapsed(item?.createdAt)}
                          </span>
                        </div>
                      </div>
                    )
                  )
                ) : isLoading ?? loading ? (
                  <>
                    <div className="w-[80%]">
                      <Skeleton
                        className="w-full mb-4"
                        height={20}
                        variant="rectangular"
                      />
                      <Skeleton
                        className="w-[40%] mb-4"
                        height={20}
                        variant="rectangular"
                      />
                    </div>
                    <div className="w-[80%]">
                      <Skeleton
                        className="w-full mb-4"
                        height={20}
                        variant="rectangular"
                      />
                      <Skeleton
                        className="w-[40%] mb-4"
                        height={20}
                        variant="rectangular"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-[16px] font-medium text-gray-400 text-center">
                    No recents chats
                  </div>
                )}
              </div>
            </Fade>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarV2;
