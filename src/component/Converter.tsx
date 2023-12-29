import React, { useState, useEffect } from "react";

const Currencies = ["RUB", "USD", "EUR", "PLN", "CZK"];

type FlexDirection = "row" | "column";

export function Converter() {
  const [currency, setCurrency] = useState("USD");
  const URL = `https://api.nbrb.by/exrates/rates/${currency}?parammode=2`;

  const [from, setFrom] = useState(1.0);
  const [to, setTo] = useState('');

  const [width, setWidth] = useState<number | null>(null);
  const [flex, setFlex] = useState<FlexDirection>("row");
  const [wFull, setwFull] = useState("50%");
  const [dNone, setdNone] = useState("flex");
  const [BYN, setBYN] = useState("");

  useEffect(() => {
    Convert();
  },[]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Вызываем handleResize при монтировании компонента
    handleResize();

    // Добавляем обработчик события изменения размера окна
    window.addEventListener("resize", handleResize);

    // Убираем обработчик события при демонтировании компонента
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    let flex: "row" | "column" = "row";
    let wF: "100%" | "auto" = "auto";
    let disp: "flex" | "none" = "flex";
    let byn: " BYN" | "" = "";
    if (width && width <= 768) {
      flex = "column";
      wF = "100%";
      disp = "none";
      byn = " BYN";
    }

    setwFull(wF);
    setFlex(flex);
    setdNone(disp);
    setBYN(byn);
  }, [width]);


  const Convert = async () => {
    await fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        // setFrom(parseFloat(event.target.value));
        setTo((parseFloat(((from * data.Cur_OfficialRate) / data.Cur_Scale).toFixed(4))).toString()+`${BYN}`);
        console.log(BYN);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="bg-white flex w-1/2 flex-row justify-around p-2"
    style={{ flexDirection: `${flex}`, width: `${wFull}` }}>
      {/* FROM */}
      <div className="flex flex-col">
        <ul className="flex flex-row font-semibold justify-center">
          {Currencies.map((cur) => (
            <li
              onClick={() => setCurrency(cur)}
              className={
                currency === cur
                  ? "bg-blue-400 p-2 transition-all duration-500 text-white"
                  : "p-2 m-2 bg-slate-200"
              }
              key={cur}
            >
              {cur}
            </li>
          ))}
        </ul>
        <input
          className="border-2 border-blue-400 rounded outline-none appearance-none h-20 p-10"
          placeholder="Value1"
          type="number"
          value={from}
          onChange={(event) => setFrom(parseFloat(event.target.value))}
        ></input>
      </div>

      <div className="flex items-end justify-center">
        <button className="border-2 rounded bg-blue-400 relative h-20 py-10 px-5 flex items-center"
        onClick={Convert}>
          Convert
        </button>
      </div>

      <div className="flex flex-col">
        
        <ul className="flex flex-row font-semibold justify-center"
        style={{ display: `${dNone}` }}>
          <li className="bg-blue-400 p-2 transition-all duration-500 text-white">
            BYN
          </li>
          <li className="py-2 my-2 bg-white-200 invisible ">)</li>
        </ul>

        <input
          className="border-2 border-blue-400 rounded outline-none appearance-none h-20 p-10"
          placeholder="Value1"
          type="text"
          value={to}
          readOnly
          onClick={Convert}
        ></input>

      </div>
    </div>
  );
}
