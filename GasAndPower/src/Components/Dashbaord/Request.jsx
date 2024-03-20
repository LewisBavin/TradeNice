import React from "react";

const Request = ({ req, buttons }) => {
  const { ref, start, end, volume } = req;
  const func = () => {};

  return (
    <>
      <div className="request flx">
        <div className="details">
          <label htmlFor="ref">ref</label>
          <input onChange={func} value={ref} type="text" name="ref" size={1} />
          <label htmlFor="start">start</label>
          <input
            onChange={func}
            value={start}
            type="text"
            name="start"
            size={6}
          />
          <label htmlFor="end">end</label>
          <input onChange={func} value={end} type="text" name="end" size={6} />
          <label htmlFor="volume">end</label>
          <input
            onChange={func}
            value={volume}
            type="text"
            name="volume"
            size={3}
          />
        </div>
        <div className="actions flx">
          {buttons.map((button, i) => {
            return (
              <div key={i} className="action">
                {button}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Request;
