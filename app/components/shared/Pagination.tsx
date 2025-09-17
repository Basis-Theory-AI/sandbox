import React from "react";
import { PaginationInfo } from "../../services/apiService";

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
}

export function Pagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
}: PaginationProps) {
  const { currentPage, totalPages, total, hasNext, hasPrevious } = pagination;

  // Generate page numbers to show
  const getVisiblePageNumbers = (): (number | string)[] => {
    const delta = 2; // Show 2 pages on each side of current page
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    // Always show first page
    if (totalPages > 1) {
      range.push(1);
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Always show last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remove duplicates and sort
    const uniqueRange = Array.from(new Set(range)).sort((a, b) => a - b);

    // Add dots where there are gaps
    let previousPage = 0;
    uniqueRange.forEach((page) => {
      if (page - previousPage > 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(page);
      previousPage = page;
    });

    return rangeWithDots;
  };

  const visiblePages = getVisiblePageNumbers();

  const handlePrevious = () => {
    if (hasPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between text-sm text-[#717179]">
        <div>
          Showing {total} item{total !== 1 ? "s" : ""}
        </div>
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <select
              value={pagination.limit}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              className="bg-[#212124] border border-white/10 rounded px-2 py-1 text-white text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      {/* Results info */}
      <div className="text-[#717179]">
        Showing {pagination.offset + 1} to{" "}
        {Math.min(pagination.offset + pagination.limit, total)} of {total} items
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Page size selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2 mr-4">
            <span className="text-[#717179]">Per page:</span>
            <select
              value={pagination.limit}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              className="bg-[#212124] border border-white/10 rounded px-2 py-1 text-white text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious}
          className="px-3 py-1 rounded border border-white/10 bg-[#212124] text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-2 py-1 text-[#717179]">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-1 rounded border transition-colors ${
                    currentPage === page
                      ? "border-[#B5F200] bg-[#B5F200]/10 text-[#B5F200] font-medium"
                      : "border-white/10 bg-[#212124] text-white hover:bg-white/5"
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!hasNext}
          className="px-3 py-1 rounded border border-white/10 bg-[#212124] text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
