/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

"use client";

import { useEffect, useState } from "react";

import { useMediaQuery } from "@/hooks";

import Sidebar from "@/shared/components/Sidebar";

import { useSelector } from "react-redux";
import { globalLoading } from "@/states/slices/authReducer";
import SidebarV2 from "../components/Sidebar/sidebarV2";
// import { Session } from "next-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loading = useSelector(globalLoading);
  const isMobileView = useMediaQuery("(max-width: 640px)");
  const isTabletView = useMediaQuery("(max-width: 840px)");
  const [isSideNavVisible, setSideNavVisible] = useState(false);

  useEffect(() => {
    if (isMobileView) {
      setSideNavVisible(false);
    } else {
      setSideNavVisible(false);
    }
  }, [isMobileView]);
  return (
    <div className="h-screen w-full overflow-hidden lg:flex">
      {isMobileView || isTabletView ? (
        <div
          className={`fixed bottom-0 left-0 top-0 z-20 w-full bg-gray-800/60 ${
            isSideNavVisible ? "" : "hidden"
          }`}
          onClick={() => setSideNavVisible(false)}
        />
      ) : null}
      <Sidebar
        {...{
          open: isSideNavVisible,
          setOpen: setSideNavVisible,
          onClose: () => setSideNavVisible(false),
        }}
      />

      <div className="[@media(max-width:767px)]:scrollbar-hide h-screen overflow-auto bg-[#fbfcfe] lg:pb-20 w-[2000px]">
        {children}
      </div>
      {/* <Sidebar
        {...{
          open: isSideNavVisible,
          setOpen: setSideNavVisible,
          onClose: () => setSideNavVisible(false),
        }}
      /> */}
      <SidebarV2
        open={false}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        setOpen={undefined}
      />
      {/* {loading && <Loader />} */}
    </div>
  );
}
