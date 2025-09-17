import * as React from "react"
import { isValid, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({
  className,
  date,
  setDate,
  singleDate = false
}) {
  const getButtonText = () => {
    if (singleDate) {
      return date && isValid(new Date(date)) ? format(new Date(date), "LLL dd, y") : <span>Pick a date</span>;
    }
    
    if (date?.from && isValid(new Date(date.from))) {
      if (date.to && isValid(new Date(date.to))) {
        return (
          <>
            {format(new Date(date.from), "LLL dd, y")} - {format(new Date(date.to), "LLL dd, y")}
          </>
        );
      }
      return format(new Date(date.from), "LLL dd, y");
    }
    
    return <span>Pick a date</span>;
  };

  const calendarMode = singleDate ? 'single' : 'range';
  const selectedDate = singleDate ? (date && isValid(new Date(date)) ? new Date(date) : undefined) : date;
  
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getButtonText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode={calendarMode}
            defaultMonth={singleDate ? selectedDate : date?.from}
            selected={selectedDate}
            onSelect={setDate}
            numberOfMonths={singleDate ? 1 : 2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}