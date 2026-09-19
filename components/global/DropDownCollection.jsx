import React, { useState, useEffect } from "react";
import ArrowDown from "@/assets/svgAssets/ArrowDown";
import Image from "next/image";

const Dropdown = ({ data, placeholder, getDropdownValue }) => {
  const [isOpen, setOpen] = useState(false);
  const [items, setItem] = useState(data);
  const [selectedItem, setSelectedItem] = useState(null);
  const toggleDropdown = () => setOpen(!isOpen);
  const handleItemClick = (id) => {
    selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
    toggleDropdown();
  };
  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedItem
          ? data.find((item) => item.id == selectedItem)._collectionName
          : placeholder}
        <ArrowDown />
      </div>
      <ul className={`dropdown-body ${isOpen && "open"}`}>
        {data?.map((item, index) => (
          <li
            key={index}
            className="dropdown-item"
            onClick={(e) => {
              handleItemClick(e.target.id);
              getDropdownValue && getDropdownValue(item._collection);
            }}
            id={item.id}
          >
            {item._collectionName}
            <span
              className={`dropdown-item-dot ${
                item.id == selectedItem && "selected"
              }`}
            >
              {" "}
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

export default Dropdown;
