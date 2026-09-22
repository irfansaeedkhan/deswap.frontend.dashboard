import React, { useEffect, useRef, useState } from "react";
import ArrowDown from "@/assets/svgAssets/ArrowDown";
import Image from "next/image";

export const MONTH_OPTIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
].map((label, id) => ({ id, label }));

/**
 * Themed dropdown used across dashboard (not native <select>).
 */
const Dropdown = ({
  data,
  placeholder,
  getDropdownValue,
  defaultSelected = null,
  className = "",
}) => {
  const [isOpen, setOpen] = useState(false);
  const [items, setItem] = useState(data || []);
  const [selectedItem, setSelectedItem] = useState(defaultSelected);
  const rootRef = useRef(null);

  useEffect(() => {
    setItem(data || []);
  }, [data]);

  useEffect(() => {
    setSelectedItem(defaultSelected);
  }, [defaultSelected]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const toggleDropdown = () => setOpen((open) => !open);
  const handleItemClick = (item) => {
    setSelectedItem(item.id);
    setOpen(false);
    if (getDropdownValue) {
      getDropdownValue(item.label, item);
    }
  };

  const selectedLabel =
    selectedItem != null
      ? items.find((item) => item.id == selectedItem)?.label
      : null;

  return (
    <div className={`dropdown ${className}`.trim()} ref={rootRef}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span className="dropdown-label">{selectedLabel || placeholder}</span>
        <ArrowDown />
      </div>
      <ul className={`dropdown-body ${isOpen && "open"}`}>
        {items?.map((item, index) => (
          <li
            key={item.id ?? index}
            className="dropdown-item"
            onClick={() => handleItemClick(item)}
          >
            {item.label}
            <span
              className={`dropdown-item-dot ${
                item.id == selectedItem && "selected"
              }`}
            >
              <Image
                width={18}
                height={13}
                src="/images/tick.png"
                alt="tick icon"
                loading="lazy"
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function MonthDropdown({ onSelectIndex, onSelectLabel, className = "" }) {
  const current = new Date().getMonth();
  return (
    <Dropdown
      className={`monthDropdown ${className}`.trim()}
      data={MONTH_OPTIONS}
      defaultSelected={current}
      placeholder={MONTH_OPTIONS[current].label}
      getDropdownValue={(label, item) => {
        if (onSelectLabel) onSelectLabel(label);
        if (onSelectIndex) onSelectIndex(item.id);
      }}
    />
  );
}

export default Dropdown;
