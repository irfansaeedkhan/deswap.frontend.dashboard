import React from "react";

/**
 * Drop-in replacement for react-js-pagination (broken under React 19).
 * Same prop surface used across this codebase.
 */
export default function Pagination({
  activePage = 1,
  itemsCountPerPage = 10,
  totalItemsCount = 0,
  pageRangeDisplayed = 5,
  onChange,
  innerClass = "pagination",
  activeClass = "active",
  hideDisabled = true,
  disabledClass = "disabled",
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(Number(totalItemsCount || 0) / Math.max(1, Number(itemsCountPerPage) || 10))
  );
  const current = Math.min(Math.max(1, Number(activePage) || 1), totalPages);

  const half = Math.floor(pageRangeDisplayed / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(totalPages, start + pageRangeDisplayed - 1);
  start = Math.max(1, end - pageRangeDisplayed + 1);

  const pages = [];
  for (let i = start; i <= end; i += 1) pages.push(i);

  const go = (page) => {
    if (!onChange) return;
    if (page < 1 || page > totalPages) return;
    if (page === current) return;
    onChange(page);
  };

  const prevDisabled = current <= 1;
  const nextDisabled = current >= totalPages;

  return (
    <ul className={innerClass}>
      {!(hideDisabled && prevDisabled) && (
        <li className={prevDisabled ? disabledClass : undefined}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!prevDisabled) go(current - 1);
            }}
          >
            Prev
          </a>
        </li>
      )}
      {pages.map((page) => (
        <li key={page} className={page === current ? activeClass : undefined}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              go(page);
            }}
          >
            {page}
          </a>
        </li>
      ))}
      {!(hideDisabled && nextDisabled) && (
        <li className={nextDisabled ? disabledClass : undefined}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!nextDisabled) go(current + 1);
            }}
          >
            Next
          </a>
        </li>
      )}
    </ul>
  );
}
