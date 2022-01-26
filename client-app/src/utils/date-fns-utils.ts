import {format} from "date-fns"

export function formatDate(date: Date | null, dateFormat: string)
{
    if(!date)
        return "INCORRECT DATE";

    return format(date!, dateFormat);
}