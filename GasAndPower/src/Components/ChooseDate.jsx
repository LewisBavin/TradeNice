import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB";
import React from "react";
import { setDefaultOptions } from "date-fns";
import { useState } from "react";
import { useRef } from "react";
setDefaultLocale("enGB", enGB);

const ChooseDate = ({ id, selected, range, onChange }) => {
  let ref = React.createRef()
  return (
    <>
      <DatePicker
        id={id}
        ref={ref}
        dateFormat="dd/MM/yyyy"
        selected={selected}
        onChange={(date) => {
          console.log(ref.current.props.id)
          onChange(date)
        }}
      />
    </>
  );
};

export default ChooseDate;
