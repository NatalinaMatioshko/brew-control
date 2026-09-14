"use client";

import { useMemo, useState } from "react";
import { compute } from "@/lib/opening-calculator/calc";
import { DEFAULT_CUPS_PER_DAY, MENU_ITEMS } from "@/lib/opening-calculator/constants";
import { parseCupsPerDay, parseDays, parseNonNegative } from "@/lib/opening-calculator/format";
import { Controls } from "./controls";
import { FooterBar } from "./footer-bar";
import { Hero } from "./hero";
import { MenuPanel } from "./menu-panel";
import {
  CoffeePanel,
  ExtraExpensesPanel,
  ResultsPanel,
  WishlistPanel,
} from "./results-panel";
import styles from "./opening-calculator.module.css";

export function OpeningCalculator() {
  const [days, setDays] = useState(14);
  const [reserve, setReserve] = useState(0.15);
  const [takeaway, setTakeaway] = useState(0.7);
  const [cupsPerDay, setCupsPerDay] = useState(DEFAULT_CUPS_PER_DAY);
  const [menu, setMenu] = useState(MENU_ITEMS);

  const rows = useMemo(
    () => menu.map((item) => ({ ...item, total: item.daily * days })),
    [menu, days],
  );

  const data = useMemo(
    () => compute(rows, { days, reserve, takeaway }),
    [rows, days, reserve, takeaway],
  );

  function handleDailyChange(id: string, value: string) {
    const daily = parseNonNegative(value);
    setMenu((current) =>
      current.map((item) => (item.id === id ? { ...item, daily } : item)),
    );
  }

  return (
    <div className={styles.root}>
      <main className={styles.wrap}>
        <Hero days={days} />
        <Controls
          days={days}
          reserve={reserve}
          takeaway={takeaway}
          cupsPerDay={cupsPerDay}
          onDaysChange={(value) => setDays(parseDays(value))}
          onReserveChange={(value) => setReserve(Number(value))}
          onTakeawayChange={(value) => setTakeaway(Number(value))}
          onCupsPerDayChange={(value) => setCupsPerDay(parseCupsPerDay(value))}
        />
        <MenuPanel
          rows={rows}
          cupsPerDay={cupsPerDay}
          data={data}
          onDailyChange={handleDailyChange}
        />
        <ResultsPanel data={data} />
        <ExtraExpensesPanel data={data} />
        <CoffeePanel data={data} />
        <WishlistPanel data={data} />
        <FooterBar />
      </main>
    </div>
  );
}
