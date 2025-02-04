"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function PaginationComponent({
  totalPages,
  currentPage,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const renderPageLinks = () => {
    const pageLinks = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageLinks.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageURL(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      if (showEllipsisStart) {
        pageLinks.push(
          <PaginationItem key={1}>
            <PaginationLink href={createPageURL(1)}>1</PaginationLink>
          </PaginationItem>
        );
        pageLinks.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const startPage = Math.max(showEllipsisStart ? currentPage - 1 : 1, 1);
      const endPage = Math.min(
        showEllipsisEnd ? currentPage + 1 : totalPages,
        totalPages
      );

      for (let i = startPage; i <= endPage; i++) {
        pageLinks.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageURL(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (showEllipsisEnd) {
        pageLinks.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
        pageLinks.push(
          <PaginationItem key={totalPages}>
            <PaginationLink href={createPageURL(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pageLinks;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
            onClick={(e) => {
              if (currentPage === 1) e.preventDefault();
            }}
          />
        </PaginationItem>
        {renderPageLinks()}
        <PaginationItem>
          <PaginationNext
            href={
              currentPage < totalPages ? createPageURL(currentPage + 1) : "#"
            }
            onClick={(e) => {
              if (currentPage === totalPages) e.preventDefault();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
