"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = {
  selected: Date | null
  onChange: (date: Date | null) => void
  className?: string
  minDate?: Date
  maxDate?: Date
  placeholderText?: string
  dateFormat?: string
  showPopperArrow?: boolean
}

function Calendar({
  selected,
  onChange,
  className,
  minDate,
  maxDate,
  placeholderText = "Select date",
  dateFormat = "MMMM d, yyyy",
  showPopperArrow = false,
}: CalendarProps) {
  return (
    <div className={cn("relative", className)}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholderText}
        dateFormat={dateFormat}
        showPopperArrow={showPopperArrow}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full text-left"
        )}
        calendarClassName="!bg-white p-2 rounded-md shadow-md"
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex justify-between items-center mb-2 px-2">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "p-1 disabled:opacity-50"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {date.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "p-1 disabled:opacity-50"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }