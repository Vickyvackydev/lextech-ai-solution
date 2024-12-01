/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable import/no-extraneous-dependencies */
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";

import { usePagination, useTable } from "react-table";

function TableComponent({
  data,

  COLUNMS,
}: {
  data: any;
  selectedbox: any;
  COLUNMS: any;
  handleSelectedBox: (id: any) => void;
}) {
  const columns = useMemo(() => COLUNMS, [COLUNMS]);

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  // const { pageIndex, gotoPage } = state;
  const [viewAll, setViewAll] = useState(false);
  const pathname = usePathname();
  const displayAlldata = viewAll ? data : page;
  return (
    <div className="w-full relative">
      <table className="w-full" {...getTableProps}>
        <thead className="">
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="pb-4">
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps()}
                  className={`px-2 pb-6 font-normal text-[12px] ${
                    pathname === "/userslist" ? "text-start" : ""
                  } `}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className={viewAll ? "max-h-[700px] overflow-y-scroll" : ""}
        >
          {displayAlldata.map((row: any) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className=" text-center my-8 rounded-sm border-b-4 border-white"
              >
                {row.cells.map((cell: any) => (
                  <td
                    {...cell.getCellProps()}
                    className={`${
                      location.pathname === "/userslist" ? "px-3" : "px-5"
                    }  bg-[#F6F6F6] py-2 whitespace-nowrap rounded-sm`}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-between px-2 mt-4 text-darkblue text-sm font-medium">
        <div>
          <button
            className=" "
            onClick={() => setViewAll((previous) => !previous)}
            type="button"
          >
            {viewAll ? "Show less" : "View all"}
          </button>
        </div>
        <div className="flex gap-4 items-center">
          <button
            disabled={!canPreviousPage}
            onClick={() => previousPage()}
            type="button"
          >
            prev
          </button>
          {/* <span>
            page
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span> */}
          {pageOptions.map((page_: any, index: number) => (
            <button
              className={`${
                pageIndex === index ? "border border-darkblue rounded-md" : ""
              } px-[6px]`}
              onClick={() => nextPage(index)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
          {pageOptions.length > 3 ? (
            <button
              className={canNextPage ? "text-darkblue" : "text-lightgrey"}
              disabled={!canNextPage}
              onClick={() => nextPage()}
              type="button"
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TableComponent;
