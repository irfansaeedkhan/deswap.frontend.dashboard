import React, { useState, useEffect } from "react";
import ArrowDown from "@/assets/svgAssets/ArrowDown";
import Image from "next/image";

const DropDownV2 = ({ data, placeholder, getDropdownValue, title }) => {
  const [isOpen, setOpen] = useState(false);
  const [items, setItem] = useState(data);
  const [selectedItem, setSelectedItem] = useState(null);
  const toggleDropdown = () => setOpen(!isOpen);
  const handleItemClick = (id) => {
    selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
    toggleDropdown();
  };

  return (
    <div className="dropdownV2">
      {title && <p>{title}</p>}
      <div className="dropdownV2-header" onClick={toggleDropdown}>
        {selectedItem
          ? items.find((item) => item.id == selectedItem).label
          : placeholder}
        <ArrowDown />
      </div>
      <ul className={`dropdownV2-body ${isOpen && "open"}`}>
        {items?.map((item, index) => (
          <li
            key={index}
            className="dropdownV2-item"
            onClick={(e) => {
              handleItemClick(e.target.id);
              getDropdownValue && getDropdownValue(item.label);
            }}
            id={item.id}
          >
            {item.label}
            <span
              className={`dropdownV2-item-dot ${
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

export default DropDownV2;
